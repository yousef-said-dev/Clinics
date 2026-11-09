/**
 * نبض — بوابة حجز المرضى (Patient Portal)
 * Frontend-Only Prototype (HTML5, CSS3, Vanilla JS, LocalStorage)
 * Part of the modular build. Load order is defined in index.html.
 */

(function () {
  'use strict';

  Object.assign(Views, {
    /* ---------------- PATIENT BOOKING INTERFACE ---------------- */
    PatientPortal() {
      const state = App.patientBookingState;
      const settings = ClinicEngine.getSettings();
      const firstDayKey = settings.firstDayOfWeek || 'sat';
      const weekDates = DateHelper.getCurrentWeekDates(firstDayKey);

      // Determine current booking step (1: Select slot, 2: Info, 3: Payment, 4: Confirmation)
      let step = 1;
      if (state.bookingResult) {
        step = 4;
      } else if (state.patientName && state.patientPhone && state.selectedSlot) {
        step = 3;
      } else if (state.selectedSlot) {
        step = 2;
      }

      // Step 1 selected date
      if (!state.selectedDate) {
        const todayIso = DateHelper.todayISO();
        state.selectedDate = weekDates.some(w => w.iso === todayIso) ? todayIso : weekDates[0].iso;
      }

      let stepContentHtml = '';
      if (step === 1) stepContentHtml = Views.PatientStep1(weekDates);
      else if (step === 2) stepContentHtml = Views.PatientStep2();
      else if (step === 3) stepContentHtml = Views.PatientStep3();
      else if (step === 4) stepContentHtml = Views.PatientStep4();

      return `
        <div class="patient-shell">
          <!-- Public Header -->
          <header class="public-header">
            <div class="transit-wipe" id="transit-wipe"><div class="transit-wipe__strip"></div><div class="transit-wipe__strip"></div><div class="transit-wipe__strip"></div></div>
            <div class="public-header__inner">
              <div class="brand">
                <div class="brand-mark">
                  <svg viewBox="0 0 64 64" fill="none"><path d="M12 34h11l6-17 9 31 6-22 4 8h9" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="brand-word">
                  <strong>${settings.clinicName || 'عيادة الشفاء'}</strong>
                  <span>حجز موعد كشف طبي</span>
                </div>
              </div>
              <div class="public-header__actions">
                <button class="btn btn--outline btn--sm" id="patient-to-doctor-btn">
                  ${Icons.stethoscope} دخول الطبيب
                </button>
              </div>
            </div>
          </header>

          <main class="patient-main ${step === 4 ? 'patient-main--wide' : ''}">
            <!-- Progress indicator -->
            <div class="booking-progress-wrap">
              <div class="booking-progress">
                <div class="progress-step ${step > 1 ? 'is-complete' : step === 1 ? 'is-active' : ''}">
                  <div class="progress-step__circle">${step > 1 ? Icons.check : '1'}</div>
                  <span class="progress-step__label">اختيار الموعد</span>
                </div>
                <div class="progress-step ${step > 2 ? 'is-complete' : step === 2 ? 'is-active' : ''}">
                  <div class="progress-step__circle">${step > 2 ? Icons.check : '2'}</div>
                  <span class="progress-step__label">بيانات المريض</span>
                </div>
                <div class="progress-step ${step > 3 ? 'is-complete' : step === 3 ? 'is-active' : ''}">
                  <div class="progress-step__circle">${step > 3 ? Icons.check : '3'}</div>
                  <span class="progress-step__label">الدفع الإلكتروني</span>
                </div>
                <div class="progress-step ${step === 4 ? 'is-complete is-active' : ''}">
                  <div class="progress-step__circle">${step === 4 ? Icons.check : '4'}</div>
                  <span class="progress-step__label">تأكيد الحجز</span>
                </div>
              </div>
            </div>

            ${stepContentHtml}
          </main>

          <footer class="public-footer">
            <div class="public-footer__inner">
              <span>جميع الحقوق محفوظة © ${settings.clinicName || 'عيادة الشفاء'} • نظام نبض الطبي</span>
              <span>${Icons.shield} حجز آمن ومحمي بالكامل</span>
            </div>
          </footer>
        </div>
      `;
    },

    /* Step 1: Select slot */
    PatientStep1(weekDates) {
      const state = App.patientBookingState;
      const settings = ClinicEngine.getSettings();
      const selectedIso = state.selectedDate;
      const slots = ClinicEngine.getScheduleForDate(selectedIso);

      const datesRibbonHtml = weekDates.map(w => {
        const isSelected = w.iso === selectedIso;
        const daySlots = ClinicEngine.getScheduleForDate(w.iso);
        const availableCount = daySlots.filter(s => s.status === 'available').length;
        const isPastDate = w.iso < DateHelper.todayISO();

        return `
          <button class="booking-date ${isSelected ? 'is-selected' : ''} ${w.isToday ? 'is-today' : ''}" data-iso="${w.iso}" ${isPastDate ? 'disabled title="تاريخ سابق لا يمكن الحجز فيه"' : ''}>
            ${w.isToday ? '<span class="booking-date__today-dot" title="اليوم"></span>' : ''}
            <span class="booking-date__name">${w.dayName}</span>
            <span class="booking-date__num">${w.dayNum}</span>
            <span class="booking-date__slots ${availableCount === 0 ? 'no-slots' : ''}">
              ${isPastDate ? 'منتهي' : availableCount > 0 ? `${availableCount} متاح` : 'مكتمل'}
            </span>
          </button>
        `;
      }).join('');

      let sessionCardsHtml = '';
      if (slots.length === 0) {
        sessionCardsHtml = `
          <div class="session-empty" style="grid-column: 1 / -1;">
            <div class="icon">${Icons.calendar}</div>
            <h3>لا توجد مواعيد متاحة في هذا اليوم</h3>
            <p>يرجى اختيار يوم آخر من أيام الأسبوع الحالي المتاحة أعلاه.</p>
          </div>
        `;
      } else {
        sessionCardsHtml = slots.map(slot => {
          const isAvailable = slot.status === 'available';
          const isBooked = slot.status === 'booked';
          const isPast = slot.status === 'past';

          let statusBadge = '<span class="badge badge--green">متاح للحجز</span>';
          let actionText = `احجز الآن ${Icons.arrowLeft}`;

          if (isBooked) {
            statusBadge = '<span class="badge badge--navy">محجوز</span>';
            actionText = 'غير متاح';
          } else if (isPast) {
            statusBadge = '<span class="badge badge--gray">انتهى وقته</span>';
            actionText = 'انتهى';
          }

          return `
            <button class="session-option select-slot-btn" data-id="${slot.id}" data-start="${slot.startTime}" data-end="${slot.endTime}" ${!isAvailable ? 'disabled' : ''}>
              <div class="session-option__time">
                <strong>${slot.formattedStart}</strong>
                <span>إلى ${slot.formattedEnd}</span>
              </div>
              <div class="session-option__divider"></div>
              <div class="session-option__main">
                <strong>جلسة كشف عيادة</strong>
                <span>مدة الكشف: ${settings.defaultDuration || 30} دقيقة</span>
              </div>
              <div class="session-option__status">
                ${statusBadge}
                <span class="session-option__go">${actionText}</span>
              </div>
            </button>
          `;
        }).join('');
      }

      return `
        <div class="patient-page-head">
          <div>
            <div class="patient-kicker">${Icons.stethoscope} الحجز الإلكتروني المباشر</div>
            <h1>اختر موعد الكشف الطبي</h1>
            <p>تفضل باختيار اليوم والوقت المناسب لك خلال الأسبوع الجاري لحجز كشفك الطبي.</p>
          </div>
          <div class="week-badge">
            <span class="icon">${Icons.calendar}</span>
            <div>
              <span>الأسبوع المتاح للحجز</span>
              <strong>${DateHelper.formatDateArabic(weekDates[0].iso, false)} - ${DateHelper.formatDateArabic(weekDates[6].iso, false)}</strong>
            </div>
          </div>
        </div>

        <div class="patient-layout">
          <div class="booking-stage">
            <div class="booking-stage-card">
              <div class="booking-stage-card__head">
                <h2>
                  <span class="step-badge">1</span> اختر اليوم المناسب
                </h2>
                <p>الحجز متاح خلال أيام الأسبوع الحالي فقط وفقاً لجدول العيادة</p>
              </div>
              <div class="booking-stage-card__body">
                <div class="date-ribbon-label">
                  <strong>أيام الأسبوع الحالي:</strong>
                  <span>${Icons.clock} الأوقات بتوقيت القاهرة</span>
                </div>
                <div class="booking-dates">
                  ${datesRibbonHtml}
                </div>

                <div class="session-section-head">
                  <h3>${Icons.clock} المواعيد المتاحة ليوم ${DateHelper.formatDateArabic(selectedIso)}</h3>
                  <span>اختر التوقيت للمتابعة</span>
                </div>

                <div class="session-options">
                  ${sessionCardsHtml}
                </div>

                <div class="booking-note">
                  ${Icons.info}
                  <div>
                    <strong>تنويه:</strong> يتم تأكيد الحجز مباشرة بعد إتمام محاكاة الدفع عبر فودافون كاش في الخطوة التالية.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Doctor & Clinic Summary Sidebar -->
          <aside class="clinic-summary">
            <div class="clinic-summary__banner">
              <div class="clinic-summary__eyebrow">
                <span class="dot">•</span> الطبيب المعالج
              </div>
              <div class="clinic-doctor">
                <div class="doctor-avatar">د</div>
                <div>
                  <strong>${settings.doctorName || 'د. أحمد محمد'}</strong>
                  <span>${settings.specialty || 'طب الباطنة والجهاز الهضمي'}</span>
                </div>
              </div>
            </div>

            <div class="clinic-summary__body">
              <div class="clinic-info-list">
                <div class="clinic-info-row">
                  <span>${Icons.home} العيادة</span>
                  <strong>${settings.clinicName || 'عيادة الشفاء'}</strong>
                </div>
                <div class="clinic-info-row">
                  <span>${Icons.phone} هاتف العيادة</span>
                  <strong style="direction: ltr;">${settings.phone || '01001234567'}</strong>
                </div>
                <div class="clinic-info-row">
                  <span>${Icons.wallet} وسيلة الدفع</span>
                  <strong>فودافون كاش</strong>
                </div>
              </div>

              <div class="clinic-price">
                <div class="clinic-price__label">
                  <span>قيمة الكشف الطبي</span>
                  <span class="badge badge--green">شامل الضريبة</span>
                </div>
                <div class="clinic-price__value">
                  <strong>${settings.price || 100}</strong>
                  <span>${settings.currency || 'ج.م'}</span>
                </div>
              </div>

              <div class="clinic-features">
                <div class="clinic-feature">
                  <span class="feature-check">${Icons.check}</span>
                  <span>حجز إلكتروني فوري بدون إنشاء حساب</span>
                </div>
                <div class="clinic-feature">
                  <span class="feature-check">${Icons.check}</span>
                  <span>إيصال حجز وتأكيد رسمي قابل للطباعة</span>
                </div>
                <div class="clinic-feature">
                  <span class="feature-check">${Icons.check}</span>
                  <span>تنظيم كامل للدور بدون فترات انتظار طويلة</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      `;
    },

    /* Step 2: Patient Info */
    PatientStep2() {
      const state = App.patientBookingState;
      const settings = ClinicEngine.getSettings();
      const slot = state.selectedSlot;
      const dateIso = state.selectedDate;

      return `
        <div class="checkout-layout">
          <div class="checkout-main">
            <div class="card checkout-form">
              <div class="checkout-heading">
                <div>
                  <h2>بيانات المريض الأساسية</h2>
                  <p>لا يلزم إنشاء حساب أو كلمة مرور، فقط أدخل اسمك ورقم هاتفك المحمول للتواصل.</p>
                </div>
                <span class="badge badge--green">الخطوة 2 من 3</span>
              </div>

              <form id="patient-info-form">
                <div class="checkout-form-grid">
                  <div class="field">
                    <label for="patient-fullname">الاسم بالكامل (ثلاثي أو رباعي) *</label>
                    <input type="text" id="patient-fullname" class="input" placeholder="مثال: محمود إبراهيم الشناوي" required value="${state.patientName || ''}">
                    <span class="field-error" id="name-error" style="display: none; color: var(--red-600); font-size: 10px; margin-top: 3px;">يرجى إدخال اسم صحيح مكون من 3 أحرف على الأقل.</span>
                  </div>

                  <div class="field">
                    <label for="patient-phone">رقم الهاتف المحمول (مصر) *</label>
                    <div style="position: relative; display: flex; align-items: center;">
                      <input type="tel" id="patient-phone" class="input" placeholder="01012345678" required value="${state.patientPhone || ''}" style="direction: ltr; text-align: right; width: 100%;">
                    </div>
                    <span style="display: block; font-size: 10px; color: var(--muted); margin-top: 3px;">رقم هاتف مصري مكون من 11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015</span>
                    <span class="field-error" id="phone-error" style="display: none; color: var(--red-600); font-size: 10px; margin-top: 3px;">يرجى إدخال رقم هاتف محمول مصري صحيح (11 رقماً).</span>
                  </div>
                </div>

                <div class="btn-row">
                  <button type="button" class="btn btn--outline" id="back-to-step1-btn">
                    ${Icons.arrowRight} تغيير الموعد
                  </button>
                  <button type="submit" class="btn btn--accent">
                    المتابعة إلى الدفع الإلكتروني ${Icons.arrowLeft}
                  </button>
                </div>

                <div class="form-secure-note" style="margin-top: 15px;">
                  ${Icons.shield} بياناتك مشفرة ومحفوظة بسرية تامة ولا تتم مشاركتها خارج العيادة.
                </div>
              </form>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <aside class="order-summary">
            <div class="order-summary__head">
              <h2>${Icons.calendar} ملخص الحجز الطبي</h2>
            </div>
            <div class="order-summary__body">
              <div class="selected-appointment">
                <div class="selected-date-box">
                  <strong>${DateHelper.fromISODate(dateIso).getDate()}</strong>
                  <span>${MONTH_NAMES[DateHelper.fromISODate(dateIso).getMonth()]}</span>
                </div>
                <div class="selected-appointment__main">
                  <strong>${DateHelper.formatDateArabic(dateIso, false)}</strong>
                  <span>${Icons.clock} ${DateHelper.formatTimeArabic(slot.startTime)} - ${DateHelper.formatTimeArabic(slot.endTime)}</span>
                </div>
              </div>

              <div class="summary-lines">
                <div class="summary-line">
                  <span>${Icons.stethoscope} الطبيب المعالج</span>
                  <strong>${settings.doctorName || 'د. أحمد محمد'}</strong>
                </div>
                <div class="summary-line">
                  <span>${Icons.home} العيادة</span>
                  <strong>${settings.clinicName || 'عيادة الشفاء'}</strong>
                </div>
                <div class="summary-line">
                  <span>${Icons.clock} التخصص</span>
                  <strong>${settings.specialty || 'طب الباطنة'}</strong>
                </div>
              </div>

              <div class="summary-total">
                <span>المبلغ المطلوب سداده</span>
                <strong>${settings.price || 100} <small>${settings.currency || 'ج.م'}</small></strong>
              </div>

              <div class="summary-assurance">
                ${Icons.check} وسيلة الدفع المقبولة في الخطوة القادمة هي محفظة فودافون كاش.
              </div>
            </div>
          </aside>
        </div>
      `;
    },

    /* Step 3: Vodafone Cash Payment Gateway Simulation */
    PatientStep3() {
      const state = App.patientBookingState;
      const settings = ClinicEngine.getSettings();
      const slot = state.selectedSlot;
      const dateIso = state.selectedDate;
      const price = settings.price || 100;

      // Default wallet phone to patient's phone if it's vodafone (010) or patient's phone
      const defaultWalletPhone = state.patientPhone || '01012345678';

      return `
        <div class="payment-layout">
          <div class="payment-main">
            <div class="payment-main-inner card payment-card">
              <!-- Processing overlay (hidden by default) -->
              <div class="payment-processing" id="payment-processing-overlay" style="display: none;">
                <div class="processing-orbit">
                  ${Icons.wallet}
                </div>
                <h3>جاري معالجة عملية الدفع</h3>
                <p>يرجى الانتظار ثوانٍ معدودة، جاري التواصل الآمن مع بوابة فودافون كاش…</p>
                <div class="processing-progress">
                  <div class="processing-step is-current" id="p-step-1">
                    <span class="processing-step__dot">${Icons.check}</span>
                    <span>التحقق من صحة رقم المحفظة</span>
                  </div>
                  <div class="processing-step" id="p-step-2">
                    <span class="processing-step__dot">${Icons.check}</span>
                    <span>خصم وتحويل قيمة الكشف (${price} ج.م)</span>
                  </div>
                  <div class="processing-step" id="p-step-3">
                    <span class="processing-step__dot">${Icons.check}</span>
                    <span>إصدار إيصال وتأكيد الحجز النهائي</span>
                  </div>
                </div>
              </div>

              <div class="payment-card__head">
                <div>
                  <h2>محاكاة بوابة الدفع الإلكتروني</h2>
                  <p>اختر محفظة فودافون كاش لتأكيد حجز موعدك الطبي فوراً.</p>
                </div>
                <div class="payment-amount-chip">
                  <span>المبلغ المطلوب:</span>
                  <strong>${price}</strong>
                  <small>${settings.currency || 'ج.م'}</small>
                </div>
              </div>

              <div class="payment-card__body">
                <div class="payment-section-label">
                  <strong>وسيلة الدفع المتاحة</strong>
                  <span>محفظة إلكترونية</span>
                </div>

                <div class="payment-method">
                  <div class="payment-method__logo">
                    ${Icons.wallet}
                  </div>
                  <div class="payment-method__main">
                    <strong>فودافون كاش (Vodafone Cash)</strong>
                    <span>${Icons.shield} دفع فوري ومباشر لحساب العيادة</span>
                  </div>
                  <div class="payment-method__radio"></div>
                </div>

                <form id="payment-gateway-form" class="wallet-section">
                  <div class="field">
                    <label for="wallet-phone-input">رقم محفظة فودافون كاش المحول منها *</label>
                    <div class="wallet-field-shell">
                      <span class="country-prefix">+20 (مصر)</span>
                      <input type="tel" id="wallet-phone-input" class="input" placeholder="010xxxxxxxx" required value="${defaultWalletPhone}">
                      <span class="wallet-icon">${Icons.phone}</span>
                    </div>
                    <span class="field-error" id="wallet-error" style="display: none; color: var(--red-600); font-size: 10px; margin-top: 3px;">يرجى إدخال رقم محفظة فودافون كاش صحيح مكون من 11 رقماً.</span>
                  </div>

                  <div class="payment-lock-note">
                    ${Icons.lock}
                    <span>المبلغ محدد تلقائياً بناءً على تسعيرة العيادة الرسمية (غير قابل للتعديل).</span>
                  </div>

                  <!-- Test scenario toggle -->
                  <div class="demo-payment-type">
                    <div class="demo-payment-type__copy">
                      <strong>سيناريو اختبار العملية (للتقييم والتدقيق):</strong>
                      <span>اختر النتيجة لمحاكاة الرد من بوابة الدفع</span>
                    </div>
                    <div class="segmented" style="display: flex; gap: 4px; background: #e5ebef; padding: 3px; border-radius: 8px;">
                      <label style="cursor: pointer; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; ${state.paymentScenario === 'success' ? 'background: #fff; color: var(--navy-900);' : 'color: var(--muted);'}">
                        <input type="radio" name="paymentScenarioRadio" value="success" ${state.paymentScenario === 'success' ? 'checked' : ''} style="display: none;">
                        دفع ناجح (افتراضي)
                      </label>
                      <label style="cursor: pointer; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; ${state.paymentScenario === 'fail' ? 'background: #fff; color: var(--red-700);' : 'color: var(--muted);'}">
                        <input type="radio" name="paymentScenarioRadio" value="fail" ${state.paymentScenario === 'fail' ? 'checked' : ''} style="display: none;">
                        محاكاة فشل العملية
                      </label>
                    </div>
                  </div>

                  <div class="simulated-note">
                    ${Icons.alert}
                    <div>
                      <strong>تنبيه الأمان والخصوصية:</strong> هذه محاكاة تجريبية مخصصة للعرض والتدقيق فقط — لن يتم خصم أو سحب أي أموال حقيقية من هاتفك، ولن يُطلب منك إدخال أي رقم سري (PIN) أو رمز تحقق (OTP).
                    </div>
                  </div>

                  <div class="payment-actions">
                    <button type="button" class="btn btn--outline" id="back-to-step2-btn">
                      ${Icons.arrowRight} تعديل البيانات
                    </button>
                    <button type="submit" class="btn btn--accent" id="confirm-payment-btn">
                      تأكيد ودفع ${price} ج.م ${Icons.check}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <aside class="order-summary">
            <div class="order-summary__head">
              <h2>${Icons.calendar} تفاصيل الحجز والمريض</h2>
            </div>
            <div class="order-summary__body">
              <div class="selected-appointment">
                <div class="selected-date-box">
                  <strong>${DateHelper.fromISODate(dateIso).getDate()}</strong>
                  <span>${MONTH_NAMES[DateHelper.fromISODate(dateIso).getMonth()]}</span>
                </div>
                <div class="selected-appointment__main">
                  <strong>${DateHelper.formatDateArabic(dateIso, false)}</strong>
                  <span>${Icons.clock} ${DateHelper.formatTimeArabic(slot.startTime)} - ${DateHelper.formatTimeArabic(slot.endTime)}</span>
                </div>
              </div>

              <div class="summary-lines">
                <div class="summary-line">
                  <span>${Icons.user} اسم المريض</span>
                  <strong>${state.patientName}</strong>
                </div>
                <div class="summary-line">
                  <span>${Icons.phone} رقم الهاتف</span>
                  <strong style="direction: ltr;">${state.patientPhone}</strong>
                </div>
                <div class="summary-line">
                  <span>${Icons.stethoscope} الطبيب المعالج</span>
                  <strong>${settings.doctorName || 'د. أحمد محمد'}</strong>
                </div>
              </div>

              <div class="summary-total">
                <span>المبلغ الإجمالي المطلوب</span>
                <strong>${price} <small>${settings.currency || 'ج.م'}</small></strong>
              </div>
            </div>
          </aside>
        </div>
      `;
    },

    /* Step 4: Booking Confirmation & Printable Receipt */
    PatientStep4() {
      const state = App.patientBookingState;
      const settings = ClinicEngine.getSettings();
      const booking = state.bookingResult;

      if (!booking) {
        return `
          <div class="card unavailable-card">
            <div class="empty-state__art">${Icons.alert}</div>
            <h1>لا يوجد حجز مؤكد حالياً</h1>
            <p>يرجى بدء حجز جديد باختيار الموعد المناسب من جدول العيادة.</p>
            <button class="btn btn--accent" id="restart-booking-btn">حجز موعد جديد</button>
          </div>
        `;
      }

      return `
        <div class="success-page">
          <div class="success-card">
            <div class="success-card__top">
              <div class="success-icon">
                ${Icons.check}
              </div>
              <h1>تم تأكيد حجزك بنجاح!</h1>
              <p>تم سداد قيمة الكشف عبر فودافون كاش وتسجيل الموعد رسمياً في جدول عيادة ${settings.clinicName || 'عيادة الشفاء'}.</p>
              <div class="success-booking-chip">
                <span>كود الحجز المرجعي:</span>
                <strong>${booking.id}</strong>
              </div>
            </div>

            <div class="success-card__body">
              <div class="receipt" id="printable-receipt">
                <div class="receipt-head">
                  <div class="receipt-brand">
                    <div class="brand-mark">${Icons.stethoscope}</div>
                    <div>
                      <strong>${settings.clinicName || 'عيادة الشفاء التخصصية'}</strong>
                      <span>${settings.doctorName || 'د. أحمد محمد'} — ${settings.specialty || 'طب الباطنة'}</span>
                    </div>
                  </div>
                  <div class="receipt-status">
                    <span class="badge badge--green">مدفوع بالكامل</span>
                    <span>${Icons.calendar} ${DateHelper.formatDateArabic(booking.date, false)}</span>
                  </div>
                </div>

                <div class="receipt-grid">
                  <div class="receipt-row">
                    <span>${Icons.user} اسم المريض:</span>
                    <strong>${booking.patientName}</strong>
                  </div>
                  <div class="receipt-row">
                    <span>${Icons.phone} هاتف المريض:</span>
                    <strong style="direction: ltr; text-align: right;">${booking.patientPhone}</strong>
                  </div>
                  <div class="receipt-row">
                    <span>${Icons.calendar} تاريخ الكشف:</span>
                    <strong>${DateHelper.formatDateArabic(booking.date)}</strong>
                  </div>
                  <div class="receipt-row">
                    <span>${Icons.clock} توقيت الجلسة:</span>
                    <strong>${DateHelper.formatTimeArabic(booking.startTime)} إلى ${DateHelper.formatTimeArabic(booking.endTime)}</strong>
                  </div>
                  <div class="receipt-row">
                    <span>${Icons.wallet} وسيلة الدفع:</span>
                    <strong>فودافون كاش (${booking.walletPhone || booking.patientPhone})</strong>
                  </div>
                  <div class="receipt-row">
                    <span>${Icons.cash} المبلغ المسدد:</span>
                    <strong class="is-price">${booking.amount} ${booking.currency}</strong>
                  </div>
                  <div class="receipt-row">
                    <span>${Icons.shield} رقم المعاملة:</span>
                    <strong class="is-code">${booking.paymentId}</strong>
                  </div>
                  <div class="receipt-row">
                    <span>${Icons.checkCircle} حالة الحجز:</span>
                    <strong style="color: var(--green-700);">مؤكد في العيادة</strong>
                  </div>
                </div>

                <div class="receipt-foot">
                  <span>${Icons.info} يرجى الحضور قبل الموعد بـ 10 دقائق وإبراز كود الحجز.</span>
                  <span>رقم الهاتف: ${booking.patientPhone}</span>
                </div>
              </div>

              <div class="success-actions">
                <button class="btn btn--accent" id="print-receipt-btn">
                  ${Icons.printer} طباعة إيصال الحجز
                </button>
                <button class="btn btn--outline" id="new-booking-btn">
                  ${Icons.plus} حجز موعد جديد
                </button>
              </div>

              <div class="success-help">
                ${Icons.sparkles}
                <div>
                  <strong>تم تحديث لوحة تحكم الطبيب تلقائياً!</strong> يمكنك الآن التوجه إلى لوحة تحكم الطبيب والتحقق من ظهور هذا الحجز فوراً في قائمة حجوزات اليوم والإحصائيات.
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    bindPatientPortalEvents() {
      // Header button to open doctor portal
      document.getElementById('patient-to-doctor-btn')?.addEventListener('click', () => {
        if (Auth.isLoggedIn()) App.navigate('doctor', 'overview');
        else App.navigate('doctor-login');
      });

      // Step 1: Select date ribbon
      document.querySelectorAll('.booking-date:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
          const iso = btn.getAttribute('data-iso');
          App.patientBookingState.selectedDate = iso;
          App.refreshCurrentView();
        });
      });

      // Step 1: Select slot button
      document.querySelectorAll('.select-slot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const slotId = btn.getAttribute('data-id');
          const start = btn.getAttribute('data-start');
          const end = btn.getAttribute('data-end');

          App.patientBookingState.selectedSlot = {
            id: slotId,
            startTime: start,
            endTime: end
          };
          App.refreshCurrentView();
        });
      });

      // Step 2: Back to Step 1
      document.getElementById('back-to-step1-btn')?.addEventListener('click', () => {
        App.patientBookingState.selectedSlot = null;
        App.refreshCurrentView();
      });

      // Step 2: Form submit
      const infoForm = document.getElementById('patient-info-form');
      if (infoForm) {
        infoForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const nameInput = document.getElementById('patient-fullname');
          const phoneInput = document.getElementById('patient-phone');
          const nameErr = document.getElementById('name-error');
          const phoneErr = document.getElementById('phone-error');

          const name = (nameInput?.value || '').trim();
          let phone = (phoneInput?.value || '').trim().replace(/[\s-]/g, '');

          let valid = true;

          // Full Name Validation (at least 3 characters)
          if (!name || name.length < 3) {
            if (nameErr) nameErr.style.display = 'block';
            valid = false;
          } else {
            if (nameErr) nameErr.style.display = 'none';
          }

          // Egyptian Phone Validation (010, 011, 012, 015 - 11 digits)
          const egPhoneRegex = /^01[0125][0-9]{8}$/;
          if (!egPhoneRegex.test(phone)) {
            if (phoneErr) phoneErr.style.display = 'block';
            valid = false;
          } else {
            if (phoneErr) phoneErr.style.display = 'none';
          }

          if (valid) {
            App.patientBookingState.patientName = name;
            App.patientBookingState.patientPhone = phone;
            App.refreshCurrentView();
          }
        });
      }

      // Step 3: Back to Step 2
      document.getElementById('back-to-step2-btn')?.addEventListener('click', () => {
        App.patientBookingState.patientName = '';
        App.patientBookingState.patientPhone = '';
        App.refreshCurrentView();
      });

      // Step 3: Payment scenario toggle
      document.querySelectorAll('input[name="paymentScenarioRadio"]').forEach(radio => {
        radio.addEventListener('change', () => {
          App.patientBookingState.paymentScenario = radio.value;
          App.refreshCurrentView();
        });
      });

      // Step 3: Payment form submit
      const paymentForm = document.getElementById('payment-gateway-form');
      if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const walletInput = document.getElementById('wallet-phone-input');
          const walletErr = document.getElementById('wallet-error');
          const overlay = document.getElementById('payment-processing-overlay');
          const submitBtn = document.getElementById('confirm-payment-btn');

          const walletPhone = (walletInput?.value || '').trim().replace(/[\s-]/g, '');
          const egPhoneRegex = /^01[0125][0-9]{8}$/;

          if (!egPhoneRegex.test(walletPhone)) {
            if (walletErr) walletErr.style.display = 'block';
            return;
          }
          if (walletErr) walletErr.style.display = 'none';

          // Disable submit button & show processing overlay
          if (submitBtn) submitBtn.disabled = true;
          if (overlay) overlay.style.display = 'flex';

          const pStep1 = document.getElementById('p-step-1');
          const pStep2 = document.getElementById('p-step-2');
          const pStep3 = document.getElementById('p-step-3');

          // Simulate payment steps
          setTimeout(() => {
            if (pStep1) pStep1.className = 'processing-step is-done';
            if (pStep2) pStep2.className = 'processing-step is-current';
          }, 600);

          setTimeout(() => {
            if (pStep2) pStep2.className = 'processing-step is-done';
            if (pStep3) pStep3.className = 'processing-step is-current';

            // Check if scenario is fail
            if (App.patientBookingState.paymentScenario === 'fail') {
              setTimeout(() => {
                if (overlay) overlay.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
                showToast('فشل الدفع التجريبي', 'فشلت عملية التحويل من المحفظة (سيناريو الاختبار). يرجى التأكد من الرصيد أو تجربة سيناريو الدفع الناجح.', 'error', 6000);
              }, 600);
              return;
            }

            // Success scenario: perform actual booking in ClinicEngine
            const state = App.patientBookingState;
            const settings = ClinicEngine.getSettings();

            const res = ClinicEngine.createBooking({
              patientName: state.patientName,
              patientPhone: state.patientPhone,
              dateIso: state.selectedDate,
              slot: state.selectedSlot,
              amount: settings.price || 100,
              walletPhone
            });

            setTimeout(() => {
              if (res.success) {
                state.bookingResult = res.booking;
                showToast('تم تأكيد الحجز', 'تم سداد الكشف بنجاح وتسجيل حجزك.', 'success');
                App.refreshCurrentView();
              } else {
                if (overlay) overlay.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
                showToast('تعذر إتمام الحجز', res.error, 'error', 6000);
              }
            }, 500);

          }, 1400);
        });
      }

      // Step 4: Print receipt
      document.getElementById('print-receipt-btn')?.addEventListener('click', () => {
        window.print();
      });

      // Step 4: New booking
      const restartBooking = () => {
        App.patientBookingState = {
          selectedDate: DateHelper.todayISO(),
          selectedSlot: null,
          patientName: '',
          patientPhone: '',
          paymentScenario: 'success',
          bookingResult: null
        };
        App.refreshCurrentView();
      };
      document.getElementById('new-booking-btn')?.addEventListener('click', restartBooking);
      document.getElementById('restart-booking-btn')?.addEventListener('click', restartBooking);
    }
  });

})();
