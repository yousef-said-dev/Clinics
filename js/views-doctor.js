/**
 * نبض — لوحة تحكم الطبيب (Doctor Dashboard)
 * Frontend-Only Prototype (HTML5, CSS3, Vanilla JS, LocalStorage)
 * Part of the modular build. Load order is defined in index.html.
 */

(function () {
  'use strict';

  Object.assign(Views, {
    /* ---------------- DOCTOR SHELL & SUBVIEWS ---------------- */
    DoctorShell(activeSubView = 'overview') {
      const settings = ClinicEngine.getSettings();
      const stats = ClinicEngine.getDashboardStats();
      const todayArabic = DateHelper.formatDateArabic(DateHelper.todayISO());

      let subViewTitle = 'الرئيسية';
      if (activeSubView === 'schedule') subViewTitle = 'جدول المواعيد الأسبوعي';
      if (activeSubView === 'today') subViewTitle = 'حجوزات اليوم';
      if (activeSubView === 'all-bookings') subViewTitle = 'جميع الحجوزات';
      if (activeSubView === 'settings') subViewTitle = 'إعدادات العيادة والحساب';

      let contentHtml = '';
      if (activeSubView === 'overview') contentHtml = Views.DoctorOverview();
      else if (activeSubView === 'schedule') contentHtml = Views.DoctorSchedule();
      else if (activeSubView === 'today') contentHtml = Views.DoctorToday();
      else if (activeSubView === 'all-bookings') contentHtml = Views.DoctorAllBookings();
      else if (activeSubView === 'settings') contentHtml = Views.DoctorSettings();

      return `
        <div class="doctor-shell">
          <!-- Cinematic transit overlay (route wipe) -->
          <div class="transit-wipe" id="transit-wipe"><div class="transit-wipe__strip"></div><div class="transit-wipe__strip"></div><div class="transit-wipe__strip"></div></div>
          <!-- Sidebar -->
          <aside class="doctor-sidebar" id="doctor-sidebar">
            <div class="sidebar-inner">
              <div class="sidebar-brand">
                <div class="brand brand--inverse">
                  <div class="brand-mark">
                    <svg viewBox="0 0 64 64" fill="none"><path d="M12 34h11l6-17 9 31 6-22 4 8h9" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                  <div class="brand-word">
                    <strong>نبض</strong>
                    <span>لوحة تحكم الطبيب</span>
                  </div>
                </div>
                <button class="btn btn--icon sidebar-close" id="sidebar-close-btn">${Icons.x}</button>
              </div>

              <div class="sidebar-doctor-card">
                <div class="doctor-avatar">د</div>
                <div class="doctor-card-info">
                  <strong>${ 'د. أحمد محمد'}</strong>
                  <span>${ 'طب الباطنة'}</span>
                </div>
              </div>

              <div class="sidebar-section-label">القائمة الرئيسية</div>
              <nav class="sidebar-nav">
                <button class="nav-link ${activeSubView === 'overview' ? 'is-active' : ''}" data-nav="overview">
                  ${Icons.home} <span>الرئيسية</span>
                </button>
                <button class="nav-link ${activeSubView === 'schedule' ? 'is-active' : ''}" data-nav="schedule">
                  ${Icons.calendar} <span>جدول المواعيد</span>
                </button>
                <button class="nav-link ${activeSubView === 'today' ? 'is-active' : ''}" data-nav="today">
                  ${Icons.clock} <span>حجوزات اليوم</span>
                  <span class="nav-link__badge">${stats.todayBookingsCount}</span>
                </button>
                <button class="nav-link ${activeSubView === 'all-bookings' ? 'is-active' : ''}" data-nav="all-bookings">
                  ${Icons.list} <span>جميع الحجوزات</span>
                </button>
                <button class="nav-link ${activeSubView === 'settings' ? 'is-active' : ''}" data-nav="settings">
                  ${Icons.settings} <span>الإعدادات</span>
                </button>
              </nav>

              <div class="sidebar-spacer"></div>

              <div class="sidebar-help">
                <div class="sidebar-help__head">${Icons.sparkles} بوابة المرضى جاهزة</div>
                <p>يمكنك فتح بوابة المرضى وتجربة الحجز كـ مريض في أي وقت.</p>
                <button class="btn btn--sm btn--outline-light" id="sidebar-open-patient" style="width: 100%; margin-top: 8px; font-size: 10px; border-color: rgba(255,255,255,0.2);">
                  ${Icons.arrowLeft} تجربة حجز موعد
                </button>
              </div>

              <div class="sidebar-footer">
                <button class="sidebar-logout" id="doctor-logout-btn">
                  ${Icons.logout} <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </aside>

          <!-- Main Content Area -->
          <div class="doctor-main">
            <!-- Topbar -->
            <header class="doctor-topbar">
              <div class="topbar-right">
                <button class="btn btn--icon sidebar-toggle" id="sidebar-toggle-btn">${Icons.list}</button>
                <div class="topbar-breadcrumb">
                  <span>لوحة الطبيب</span>
                  ${Icons.chevronLeft}
                  <strong>${subViewTitle}</strong>
                </div>
              </div>

              <div class="topbar-left">
                <div class="topbar-date">
                  ${Icons.calendar} <span>${todayArabic}</span>
                </div>
                <button class="btn btn--sm btn--outline topbar-patient-link" id="topbar-patient-btn">
                  ${Icons.calendar} بوابة حجز المرضى
                </button>
              </div>
            </header>

            <!-- Page Container -->
            <main class="doctor-content">
              ${contentHtml}
            </main>
          </div>
        </div>
      `;
    },

    bindDoctorShellEvents(activeSubView) {
      // Sidebar navigation
      document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-nav');
          App.navigate('doctor', target);
        });
      });

      // Quick patient portal buttons
      document.getElementById('sidebar-open-patient')?.addEventListener('click', () => App.navigate('patient'));
      document.getElementById('topbar-patient-btn')?.addEventListener('click', () => App.navigate('patient'));

      // Logout button
      document.getElementById('doctor-logout-btn')?.addEventListener('click', () => {
        Modals.openLogoutConfirm();
      });

      // Mobile sidebar toggle
      const sidebar = document.getElementById('doctor-sidebar');
      const toggleBtn = document.getElementById('sidebar-toggle-btn');
      const closeBtn = document.getElementById('sidebar-close-btn');

      toggleBtn?.addEventListener('click', () => sidebar?.classList.toggle('is-open'));
      closeBtn?.addEventListener('click', () => sidebar?.classList.remove('is-open'));

      // Bind subview specific events
      if (activeSubView === 'overview') Views.bindDoctorOverviewEvents();
      else if (activeSubView === 'schedule') Views.bindDoctorScheduleEvents();
      else if (activeSubView === 'today') Views.bindDoctorTodayEvents();
      else if (activeSubView === 'all-bookings') Views.bindDoctorAllBookingsEvents();
      else if (activeSubView === 'settings') Views.bindDoctorSettingsEvents();
    },

    /* ---------------- DOCTOR SUBVIEWS ---------------- */
    DoctorOverview() {
      const settings = ClinicEngine.getSettings();
      const stats = ClinicEngine.getDashboardStats();
      const todayArabic = DateHelper.formatDateArabic(DateHelper.todayISO());

      let todayAppointmentsRows = '';
      if (stats.todayBookingsList.length === 0) {
        todayAppointmentsRows = `
          <div class="empty-state empty-state--compact">
            <div class="empty-state__art">${Icons.calendar}</div>
            <h3>لا توجد حجوزات مسجلة اليوم حتى الآن</h3>
            <p>جميع المواعيد المتاحة بانتظار حجز المرضى أو يمكنك إضافة موعد يدويًا.</p>
            <button class="btn btn--sm btn--accent" id="overview-add-slot-btn">${Icons.plus} إضافة جلسة جديدة</button>
          </div>
        `;
      } else {
        todayAppointmentsRows = stats.todayBookingsList.map(b => `
          <div class="appointment-row" data-booking-id="${b.id}">
            <div class="appointment-time">
              <strong>${DateHelper.formatTimeArabic(b.startTime)}</strong>
              <span>إلى ${DateHelper.formatTimeArabic(b.endTime)}</span>
            </div>
            <div class="appointment-patient">
              <div class="patient-avatar">${b.patientName.charAt(0) || 'م'}</div>
              <div class="patient-main">
                <strong>${b.patientName}</strong>
                <span>${Icons.phone} ${b.patientPhone}</span>
              </div>
            </div>
            <div class="appointment-side">
              <span class="badge badge--green">${b.paymentStatus === 'paid' ? 'مدفوع' : 'معلق'}</span>
              <span class="badge badge--navy">${b.bookingStatus === 'confirmed' ? 'مؤكد' : b.bookingStatus === 'completed' ? 'مكتمل' : 'ملغي'}</span>
              <button class="row-chevron view-booking-btn" data-id="${b.id}" title="عرض التفاصيل">
                ${Icons.chevronLeft}
              </button>
            </div>
          </div>
        `).join('');
      }

      // Next appointment widget
      let nextAppointmentHtml = '';
      if (stats.nextAppointment) {
        nextAppointmentHtml = `
          <div class="next-appointment">
            <span class="badge badge--green" style="margin-bottom: 8px;">الموعد التالي القادم</span>
            <div style="font-size: 20px; font-weight: 800; color: #fff;">
              ${DateHelper.formatTimeArabic(stats.nextAppointment.startTime)}
            </div>
            <div style="margin-top: 6px; font-size: 13px; font-weight: 700;">
              ${stats.nextAppointment.patientName}
            </div>
            <div style="margin-top: 2px; font-size: 11px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 4px;">
              ${Icons.phone} ${stats.nextAppointment.patientPhone}
            </div>
            <button class="btn btn--sm btn--outline-light view-booking-btn" data-id="${stats.nextAppointment.id}" style="margin-top: 15px; width: 100%; border-color: rgba(255,255,255,0.25);">
              عرض ملف الحجز
            </button>
          </div>
        `;
      } else {
        nextAppointmentHtml = `
          <div class="next-appointment">
            <span class="badge badge--gray" style="margin-bottom: 8px;">حالة المواعيد</span>
            <div style="font-size: 16px; font-weight: 800; color: #fff;">لا توجد مواعيد متبقية اليوم</div>
            <p style="margin-top: 6px; font-size: 11px; color: rgba(255,255,255,0.7);">
              يمكنك الاطلاع على الجدول الأسبوعي أو إضافة جلسات عمل إضافية.
            </p>
            <button class="btn btn--sm btn--outline-light" id="overview-go-schedule" style="margin-top: 15px; width: 100%; border-color: rgba(255,255,255,0.25);">
              الانتقال للجدول
            </button>
          </div>
        `;
      }

      return `
        <div class="page-heading">
          <div class="page-heading__copy">
            <div class="page-kicker">
              <span class="dot">•</span> مرحباً، ${settings.doctorName || 'د. أحمد محمد'}
            </div>
            <h1>لوحة المتابعة اليومية</h1>
            <p>إليك ملخص حي لحجوزات العيادة وجدول المواعيد ليوم ${todayArabic}</p>
          </div>
          <div class="page-heading__actions">
            <button class="btn btn--accent" id="overview-add-slot-top">${Icons.plus} إضافة موعد جديد</button>
            <button class="btn btn--outline" id="overview-schedule-top">${Icons.calendar} تعديل الجدول الأسبوعي</button>
          </div>
        </div>

        <!-- 5 Live Stat Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-top">
              <div class="stat-icon" style="--stat-color: var(--green-700); --stat-tint: var(--green-50);">${Icons.clock}</div>
              <span class="stat-trend">${Icons.calendar} اليوم</span>
            </div>
            <div class="stat-value">${stats.todayBookingsCount} <small>حجز</small></div>
            <div class="stat-label">حجوزات اليوم</div>
            <div class="stat-meta">مؤكدة ومسجلة في جدول اليوم</div>
          </div>

          <div class="stat-card">
            <div class="stat-top">
              <div class="stat-icon" style="--stat-color: #0b9b78; --stat-tint: #edfaf6;">${Icons.checkCircle}</div>
              <span class="stat-trend">متاح</span>
            </div>
            <div class="stat-value">${stats.todayAvailableCount} <small>جلسة</small></div>
            <div class="stat-label">الجلسات المتاحة اليوم</div>
            <div class="stat-meta">جاهزة لحجز المرضى فوراً</div>
          </div>

          <div class="stat-card">
            <div class="stat-top">
              <div class="stat-icon" style="--stat-color: #3877d6; --stat-tint: #eef5ff;">${Icons.user}</div>
              <span class="stat-trend">محجوز</span>
            </div>
            <div class="stat-value">${stats.todayBookedCount} <small>جلسة</small></div>
            <div class="stat-label">الجلسات المحجوزة اليوم</div>
            <div class="stat-meta">تم حجزها من قِبل المرضى</div>
          </div>

          <div class="stat-card">
            <div class="stat-top">
              <div class="stat-icon" style="--stat-color: #7557c8; --stat-tint: #f4f0ff;">${Icons.calendar}</div>
              <span class="stat-trend">قادمة</span>
            </div>
            <div class="stat-value">${stats.upcomingCount} <small>موعد</small></div>
            <div class="stat-label">الحجوزات القادمة</div>
            <div class="stat-meta">إجمالي المواعيد المؤكدة</div>
          </div>

          <div class="stat-card stat-card--highlight">
            <div class="stat-top">
              <div class="stat-icon">${Icons.cash}</div>
              <span class="stat-trend">${Icons.check} مسجل</span>
            </div>
            <div class="stat-value">${stats.totalRevenue} <small>ج.م</small></div>
            <div class="stat-label">إجمالي المدفوعات</div>
            <div class="stat-meta">فودافون كاش (محاكاة فورية)</div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-stack">
            <!-- Today's Appointments Panel -->
            <div class="panel">
              <div class="panel-head">
                <div>
                  <div class="panel-title">${Icons.clock} قائمة حجوزات اليوم (${stats.todayBookingsCount})</div>
                  <div class="panel-subtitle">جميع المرضى المسجلين لكشف اليوم حسب التوقيت</div>
                </div>
                <div class="panel-head-actions">
                  <button class="btn btn--sm btn--outline" id="overview-view-all-today">${Icons.list} جدول اليوم كامل</button>
                </div>
              </div>

              <div class="appointment-list">
                ${todayAppointmentsRows}
              </div>

              <div class="panel-foot">
                <span>سعر كشف العيادة: <strong>${settings.price} ج.م</strong></span>
                <button class="btn btn--ghost btn--sm" id="overview-foot-schedule">${Icons.calendar} تعديل فترات العمل</button>
              </div>
            </div>
          </div>

          <div class="dashboard-stack">
            <!-- Highlight Next Appointment -->
            ${nextAppointmentHtml}

            <!-- Quick info card -->
            <div class="panel" style="padding: 16px;">
              <div style="font-weight: 800; font-size: 13px; color: var(--navy-900); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                ${Icons.info} تفضيلات الجدولة
              </div>
              <div style="font-size: 11px; color: var(--muted); line-height: 1.8;">
                <div>أول أيام الأسبوع: <strong>${DateHelper.getDayName(settings.firstDayOfWeek || 'sat')}</strong></div>
                <div>المدة الافتراضية للجلسة: <strong>${settings.defaultDuration || 30} دقيقة</strong></div>
                <div>طريقة الدفع للمرضى: <strong>فودافون كاش</strong></div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    bindDoctorOverviewEvents() {
      document.getElementById('overview-add-slot-top')?.addEventListener('click', () => {
        Modals.openAddSlotModal(DateHelper.todayISO());
      });
      document.getElementById('overview-add-slot-btn')?.addEventListener('click', () => {
        Modals.openAddSlotModal(DateHelper.todayISO());
      });
      document.getElementById('overview-schedule-top')?.addEventListener('click', () => App.navigate('doctor', 'schedule'));
      document.getElementById('overview-view-all-today')?.addEventListener('click', () => App.navigate('doctor', 'today'));
      document.getElementById('overview-foot-schedule')?.addEventListener('click', () => App.navigate('doctor', 'schedule'));
      document.getElementById('overview-go-schedule')?.addEventListener('click', () => App.navigate('doctor', 'schedule'));

      // View booking details buttons
      document.querySelectorAll('.view-booking-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const bookingId = btn.getAttribute('data-id');
          Modals.openBookingDetailsModal(bookingId);
        });
      });
    },

    /* ---------------- WEEKLY SCHEDULE MANAGEMENT ---------------- */
    DoctorSchedule() {
      const settings = ClinicEngine.getSettings();
      const firstDayKey = settings.firstDayOfWeek || 'sat';
      const weekDates = DateHelper.getCurrentWeekDates(firstDayKey);

      // Current selected date in state or default to today (or first day of week)
      let selectedIso = App._scheduleSelectedDate;
      if (!selectedIso || !weekDates.some(w => w.iso === selectedIso)) {
        selectedIso = DateHelper.todayISO();
        if (!weekDates.some(w => w.iso === selectedIso)) {
          selectedIso = weekDates[0].iso;
        }
        App._scheduleSelectedDate = selectedIso;
      }

      const selectedDateObj = DateHelper.fromISODate(selectedIso);
      const selectedDayKey = DateHelper.getDayKey(selectedDateObj);
      const selectedDayName = DateHelper.getDayName(selectedDayKey);
      const slots = ClinicEngine.getScheduleForDate(selectedIso);

      // Render week strip
      const weekStripHtml = weekDates.map(w => {
        const isSelected = w.iso === selectedIso;
        const daySlots = ClinicEngine.getScheduleForDate(w.iso);
        const bookedCount = daySlots.filter(s => s.status === 'booked').length;
        const totalCount = daySlots.length;

        return `
          <button class="week-day ${isSelected ? 'is-selected' : ''} ${w.isToday ? 'is-today' : ''}" data-iso="${w.iso}">
            <span class="week-day__name">${w.dayName}</span>
            <span class="week-day__num">${w.dayNum}</span>
            <span class="week-day__meta">
              <span class="dot"></span> ${bookedCount}/${totalCount}
            </span>
          </button>
        `;
      }).join('');

      // Render slots list
      let slotListHtml = '';
      if (slots.length === 0) {
        slotListHtml = `
          <div class="empty-state empty-state--compact">
            <div class="empty-state__art">${Icons.calendar}</div>
            <h3>لا توجد جلسات عمل مجدولة لهذا اليوم (${selectedDayName})</h3>
            <p>أضف جلسات عمل متكررة أسبوعياً أو خاصة بهذا التاريخ لتمكين المرضى من الحجز.</p>
            <button class="btn btn--accent btn--sm" id="schedule-empty-add-btn">${Icons.plus} إضافة جلسة جديدة</button>
          </div>
        `;
      } else {
        slotListHtml = slots.map(slot => {
          let cardClass = 'slot-card--available';
          let badgeHtml = '<span class="badge badge--green">متاح للحجز</span>';

          if (slot.status === 'booked') {
            cardClass = 'slot-card--booked';
            badgeHtml = '<span class="badge badge--navy">محجوز</span>';
          } else if (slot.status === 'past') {
            cardClass = 'slot-card--past';
            badgeHtml = '<span class="badge badge--gray">انتهى وقته</span>';
          }

          let extraMeta = '';
          if (slot.booking) {
            extraMeta = `
              <span class="slot-title">${slot.booking.patientName}</span>
              <div class="slot-sub">
                <span>${Icons.phone} ${slot.booking.patientPhone}</span>
                <span>${Icons.cash} ${slot.booking.amount} ج.م</span>
                <span>كود: ${slot.booking.id}</span>
              </div>
            `;
          } else {
            extraMeta = `
              <span class="slot-title">جلسة كشف عادية</span>
              <div class="slot-sub">
                <span>المدة: ${settings.defaultDuration || 30} دقيقة</span>
                <span>${slot.isOverride ? 'تعديل استثنائي لهذا اليوم' : 'جدول متكرر أسبوعياً'}</span>
              </div>
            `;
          }

          let actionButtons = '';
          if (slot.booking) {
            actionButtons = `
              <button class="btn btn--sm btn--outline view-booking-btn" data-id="${slot.booking.id}" title="عرض تفاصيل الحجز">
                ${Icons.user} تفاصيل الحجز
              </button>
            `;
          } else {
            actionButtons = `
              <button class="icon-btn edit-slot-btn" data-id="${slot.id}" data-start="${slot.startTime}" data-end="${slot.endTime}" title="تعديل وقت الجلسة">
                ${Icons.edit}
              </button>
              <button class="icon-btn icon-btn--danger delete-slot-btn" data-id="${slot.id}" data-start="${slot.startTime}" data-end="${slot.endTime}" title="حذف الجلسة">
                ${Icons.trash}
              </button>
            `;
          }

          return `
            <div class="slot-card ${cardClass}">
              <div class="slot-time-block">
                <strong>${slot.formattedStart}</strong>
                <span>إلى ${slot.formattedEnd}</span>
              </div>
              <div class="slot-body">
                <div class="slot-statusline">
                  ${badgeHtml}
                </div>
                ${extraMeta}
              </div>
              <div class="slot-actions">
                ${actionButtons}
              </div>
            </div>
          `;
        }).join('');
      }

      return `
        <div class="page-heading schedule-page-head">
          <div class="page-heading__copy">
            <div class="page-kicker"><span class="dot">•</span> إدارة المواعيد الدورية</div>
            <h1>جدول المواعيد الأسبوعي</h1>
            <p>قم بضبط وإضافة الجلسات لكل يوم من أيام الأسبوع، مع إمكانية التعديل على هذا التاريخ فقط أو تعميمه أسبوعياً.</p>
          </div>
          <div class="page-heading__actions">
            <button class="btn btn--accent" id="schedule-add-slot-main">
              ${Icons.plus} إضافة جلسة جديدة لهذا اليوم
            </button>
          </div>
        </div>

        <div class="schedule-layout">
          <div class="schedule-main">
            <!-- Week Strip Card -->
            <div class="week-card">
              <div class="week-card-head">
                <div class="week-range">
                  <div class="week-range__icon">${Icons.calendar}</div>
                  <div>
                    <strong>الأسبوع الحالي (${DateHelper.formatDateArabic(weekDates[0].iso, false)} - ${DateHelper.formatDateArabic(weekDates[6].iso, false)})</strong>
                    <span>أول أيام الأسبوع المعتمد في الإعدادات: ${DateHelper.getDayName(firstDayKey)}</span>
                  </div>
                </div>
              </div>

              <div class="week-strip">
                ${weekStripHtml}
              </div>
            </div>

            <!-- Day Panel -->
            <div class="day-panel">
              <div class="day-panel-head">
                <div>
                  <h2>
                    ${Icons.clock} جلسات ${DateHelper.formatDateArabic(selectedIso)}
                    <span class="badge badge--green">${slots.length} جلسات</span>
                  </h2>
                  <p>يمكنك تعديل أي موعد غير محجوز أو حذفه، وستظهر الخيارات لتطبيق ذلك على هذا التاريخ فقط أو كل أسبوع.</p>
                </div>
                <div class="day-panel-actions">
                  <button class="btn btn--sm btn--accent" id="schedule-add-slot-panel">
                    ${Icons.plus} إضافة جلسة
                  </button>
                </div>
              </div>

              <div class="slot-list">
                ${slotListHtml}
              </div>

              <div class="legend-row">
                <span class="legend-item"><span class="legend-dot"></span> متاح للحجز</span>
                <span class="legend-item"><span class="legend-dot legend-dot--booked"></span> محجوز من مريض</span>
                <span class="legend-item"><span class="legend-dot legend-dot--past"></span> انتهى وقته</span>
              </div>
            </div>
          </div>

          <!-- Schedule Sidebar Guide -->
          <div class="rail-panel">
            <div style="padding: 18px;">
              <h3 style="font-size: 13.5px; font-weight: 800; color: var(--navy-900); display: flex; align-items: center; gap: 6px;">
                ${Icons.shield} ميزات الجدولة الذكية
              </h3>
              <div style="margin-top: 10px; font-size: 11px; color: var(--muted); line-height: 1.8;">
                <p>• <strong>الحفاظ على الحجوزات السابقة:</strong> تعديل الجدول الأسبوعي لا يؤثر مطلقاً على أي حجوزات تمت بالفعل.</p>
                <p style="margin-top: 8px;">• <strong>منع التداخل:</strong> يتحقق النظام تلقائياً من عدم وجود تضارب بين أوقات الجلسات في نفس اليوم.</p>
                <p style="margin-top: 8px;">• <strong>خيارات التعديل:</strong> عند تعديل أو حذف أي جلسة، يمكنك اختيار تطبيق التغيير على هذا التاريخ فقط أو على كل الأسابيع القادمة.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    bindDoctorScheduleEvents() {
      // Select day in week strip
      document.querySelectorAll('.week-day').forEach(btn => {
        btn.addEventListener('click', () => {
          const iso = btn.getAttribute('data-iso');
          App._scheduleSelectedDate = iso;
          App.refreshCurrentView();
        });
      });

      const openAdd = () => {
        const iso = App._scheduleSelectedDate || DateHelper.todayISO();
        Modals.openAddSlotModal(iso);
      };

      document.getElementById('schedule-add-slot-main')?.addEventListener('click', openAdd);
      document.getElementById('schedule-add-slot-panel')?.addEventListener('click', openAdd);
      document.getElementById('schedule-empty-add-btn')?.addEventListener('click', openAdd);

      // Edit slot buttons
      document.querySelectorAll('.edit-slot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const slotId = btn.getAttribute('data-id');
          const start = btn.getAttribute('data-start');
          const end = btn.getAttribute('data-end');
          const iso = App._scheduleSelectedDate || DateHelper.todayISO();
          Modals.openEditSlotModal({ id: slotId, startTime: start, endTime: end }, iso);
        });
      });

      // Delete slot buttons
      document.querySelectorAll('.delete-slot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const slotId = btn.getAttribute('data-id');
          const start = btn.getAttribute('data-start');
          const end = btn.getAttribute('data-end');
          const iso = App._scheduleSelectedDate || DateHelper.todayISO();
          Modals.openDeleteSlotModal({ id: slotId, startTime: start, endTime: end }, iso);
        });
      });

      // View booking buttons
      document.querySelectorAll('.view-booking-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const bookingId = btn.getAttribute('data-id');
          Modals.openBookingDetailsModal(bookingId);
        });
      });
    },

    /* ---------------- TODAY'S APPOINTMENTS ---------------- */
    DoctorToday() {
      const todayISO = DateHelper.todayISO();
      const todayArabic = DateHelper.formatDateArabic(todayISO);
      const bookings = ClinicEngine.getBookings().filter(b => b.date === todayISO);

      let rowsHtml = '';
      if (bookings.length === 0) {
        rowsHtml = `
          <tr>
            <td colspan="7">
              <div class="empty-state">
                <div class="empty-state__art">${Icons.clock}</div>
                <h3>لا توجد أي حجوزات مسجلة اليوم</h3>
                <p>يمكن للمرضى حجز المواعيد المتاحة عبر بوابة حجز المرضى.</p>
              </div>
            </td>
          </tr>
        `;
      } else {
        rowsHtml = bookings.map(b => `
          <tr>
            <td>
              <div class="table-patient">
                <div class="patient-avatar">${b.patientName.charAt(0) || 'م'}</div>
                <div>
                  <strong>${b.patientName}</strong>
                  <span>${Icons.phone} ${b.patientPhone}</span>
                </div>
              </div>
            </td>
            <td>
              <strong>${DateHelper.formatTimeArabic(b.startTime)} - ${DateHelper.formatTimeArabic(b.endTime)}</strong>
            </td>
            <td><code class="table-id">${b.id}</code></td>
            <td><strong class="table-amount">${b.amount} ${b.currency}</strong></td>
            <td>
              <span class="badge badge--green">${b.paymentStatus === 'paid' ? 'مدفوع' : 'معلق'}</span>
            </td>
            <td>
              <span class="badge ${b.bookingStatus === 'confirmed' ? 'badge--navy' : b.bookingStatus === 'completed' ? 'badge--blue' : 'badge--red'}">
                ${b.bookingStatus === 'confirmed' ? 'مؤكد' : b.bookingStatus === 'completed' ? 'تم الحضور' : 'ملغي'}
              </span>
            </td>
            <td>
              <div class="table-actions">
                <button class="btn btn--sm btn--outline view-booking-btn" data-id="${b.id}" title="عرض تفاصيل الحجز">${Icons.user} تفاصيل</button>
                ${b.bookingStatus === 'confirmed' ? `
                  <button class="btn btn--sm btn--accent mark-completed-btn" data-id="${b.id}" title="تأكيد حضور المريض">${Icons.check}</button>
                ` : ''}
              </div>
            </td>
          </tr>
        `).join('');
      }

      return `
        <div class="page-heading">
          <div class="page-heading__copy">
            <div class="page-kicker"><span class="dot">•</span> قائمة كشف اليوم</div>
            <h1>حجوزات اليوم (${todayArabic})</h1>
            <p>استعراض جميع المواعيد المحجوزة اليوم، مع بيانات المرضى وحالة الدفع وإمكانية تعديل الحالة فورياً.</p>
          </div>
        </div>

        <div class="table-card">
          <div class="table-toolbar">
            <div class="table-toolbar__title">
              ${Icons.clock} إجمالي حجوزات اليوم: ${bookings.length} مريض
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>اسم المريض والهاتف</th>
                  <th>توقيت الجلسة</th>
                  <th>رقم الحجز</th>
                  <th>سعر الكشف</th>
                  <th>حالة الدفع</th>
                  <th>حالة الحجز</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    bindDoctorTodayEvents() {
      document.querySelectorAll('.view-booking-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const bookingId = btn.getAttribute('data-id');
          Modals.openBookingDetailsModal(bookingId);
        });
      });

      document.querySelectorAll('.mark-completed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const bookingId = btn.getAttribute('data-id');
          ClinicEngine.updateBookingStatus(bookingId, 'completed');
          showToast('تم التحديث', 'تم تسجيل حضور المريض وإكمال الجلسة بنجاح.', 'success');
          App.refreshCurrentView();
        });
      });
    },

    /* ---------------- ALL BOOKINGS VIEW ---------------- */
    DoctorAllBookings() {
      const allBookings = ClinicEngine.getBookings();

      const searchQuery = (App._allBookingsSearch || '').trim().toLowerCase();
      const statusFilter = App._allBookingsStatus || 'all';
      const paymentFilter = App._allBookingsPayment || 'all';
      const dateFilter = App._allBookingsDate || '';

      const filtered = allBookings.filter(b => {
        if (searchQuery) {
          const nameMatch = (b.patientName || '').toLowerCase().includes(searchQuery);
          const phoneMatch = (b.patientPhone || '').includes(searchQuery);
          const idMatch = (b.id || '').toLowerCase().includes(searchQuery);
          if (!nameMatch && !phoneMatch && !idMatch) return false;
        }
        if (statusFilter !== 'all' && b.bookingStatus !== statusFilter) return false;
        if (paymentFilter !== 'all' && b.paymentStatus !== paymentFilter) return false;
        if (dateFilter && b.date !== dateFilter) return false;
        return true;
      });

      let rowsHtml = '';
      if (filtered.length === 0) {
        rowsHtml = `
          <tr>
            <td colspan="8">
              <div class="empty-state">
                <div class="empty-state__art">${Icons.search}</div>
                <h3>لم يتم العثور على أي حجوزات مطابقة</h3>
                <p>جرب تغيير معايير البحث أو مسح الفلاتر المطبقة لعرض النتائج.</p>
              </div>
            </td>
          </tr>
        `;
      } else {
        rowsHtml = filtered.map(b => `
          <tr>
            <td>
              <div class="table-patient">
                <div class="patient-avatar">${b.patientName.charAt(0) || 'م'}</div>
                <div>
                  <strong>${b.patientName}</strong>
                  <span>${Icons.phone} ${b.patientPhone}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="table-date">
                <span>${DateHelper.formatDateArabic(b.date, false)}</span>
              </div>
            </td>
            <td><strong>${DateHelper.formatTimeArabic(b.startTime)}</strong></td>
            <td><code class="table-id">${b.id}</code></td>
            <td><strong class="table-amount">${b.amount} ${b.currency}</strong></td>
            <td>
              <span class="badge ${b.paymentStatus === 'paid' ? 'badge--green' : 'badge--amber'}">
                ${b.paymentStatus === 'paid' ? 'مدفوع' : 'معلق'}
              </span>
            </td>
            <td>
              <span class="badge ${b.bookingStatus === 'confirmed' ? 'badge--navy' : b.bookingStatus === 'completed' ? 'badge--blue' : 'badge--red'}">
                ${b.bookingStatus === 'confirmed' ? 'مؤكد' : b.bookingStatus === 'completed' ? 'مكتمل' : 'ملغي'}
              </span>
            </td>
            <td>
              <div class="table-actions">
                <button class="btn btn--sm btn--outline view-booking-btn" data-id="${b.id}" title="عرض تفاصيل الحجز">${Icons.user} تفاصيل</button>
              </div>
            </td>
          </tr>
        `).join('');
      }

      return `
        <div class="page-heading">
          <div class="page-heading__copy">
            <div class="page-kicker"><span class="dot">•</span> السجل الكامل</div>
            <h1>جميع الحجوزات المسجلة</h1>
            <p>أرشيف متكامل لجميع حجوزات العيادة مع إمكانية البحث بالاسم أو رقم الهاتف والفلترة بالتواريخ والحالات.</p>
          </div>
        </div>

        <div class="filter-card">
          <div class="filter-row">
            <div class="search-box">
              ${Icons.search}
              <input type="text" id="bookings-search-input" placeholder="ابحث باسم المريض أو رقم الهاتف أو كود الحجز..." value="${App._allBookingsSearch || ''}">
            </div>

            <select id="bookings-status-filter" class="filter-select">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>جميع الحالات</option>
              <option value="confirmed" ${statusFilter === 'confirmed' ? 'selected' : ''}>مؤكد</option>
              <option value="completed" ${statusFilter === 'completed' ? 'selected' : ''}>مكتمل</option>
              <option value="cancelled" ${statusFilter === 'cancelled' ? 'selected' : ''}>ملغي</option>
            </select>

            <select id="bookings-payment-filter" class="filter-select">
              <option value="all" ${paymentFilter === 'all' ? 'selected' : ''}>حالة الدفع: الكل</option>
              <option value="paid" ${paymentFilter === 'paid' ? 'selected' : ''}>مدفوع</option>
              <option value="pending" ${paymentFilter === 'pending' ? 'selected' : ''}>معلق</option>
            </select>

            <input type="date" id="bookings-date-filter" class="input filter-date" value="${dateFilter}">

            <button class="filter-clear" id="bookings-clear-filters-btn">
              ${Icons.x} مسح الفلاتر
            </button>
          </div>
        </div>

        <div class="results-head">
          <span>نتائج البحث: <strong>${filtered.length}</strong> من إجمالي ${allBookings.length} حجز</span>
        </div>

        <div class="table-card">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>اسم المريض ورقم الهاتف</th>
                  <th>تاريخ الحجز</th>
                  <th>التوقيت</th>
                  <th>رقم الحجز</th>
                  <th>المبلغ</th>
                  <th>حالة الدفع</th>
                  <th>حالة الحجز</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    bindDoctorAllBookingsEvents() {
      const searchInput = document.getElementById('bookings-search-input');
      const statusSelect = document.getElementById('bookings-status-filter');
      const paymentSelect = document.getElementById('bookings-payment-filter');
      const dateInput = document.getElementById('bookings-date-filter');
      const clearBtn = document.getElementById('bookings-clear-filters-btn');

      const applyFilters = () => {
        App._allBookingsSearch = searchInput?.value || '';
        App._allBookingsStatus = statusSelect?.value || 'all';
        App._allBookingsPayment = paymentSelect?.value || 'all';
        App._allBookingsDate = dateInput?.value || '';
        App.refreshCurrentView();
      };

      searchInput?.addEventListener('input', () => applyFilters());
      statusSelect?.addEventListener('change', () => applyFilters());
      paymentSelect?.addEventListener('change', () => applyFilters());
      dateInput?.addEventListener('change', () => applyFilters());

      clearBtn?.addEventListener('click', () => {
        App._allBookingsSearch = '';
        App._allBookingsStatus = 'all';
        App._allBookingsPayment = 'all';
        App._allBookingsDate = '';
        App.refreshCurrentView();
      });

      document.querySelectorAll('.view-booking-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const bookingId = btn.getAttribute('data-id');
          Modals.openBookingDetailsModal(bookingId);
        });
      });
    },

    /* ---------------- DOCTOR SETTINGS VIEW ---------------- */
    DoctorSettings() {
      const settings = ClinicEngine.getSettings();
      const auth = ClinicEngine.getAuth();

      return `
        <div class="page-heading">
          <div class="page-heading__copy">
            <div class="page-kicker"><span class="dot">•</span> التخصيص والأمان</div>
            <h1>إعدادات العيادة والحساب</h1>
            <p>تعديل بيانات العيادة، سعر الكشف، تفضيلات الجدولة الأسبوعية، وبيانات تسجيل الدخول.</p>
          </div>
        </div>

        <div class="settings-layout">
          <div class="settings-stack">
            <!-- Clinic Info Card -->
            <div class="settings-card">
              <div class="settings-card__head">
                <div class="settings-card__icon">${Icons.stethoscope}</div>
                <div>
                  <h2>بيانات العيادة والطبيب</h2>
                  <p>تظهر هذه البيانات للمرضى في بوابة الحجز وعلى إيصالات الدفع</p>
                </div>
              </div>
              <form id="clinic-settings-form">
                <div class="settings-card__body">
                  <div class="modal-form-grid">
                    <div class="field span-2">
                      <label for="set-clinic-name">اسم العيادة</label>
                      <input type="text" id="set-clinic-name" class="input" value="${settings.clinicName || 'عيادة الشفاء التخصصية'}" required>
                    </div>
                    <div class="field">
                      <label for="set-doctor-name">اسم الطبيب</label>
                      <input type="text" id="set-doctor-name" class="input" value="${settings.doctorName || 'د. أحمد محمد'}" required>
                    </div>
                    <div class="field">
                      <label for="set-specialty">التخصص الطبي</label>
                      <input type="text" id="set-specialty" class="input" value="${settings.specialty || 'طب الباطنة والجهاز الهضمي'}" required>
                    </div>
                    <div class="field">
                      <label for="set-price">سعر الكشف (بالجنيه المصري)</label>
                      <input type="number" id="set-price" class="input" value="${settings.price || 100}" min="1" step="5" required>
                    </div>
                    <div class="field">
                      <label for="set-currency">العملة</label>
                      <input type="text" id="set-currency" class="input" value="${settings.currency || 'ج.م'}" readonly style="background: var(--surface);">
                    </div>
                  </div>
                </div>
                <div class="settings-card__foot">
                  <p>${Icons.info} يتم تطبيق التغييرات فوراً على واجهة حجز المرضى.</p>
                  <button type="submit" class="btn btn--accent btn--sm">${Icons.check} حفظ بيانات العيادة</button>
                </div>
              </form>
            </div>

            <!-- Scheduling Preferences Card -->
            <div class="settings-card">
              <div class="settings-card__head">
                <div class="settings-card__icon">${Icons.calendar}</div>
                <div>
                  <h2>تفضيلات الجدولة الأسبوعية</h2>
                  <p>تحديد أول أيام الأسبوع المعروض للمرضى والمدة الزمنية الافتراضية للجلسات</p>
                </div>
              </div>
              <form id="schedule-settings-form">
                <div class="settings-card__body">
                  <div class="modal-form-grid">
                    <div class="field">
                      <label for="set-first-day">أول أيام الأسبوع</label>
                      <select id="set-first-day" class="select">
                        <option value="sat" ${(settings.firstDayOfWeek || 'sat') === 'sat' ? 'selected' : ''}>السبت (المعتمد في مصر)</option>
                        <option value="sun" ${settings.firstDayOfWeek === 'sun' ? 'selected' : ''}>الأحد</option>
                        <option value="mon" ${settings.firstDayOfWeek === 'mon' ? 'selected' : ''}>الإثنين</option>
                      </select>
                    </div>
                    <div class="field">
                      <label for="set-duration">المدة الافتراضية للجلسة (دقيقة)</label>
                      <select id="set-duration" class="select">
                        <option value="15" ${settings.defaultDuration === 15 ? 'selected' : ''}>15 دقيقة</option>
                        <option value="20" ${settings.defaultDuration === 20 ? 'selected' : ''}>20 دقيقة</option>
                        <option value="30" ${(settings.defaultDuration || 30) === 30 ? 'selected' : ''}>30 دقيقة (افتراضي)</option>
                        <option value="45" ${settings.defaultDuration === 45 ? 'selected' : ''}>45 دقيقة</option>
                        <option value="60" ${settings.defaultDuration === 60 ? 'selected' : ''}>60 دقيقة</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="settings-card__foot">
                  <p>تغيير أول أيام الأسبوع يعيد حساب الأسبوع الحالي للمرضى تلقائياً.</p>
                  <button type="submit" class="btn btn--accent btn--sm">${Icons.check} حفظ تفضيلات الجدولة</button>
                </div>
              </form>
            </div>

            <!-- Account Credentials Card -->
            <div class="settings-card">
              <div class="settings-card__head">
                <div class="settings-card__icon">${Icons.lock}</div>
                <div>
                  <h2>إعدادات أمان الحساب وتغيير كلمة المرور</h2>
                  <p>تعديل اسم المستخدم وكلمة المرور الخاصة بلوحة تحكم الطبيب</p>
                </div>
              </div>
              <form id="account-credentials-form">
                <div class="settings-card__body">
                  <div class="modal-form-grid">
                    <div class="field span-2">
                      <label for="acc-current-pass">كلمة المرور الحالية (مطلوبة للتحقق)</label>
                      <input type="password" id="acc-current-pass" class="input" placeholder="أدخل كلمة المرور الحالية" required autocomplete="current-password">
                    </div>
                    <div class="field">
                      <label for="acc-new-username">اسم المستخدم الجديد</label>
                      <input type="text" id="acc-new-username" class="input" value="${auth.username || 'doctor'}" required autocomplete="username">
                    </div>
                    <div class="field">
                      <label for="acc-new-pass">كلمة المرور الجديدة</label>
                      <input type="password" id="acc-new-pass" class="input" placeholder="6 خانات على الأقل" required autocomplete="new-password">
                    </div>
                    <div class="field span-2">
                      <label for="acc-confirm-pass">تأكيد كلمة المرور الجديدة</label>
                      <input type="password" id="acc-confirm-pass" class="input" placeholder="أعد إدخال كلمة المرور الجديدة" required autocomplete="new-password">
                    </div>
                  </div>
                </div>
                <div class="settings-card__foot">
                  <p>${Icons.shield} يرجى حفظ بياناتك الجديدة جيداً للتمكن من الدخول لاحقاً.</p>
                  <button type="submit" class="btn btn--accent btn--sm">${Icons.check} تحديث بيانات الدخول</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Settings Sidebar Actions -->
          <div class="settings-side">
            <div class="profile-card">
              <div class="profile-card__head">
                <div class="doctor-avatar">د</div>
                <div>
                  <strong>${settings.doctorName || 'د. أحمد محمد'}</strong>
                  <span>طبيب العيادة المعتمد</span>
                </div>
              </div>
              <div class="profile-card__info">
                <div class="profile-card__row">
                  <span>اسم المستخدم:</span>
                  <strong>${auth.username || 'doctor'}</strong>
                </div>
                <div class="profile-card__row">
                  <span>التخصص:</span>
                  <strong>${settings.specialty || 'طب الباطنة'}</strong>
                </div>
                <div class="profile-card__row">
                  <span>سعر الكشف:</span>
                  <strong>${settings.price || 100} ${settings.currency || 'ج.م'}</strong>
                </div>
              </div>
            </div>

            <!-- Reset Demo Data Card -->
            <div class="danger-card">
              <h3>${Icons.alert} إعادة ضبط البيانات التجريبية</h3>
              <p>استعادة البيانات الأولية للنموذج التجريبي وإعادة الجداول والمواعيد الافتراضية وحذف أي حجوزات تمت إضافتها لاحقاً.</p>
              <button type="button" class="btn btn--danger-soft" id="settings-reset-demo-btn">
                ${Icons.refresh} إعادة ضبط النظام إلى بيانات العرض
              </button>
            </div>
          </div>
        </div>
      `;
    },

    bindDoctorSettingsEvents() {
      // Clinic Info Form
      document.getElementById('clinic-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const clinicName = document.getElementById('set-clinic-name').value;
        const doctorName = document.getElementById('set-doctor-name').value;
        const specialty = document.getElementById('set-specialty').value;
        const price = Number(document.getElementById('set-price').value) || 100;

        ClinicEngine.updateSettings({ clinicName, doctorName, specialty, price });
        showToast('تم الحفظ', 'تم تحديث بيانات العيادة وسعر الكشف بنجاح.', 'success');
        App.refreshCurrentView();
      });

      // Scheduling Form
      document.getElementById('schedule-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstDayOfWeek = document.getElementById('set-first-day').value;
        const defaultDuration = Number(document.getElementById('set-duration').value) || 30;

        ClinicEngine.updateSettings({ firstDayOfWeek, defaultDuration });
        showToast('تم الحفظ', 'تم تحديث تفضيلات الجدولة الأسبوعية بنجاح.', 'success');
        App.refreshCurrentView();
      });

      // Account Credentials Form
      document.getElementById('account-credentials-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPass = document.getElementById('acc-current-pass').value;
        const newUsername = document.getElementById('acc-new-username').value;
        const newPass = document.getElementById('acc-new-pass').value;
        const confirmPass = document.getElementById('acc-confirm-pass').value;

        if (newPass !== confirmPass) {
          showToast('خطأ في التأكيد', 'كلمة المرور الجديدة غير متطابقة مع حقل التأكيد.', 'error');
          return;
        }

        const res = ClinicEngine.updateCredentials(currentPass, newUsername, newPass);
        if (res.success) {
          showToast('تم التحديث بنجاح', 'تم تغيير بيانات تسجيل الدخول. يمكنك الآن استخدام بياناتك الجديدة.', 'success');
          App.refreshCurrentView();
        } else {
          showToast('تعذر التحديث', res.error, 'error');
        }
      });

      // Reset Demo Data Button
      document.getElementById('settings-reset-demo-btn')?.addEventListener('click', () => {
        Modals.openResetDataConfirm();
      });
    },
  });

})();
