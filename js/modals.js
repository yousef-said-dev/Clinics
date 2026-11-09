/**
 * نبض — النوافذ المنبثقة (Modals)
 * Frontend-Only Prototype (HTML5, CSS3, Vanilla JS, LocalStorage)
 * Part of the modular build. Load order is defined in index.html.
 */

'use strict';

  const Modals = {
    // Add slot modal
    openAddSlotModal(dateIso) {
      const date = DateHelper.fromISODate(dateIso);
      const dayKey = DateHelper.getDayKey(date);
      const dayName = DateHelper.getDayName(dayKey);
      const settings = ClinicEngine.getSettings();
      const defaultDuration = settings.defaultDuration || 30;

      // Smart default times
      const existingSlots = ClinicEngine.getScheduleForDate(dateIso);
      let defaultStart = '17:00'; // Default 5:00 PM for testing!
      if (existingSlots.some(s => s.startTime === defaultStart)) {
        defaultStart = '18:00';
      }
      const defaultEnd = DateHelper.minutesToTime(DateHelper.timeToMinutes(defaultStart) + defaultDuration);

      const html = `
        <div class="modal__head">
          <div>
            <h2>${Icons.plus} إضافة جلسة عمل جديدة</h2>
            <p>ليوم ${dayName}، ${DateHelper.formatDateArabic(dateIso)}</p>
          </div>
          <button class="modal__close" data-modal-close aria-label="إغلاق">${Icons.x}</button>
        </div>

        <form id="modal-add-slot-form">
          <div class="modal__body">
            <div class="modal-form-grid">
              <div class="field">
                <label for="slot-start-time">وقت بداية الجلسة *</label>
                <input type="time" id="slot-start-time" class="input" required value="${defaultStart}">
              </div>
              <div class="field">
                <label for="slot-end-time">وقت نهاية الجلسة *</label>
                <input type="time" id="slot-end-time" class="input" required value="${defaultEnd}">
              </div>
            </div>

            <div class="duration-hint" style="margin-top: 10px;">
              ${Icons.clock} <span id="add-duration-preview">مدة الجلسة: ${defaultDuration} دقيقة</span>
            </div>

            <div class="modal-section-label">نطاق تطبيق الموعد الجديد</div>
            <div class="scope-options">
              <label class="scope-option">
                <input type="radio" name="slotScope" value="weekly" checked>
                <span class="scope-option__radio"></span>
                <div class="scope-option__copy">
                  <strong>${Icons.calendar} تطبيق على الجدول الأسبوعي المتكرر (موصى به)</strong>
                  <span>ستتكرر هذه الجلسة في جميع أيام ${dayName} القادمة في جدول العيادة.</span>
                </div>
              </label>

              <label class="scope-option">
                <input type="radio" name="slotScope" value="single">
                <span class="scope-option__radio"></span>
                <div class="scope-option__copy">
                  <strong>${Icons.clock} تطبيق على هذا التاريخ فقط (${DateHelper.formatDateArabic(dateIso, false)})</strong>
                  <span>ستضاف الجلسة كاستثناء لهذا اليوم فقط دون التأثير على باقي الأسابيع.</span>
                </div>
              </label>
            </div>
          </div>

          <div class="modal__foot">
            <button type="button" class="btn btn--outline" data-modal-close>إلغاء</button>
            <button type="submit" class="btn btn--accent">${Icons.check} حفظ الجلسة</button>
          </div>
        </form>
      `;

      Modal.open(html);

      // Duration auto update helper
      const startInput = document.getElementById('slot-start-time');
      const endInput = document.getElementById('slot-end-time');
      const preview = document.getElementById('add-duration-preview');

      const updateDur = () => {
        if (!startInput || !endInput || !preview) return;
        const diff = DateHelper.timeToMinutes(endInput.value) - DateHelper.timeToMinutes(startInput.value);
        if (diff > 0) preview.textContent = `مدة الجلسة: ${diff} دقيقة (${DateHelper.formatTimeArabic(startInput.value)} إلى ${DateHelper.formatTimeArabic(endInput.value)})`;
        else preview.textContent = 'تنبيه: وقت النهاية يجب أن يكون بعد البداية';
      };

      startInput?.addEventListener('input', updateDur);
      endInput?.addEventListener('input', updateDur);

      // Form submit
      document.getElementById('modal-add-slot-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const startTime = startInput.value;
        const endTime = endInput.value;
        const scope = document.querySelector('input[name="slotScope"]:checked')?.value || 'weekly';

        const res = ClinicEngine.addSlot({ dayKey, dateIso, startTime, endTime, scope });
        if (res.success) {
          Modal.close();
          showToast('تمت الإضافة', `تمت إضافة جلسة (${DateHelper.formatTimeArabic(startTime)} - ${DateHelper.formatTimeArabic(endTime)}) بنجاح.`, 'success');
          App.refreshCurrentView();
        } else {
          showToast('تعذر الحفظ', res.error, 'error');
        }
      });
    },

    // Edit slot modal
    openEditSlotModal(slot, dateIso) {
      const date = DateHelper.fromISODate(dateIso);
      const dayKey = DateHelper.getDayKey(date);
      const dayName = DateHelper.getDayName(dayKey);

      const html = `
        <div class="modal__head">
          <div>
            <h2>${Icons.edit} تعديل وقت الجلسة</h2>
            <p>الجلسة الحالية: ${DateHelper.formatTimeArabic(slot.startTime)} - ${DateHelper.formatTimeArabic(slot.endTime)}</p>
          </div>
          <button class="modal__close" data-modal-close aria-label="إغلاق">${Icons.x}</button>
        </div>

        <form id="modal-edit-slot-form">
          <div class="modal__body">
            <div class="modal-form-grid">
              <div class="field">
                <label for="edit-start-time">وقت البداية الجديد *</label>
                <input type="time" id="edit-start-time" class="input" required value="${slot.startTime}">
              </div>
              <div class="field">
                <label for="edit-end-time">وقت النهاية الجديد *</label>
                <input type="time" id="edit-end-time" class="input" required value="${slot.endTime}">
              </div>
            </div>

            <div class="modal-section-label">نطاق تطبيق التعديل</div>
            <div class="scope-options">
              <label class="scope-option">
                <input type="radio" name="editScope" value="single" checked>
                <span class="scope-option__radio"></span>
                <div class="scope-option__copy">
                  <strong>${Icons.clock} تطبيق التعديل على هذا التاريخ فقط (${DateHelper.formatDateArabic(dateIso, false)})</strong>
                  <span>تعديل استثنائي لهذا اليوم دون تغيير المواعيد في الأسابيع الأخرى.</span>
                </div>
              </label>

              <label class="scope-option">
                <input type="radio" name="editScope" value="weekly">
                <span class="scope-option__radio"></span>
                <div class="scope-option__copy">
                  <strong>${Icons.calendar} تطبيق على الجدول الأسبوعي المتكرر (جميع أيام ${dayName})</strong>
                  <span>تعديل الموعد الدائم في الجدول الأسبوعي مع الحفاظ التام على الحجوزات السابقة.</span>
                </div>
              </label>
            </div>
          </div>

          <div class="modal__foot">
            <button type="button" class="btn btn--outline" data-modal-close>إلغاء</button>
            <button type="submit" class="btn btn--accent">${Icons.check} حفظ التعديلات</button>
          </div>
        </form>
      `;

      Modal.open(html);

      document.getElementById('modal-edit-slot-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const startTime = document.getElementById('edit-start-time').value;
        const endTime = document.getElementById('edit-end-time').value;
        const scope = document.querySelector('input[name="editScope"]:checked')?.value || 'single';

        const res = ClinicEngine.editSlot({ slotId: slot.id, dayKey, dateIso, startTime, endTime, scope });
        if (res.success) {
          Modal.close();
          showToast('تم التعديل', 'تم تحديث توقيت الجلسة بنجاح.', 'success');
          App.refreshCurrentView();
        } else {
          showToast('تعذر التعديل', res.error, 'error');
        }
      });
    },

    // Delete slot modal
    openDeleteSlotModal(slot, dateIso) {
      const date = DateHelper.fromISODate(dateIso);
      const dayKey = DateHelper.getDayKey(date);
      const dayName = DateHelper.getDayName(dayKey);

      const html = `
        <div class="modal__head">
          <div>
            <h2>${Icons.trash} تأكيد حذف جلسة العمل</h2>
            <p>الجلسة: ${DateHelper.formatTimeArabic(slot.startTime)} - ${DateHelper.formatTimeArabic(slot.endTime)}</p>
          </div>
          <button class="modal__close" data-modal-close aria-label="إغلاق">${Icons.x}</button>
        </div>

        <form id="modal-delete-slot-form">
          <div class="modal__body">
            <div class="modal-section-label">اختر نطاق الحذف:</div>
            <div class="scope-options">
              <label class="scope-option">
                <input type="radio" name="deleteScope" value="single" checked>
                <span class="scope-option__radio"></span>
                <div class="scope-option__copy">
                  <strong>${Icons.clock} إلغاء الجلسة في هذا التاريخ فقط (${DateHelper.formatDateArabic(dateIso, false)})</strong>
                  <span>حذف الجلسة اليوم كعطلة أو استثناء مع بقائها في الأسابيع التالية.</span>
                </div>
              </label>

              <label class="scope-option">
                <input type="radio" name="deleteScope" value="weekly">
                <span class="scope-option__radio"></span>
                <div class="scope-option__copy">
                  <strong>${Icons.calendar} حذف نهائي من الجدول الأسبوعي المتكرر (جميع أيام ${dayName})</strong>
                  <span>حذف الجلسة تماماً من الجدول الأسبوعي الدائم. الحجوزات السابقة لن تُمس.</span>
                </div>
              </label>
            </div>
          </div>

          <div class="modal__foot">
            <button type="button" class="btn btn--outline" data-modal-close>تراجع</button>
            <button type="submit" class="btn btn--danger">${Icons.trash} تأكيد الحذف</button>
          </div>
        </form>
      `;

      Modal.open(html);

      document.getElementById('modal-delete-slot-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const scope = document.querySelector('input[name="deleteScope"]:checked')?.value || 'single';

        ClinicEngine.deleteSlot({ slotId: slot.id, dayKey, dateIso, scope });
        Modal.close();
        showToast('تم الحذف', 'تم حذف الجلسة المحددة بنجاح.', 'success');
        App.refreshCurrentView();
      });
    },

    // Booking Details Modal
    openBookingDetailsModal(bookingId) {
      const bookings = ClinicEngine.getBookings();
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        showToast('خطأ', 'لم يتم العثور على الحجز المطلوب.', 'error');
        return;
      }

      const settings = ClinicEngine.getSettings();

      const html = `
        <div class="modal__head">
          <div class="booking-detail-head">
            <div class="patient-avatar">${booking.patientName.charAt(0) || 'م'}</div>
            <div>
              <h2>${booking.patientName}</h2>
              <p>كود الحجز: <code>${booking.id}</code> <span class="dot"></span> هاتف: ${booking.patientPhone}</p>
            </div>
          </div>
          <button class="modal__close" data-modal-close aria-label="إغلاق">${Icons.x}</button>
        </div>

        <div class="modal__body">
          <div class="booking-detail-grid">
            <div class="detail-block">
              <span>${Icons.calendar} تاريخ الكشف الطبي</span>
              <strong>${DateHelper.formatDateArabic(booking.date)}</strong>
            </div>

            <div class="detail-block">
              <span>${Icons.clock} توقيت الجلسة</span>
              <strong>${DateHelper.formatTimeArabic(booking.startTime)} - ${DateHelper.formatTimeArabic(booking.endTime)}</strong>
            </div>

            <div class="detail-block">
              <span>${Icons.cash} قيمة الكشف المسددة</span>
              <strong class="price">${booking.amount} ${booking.currency}</strong>
            </div>

            <div class="detail-block">
              <span>${Icons.wallet} طريقة الدفع الإلكتروني</span>
              <strong>${booking.paymentMethod} (${booking.walletPhone || booking.patientPhone})</strong>
            </div>

            <div class="detail-block">
              <span>${Icons.shield} رقم عملية الدفع</span>
              <strong class="ltr">${booking.paymentId}</strong>
            </div>

            <div class="detail-block">
              <span>${Icons.checkCircle} حالة الحجز الحالية</span>
              <div>
                <span class="badge ${booking.bookingStatus === 'confirmed' ? 'badge--green' : booking.bookingStatus === 'completed' ? 'badge--blue' : 'badge--red'}">
                  ${booking.bookingStatus === 'confirmed' ? 'مؤكد في العيادة' : booking.bookingStatus === 'completed' ? 'تم الحضور واكتمال الكشف' : 'حجز ملغي'}
                </span>
              </div>
            </div>

            <div class="detail-note">
              ${Icons.info}
              <span>${booking.notes || 'تم تأكيد الحجز إلكترونياً وسداد الرسوم بنجاح عبر محفظة فودافون كاش.'}</span>
            </div>
          </div>
        </div>

        <div class="modal__foot">
          <button type="button" class="btn btn--outline" id="print-modal-receipt-btn">${Icons.printer} طباعة إيصال الحجز</button>
          
          ${booking.bookingStatus === 'confirmed' ? `
            <button type="button" class="btn btn--outline btn--danger-soft" id="cancel-booking-btn">إلغاء الحجز</button>
            <button type="button" class="btn btn--accent" id="complete-booking-btn">${Icons.check} تم حضور المريض</button>
          ` : `
            <button type="button" class="btn btn--outline" data-modal-close>إغلاق</button>
          `}
        </div>
      `;

      Modal.open(html);

      document.getElementById('print-modal-receipt-btn')?.addEventListener('click', () => {
        window.print();
      });

      document.getElementById('complete-booking-btn')?.addEventListener('click', () => {
        ClinicEngine.updateBookingStatus(booking.id, 'completed');
        Modal.close();
        showToast('تم التحديث', 'تم تسجيل اكتمال الكشف بنجاح.', 'success');
        App.refreshCurrentView();
      });

      document.getElementById('cancel-booking-btn')?.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟ ستصبح الجلسة متاحة للحجز مرة أخرى.')) {
          ClinicEngine.updateBookingStatus(booking.id, 'cancelled');
          Modal.close();
          showToast('تم الإلغاء', 'تم إلغاء الحجز وأصبحت الجلسة متاحة مجدداً.', 'info');
          App.refreshCurrentView();
        }
      });
    },

    // Reset Data Modal
    openResetDataConfirm() {
      const html = `
        <div class="modal__head">
          <div>
            <h2>${Icons.alert} استعادة البيانات التجريبية</h2>
            <p>إعادة ضبط نظام العيادة بالكامل</p>
          </div>
          <button class="modal__close" data-modal-close aria-label="إغلاق">${Icons.x}</button>
        </div>
        <div class="modal__body">
          <div class="confirm-copy">
            <div class="modal__icon modal__icon--amber">${Icons.refresh}</div>
            <h2>هل تود إعادة ضبط البيانات؟</h2>
            <p>سيتم استعادة جدول المواعيد الافتراضي لعيادة د. أحمد محمد، وإعادة الحساب التجريبي وكلمة المرور الأصلية (Doctor@123).</p>
          </div>
        </div>
        <div class="modal__foot">
          <button type="button" class="btn btn--outline" data-modal-close>إلغاء</button>
          <button type="button" class="btn btn--accent" id="confirm-reset-btn">${Icons.refresh} تأكيد إعادة الضبط</button>
        </div>
      `;

      Modal.open(html);

      document.getElementById('confirm-reset-btn')?.addEventListener('click', () => {
        initDemoData(true);
        Modal.close();
        showToast('تمت إعادة الضبط', 'تم استعادة البيانات التجريبية الأولية بنجاح.', 'success');
        App.refreshCurrentView();
      });
    },

    // Logout Modal
    openLogoutConfirm() {
      const html = `
        <div class="modal__head">
          <div>
            <h2>تسجيل الخروج</h2>
          </div>
          <button class="modal__close" data-modal-close aria-label="إغلاق">${Icons.x}</button>
        </div>
        <div class="modal__body">
          <div class="confirm-copy">
            <div class="modal__icon modal__icon--danger">${Icons.logout}</div>
            <h2>تأكيد تسجيل الخروج</h2>
            <p>هل تود تسجيل الخروج من لوحة تحكم الطبيب؟ سيتطلب الدخول مجدداً كتابة كلمة المرور.</p>
          </div>
        </div>
        <div class="modal__foot">
          <button type="button" class="btn btn--outline" data-modal-close>تراجع</button>
          <button type="button" class="btn btn--danger" id="confirm-logout-btn">نعم، تسجيل الخروج</button>
        </div>
      `;

      Modal.open(html);

      document.getElementById('confirm-logout-btn')?.addEventListener('click', () => {
        Auth.logout();
        Modal.close();
        showToast('تم تسجيل الخروج', 'تم إنهاء الجلسة بأمان.', 'info');
        App.navigate('doctor-login');
      });
    }
  };
