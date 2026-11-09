/**
 * نبض — البنية الأساسية (Constants, Storage, Engine, Auth)
 * Frontend-Only Prototype (HTML5, CSS3, Vanilla JS, LocalStorage)
 * Part of the modular build. Load order is defined in index.html.
 */

'use strict';

  /* ==========================================================================
     1. STORAGE & CONSTANTS
     ========================================================================== */

  const STORAGE_KEYS = {
    SETTINGS: 'nabd_clinic_settings',
    AUTH: 'nabd_doctor_auth',
    SCHEDULE: 'nabd_weekly_schedule',
    OVERRIDES: 'nabd_schedule_overrides',
    BOOKINGS: 'nabd_bookings',
    PAYMENTS: 'nabd_payments',
    SESSION: 'nabd_active_session'
  };

  const DAYS = [
    { key: 'sat', name: 'السبت', index: 6 },
    { key: 'sun', name: 'الأحد', index: 0 },
    { key: 'mon', name: 'الإثنين', index: 1 },
    { key: 'tue', name: 'الثلاثاء', index: 2 },
    { key: 'wed', name: 'الأربعاء', index: 3 },
    { key: 'thu', name: 'الخميس', index: 4 },
    { key: 'fri', name: 'الجمعة', index: 5 }
  ];

  const MONTH_NAMES = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // Storage helper
  const Storage = {
    get(key, fallback = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (e) {
        console.error('Storage get error for key:', key, e);
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Storage set error for key:', key, e);
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Storage remove error:', key, e);
      }
    }
  };

  /* ==========================================================================
     2. SVG ICONS
     ========================================================================== */

  const Icons = {
    calendar: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    clock: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    user: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    phone: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    check: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    checkCircle: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    x: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    alert: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    wallet: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`,
    cash: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    shield: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    lock: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    eye: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    eyeOff: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
    settings: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    search: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    filter: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
    plus: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    edit: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    trash: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    logout: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
    chevronLeft: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    chevronRight: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    printer: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`,
    refresh: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    home: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    list: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
    arrowRight: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
    arrowLeft: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
    sparkles: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>`,
    info: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    stethoscope: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3"></path><path d="M6 3h-3"></path><path d="M12 3h-3"></path><path d="M9 12.5v4.5a3 3 0 0 0 6 0V15"></path><circle cx="15" cy="15" r="2"></circle></svg>`
  };

  /* ==========================================================================
     3. DATE & TIME UTILITIES
     ========================================================================== */

  const DateHelper = {
    // Return YYYY-MM-DD
    toISODate(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    },

    // Parse YYYY-MM-DD
    fromISODate(isoStr) {
      const [y, m, d] = isoStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    },

    // Get today's ISO string
    todayISO() {
      return this.toISODate(new Date());
    },

    // Map JS getDay() to day key
    getDayKey(date) {
      const dayMap = { 6: 'sat', 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri' };
      return dayMap[date.getDay()];
    },

    getDayName(dayKey) {
      const found = DAYS.find(d => d.key === dayKey);
      return found ? found.name : '';
    },

    // Format Arabic Date e.g. "السبت، 31 أكتوبر 2026"
    formatDateArabic(isoStr, includeYear = true) {
      if (!isoStr) return '';
      const date = this.fromISODate(isoStr);
      const dayKey = this.getDayKey(date);
      const dayName = this.getDayName(dayKey);
      const dayNum = date.getDate();
      const monthName = MONTH_NAMES[date.getMonth()];
      const year = date.getFullYear();
      return includeYear
        ? `${dayName}، ${dayNum} ${monthName} ${year}`
        : `${dayName}، ${dayNum} ${monthName}`;
    },

    // Convert "17:00" -> "05:00 م", "10:30" -> "10:30 ص"
    formatTimeArabic(timeStr) {
      if (!timeStr) return '';
      const [hStr, mStr] = timeStr.split(':');
      let h = parseInt(hStr, 10);
      const m = mStr || '00';
      const period = h >= 12 ? 'م' : 'ص';
      h = h % 12;
      if (h === 0) h = 12;
      const hDisplay = String(h).padStart(2, '0');
      return `${hDisplay}:${m} ${period}`;
    },

    // Time to minutes from midnight
    timeToMinutes(timeStr) {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    },

    // Minutes to "HH:MM"
    minutesToTime(totalMinutes) {
      const h = Math.floor(totalMinutes / 60) % 24;
      const m = totalMinutes % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    },

    // Calculate current week dates based on doctor's firstDayOfWeek ('sat' | 'sun' | 'mon')
    getCurrentWeekDates(firstDayKey = 'sat', baseDate = new Date()) {
      const dayIndexMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
      const targetIndex = dayIndexMap[firstDayKey] ?? 6;
      const currentDayIndex = baseDate.getDay();

      const diff = (currentDayIndex - targetIndex + 7) % 7;
      const startDate = new Date(baseDate);
      startDate.setDate(baseDate.getDate() - diff);
      startDate.setHours(0, 0, 0, 0);

      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const iso = this.toISODate(d);
        const dayKey = this.getDayKey(d);
        weekDates.push({
          date: d,
          iso,
          dayKey,
          dayName: this.getDayName(dayKey),
          dayNum: d.getDate(),
          monthNum: d.getMonth() + 1,
          monthName: MONTH_NAMES[d.getMonth()],
          isToday: iso === this.todayISO()
        });
      }
      return weekDates;
    },

    // Check if slot has already passed
    isPastSlot(dateIso, startTimeStr) {
      const today = this.todayISO();
      if (dateIso < today) return true;
      if (dateIso > today) return false;

      // Same day, compare hours & minutes
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const slotMinutes = this.timeToMinutes(startTimeStr);
      return slotMinutes <= currentMinutes;
    },

    // Check overlap between a proposed slot and existing slots
    hasOverlap(slots, newStart, newEnd, excludeSlotId = null) {
      const startMin = this.timeToMinutes(newStart);
      const endMin = this.timeToMinutes(newEnd);

      if (endMin <= startMin) return true; // Invalid range

      for (const slot of slots) {
        if (excludeSlotId && slot.id === excludeSlotId) continue;
        const sMin = this.timeToMinutes(slot.startTime);
        const eMin = this.timeToMinutes(slot.endTime);

        // Overlap condition: startMin < eMin && endMin > sMin
        if (startMin < eMin && endMin > sMin) {
          return true;
        }
      }
      return false;
    }
  };

  /* ==========================================================================
     4. DEFAULT DEMO DATA GENERATION
     ========================================================================== */

  function initDemoData(force = false) {
    if (!force && Storage.get(STORAGE_KEYS.SETTINGS)) {
      return; // Data already exists
    }

    const defaultSettings = {
      clinicName: 'عيادة الشفاء التخصصية',
      doctorName: 'د. أحمد محمد',
      specialty: 'طب الباطنة والجهاز الهضمي',
      price: 100,
      currency: 'ج.م',
      firstDayOfWeek: 'sat', // السبت هو أول أيام الأسبوع في مصر
      defaultDuration: 30, // 30 دقيقة
      phone: '01001234567',
      address: 'القاهرة، مصر الجديدة - ميدان تريومف'
    };

    const defaultAuth = {
      username: 'doctor',
      password: 'Doctor@123'
    };

    // Weekly schedule across all 7 days (Saturday through Friday)
    // Notice: Saturday afternoon slot (5:00 PM / 17:00) is kept free so the user can test creating it in step 5!
    const defaultSchedule = {
      sat: [
        { id: 'sat-1', startTime: '10:00', endTime: '10:30' },
        { id: 'sat-2', startTime: '11:00', endTime: '11:30' },
        { id: 'sat-3', startTime: '12:00', endTime: '12:30' }
      ],
      sun: [
        { id: 'sun-1', startTime: '12:00', endTime: '12:30' },
        { id: 'sun-2', startTime: '13:00', endTime: '13:30' },
        { id: 'sun-3', startTime: '17:00', endTime: '17:30' }
      ],
      mon: [
        { id: 'mon-1', startTime: '10:00', endTime: '10:30' },
        { id: 'mon-2', startTime: '11:00', endTime: '11:30' },
        { id: 'mon-3', startTime: '16:00', endTime: '16:30' }
      ],
      tue: [
        { id: 'tue-1', startTime: '10:00', endTime: '10:30' },
        { id: 'tue-2', startTime: '11:00', endTime: '11:30' }
      ],
      wed: [
        { id: 'wed-1', startTime: '12:00', endTime: '12:30' },
        { id: 'wed-2', startTime: '13:00', endTime: '13:30' },
        { id: 'wed-3', startTime: '18:00', endTime: '18:30' }
      ],
      thu: [
        { id: 'thu-1', startTime: '10:00', endTime: '10:30' },
        { id: 'thu-2', startTime: '11:00', endTime: '11:30' },
        { id: 'thu-3', startTime: '17:00', endTime: '17:30' }
      ],
      fri: [
        { id: 'fri-1', startTime: '15:00', endTime: '15:30' },
        { id: 'fri-2', startTime: '16:00', endTime: '16:30' }
      ]
    };

    const defaultOverrides = {};

    // Generate realistic sample bookings for today and this week
    const todayISO = DateHelper.todayISO();
    const todayKey = DateHelper.getDayKey(new Date());

    const defaultBookings = [
      {
        id: 'BK-849201',
        patientName: 'محمود إبراهيم الشناوي',
        patientPhone: '01012345678',
        date: todayISO,
        startTime: '10:00',
        endTime: '10:30',
        slotId: `${todayKey}-1`,
        amount: 100,
        currency: 'ج.م',
        paymentId: 'PAY-549102',
        paymentMethod: 'فودافون كاش',
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        createdAt: new Date().toISOString(),
        notes: 'كشف دوري - متابعة باطنية',
        isSample: true
      },
      {
        id: 'BK-719342',
        patientName: 'سارة عادل عبد الرحمن',
        patientPhone: '01198765432',
        date: todayISO,
        startTime: '11:00',
        endTime: '11:30',
        slotId: `${todayKey}-2`,
        amount: 100,
        currency: 'ج.م',
        paymentId: 'PAY-318491',
        paymentMethod: 'فودافون كاش',
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        createdAt: new Date().toISOString(),
        notes: 'متابعة نتائج التحاليل والفحوصات',
        isSample: true
      }
    ];

    const defaultPayments = [
      {
        id: 'PAY-549102',
        bookingId: 'BK-849201',
        patientName: 'محمود إبراهيم الشناوي',
        walletPhone: '01012345678',
        amount: 100,
        currency: 'ج.م',
        method: 'فودافون كاش',
        status: 'success',
        timestamp: new Date().toISOString(),
        isSample: true
      },
      {
        id: 'PAY-318491',
        bookingId: 'BK-719342',
        patientName: 'سارة عادل عبد الرحمن',
        walletPhone: '01198765432',
        amount: 100,
        currency: 'ج.م',
        method: 'فودافون كاش',
        status: 'success',
        timestamp: new Date().toISOString(),
        isSample: true
      }
    ];

    Storage.set(STORAGE_KEYS.SETTINGS, defaultSettings);
    Storage.set(STORAGE_KEYS.AUTH, defaultAuth);
    Storage.set(STORAGE_KEYS.SCHEDULE, defaultSchedule);
    Storage.set(STORAGE_KEYS.OVERRIDES, defaultOverrides);
    Storage.set(STORAGE_KEYS.BOOKINGS, defaultBookings);
    Storage.set(STORAGE_KEYS.PAYMENTS, defaultPayments);
  }

  /* ==========================================================================
     5. TOAST NOTIFICATIONS
     ========================================================================== */

  function showToast(title, message, type = 'success', duration = 3500) {
    const region = document.getElementById('toast-region');
    if (!region) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');

    let iconHtml = Icons.check;
    if (type === 'error') iconHtml = Icons.x;
    if (type === 'warning') iconHtml = Icons.alert;
    if (type === 'info') iconHtml = Icons.info;

    toast.innerHTML = `
      <div class="toast__icon">${iconHtml}</div>
      <div class="toast__copy">
        <strong>${title}</strong>
        <span>${message}</span>
      </div>
      <button class="toast__close" aria-label="إغلاق التنبيه">${Icons.x}</button>
    `;

    const closeBtn = toast.querySelector('.toast__close');
    const dismiss = () => {
      toast.classList.add('is-leaving');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    closeBtn.addEventListener('click', dismiss);
    region.appendChild(toast);
    if (typeof Motion !== 'undefined' && Motion.toastIn) Motion.toastIn(toast);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  /* ==========================================================================
     6. MODAL SYSTEM
     ========================================================================== */

  const Modal = {
    root: null,

    init() {
      this.root = document.getElementById('modal-root');
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    },

    open(htmlContent, customClass = '') {
      if (!this.root) return;
      document.body.classList.add('modal-open');
      // When GSAP drives the animation, drop the CSS keyframes so they
      // can't fight (or freeze at opacity:0 over) the inline tween styles.
      const gsapMode = typeof Motion !== 'undefined' && Motion.isOk() ? ' modal--gsap' : '';
      this.root.innerHTML = `
        <div class="modal-backdrop${gsapMode}" id="modal-backdrop">
          <div class="modal${gsapMode} ${customClass}" role="dialog" aria-modal="true">
            ${htmlContent}
          </div>
        </div>
      `;

      const backdrop = document.getElementById('modal-backdrop');
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.close();
      });

      const closeBtns = this.root.querySelectorAll('[data-modal-close]');
      closeBtns.forEach(btn => btn.addEventListener('click', () => this.close()));
    },

    close() {
      if (!this.root) return;
      document.body.classList.remove('modal-open');
      const backdrop = this.root.querySelector('.modal-backdrop');
      const panel = this.root.querySelector('.modal');
      if (Motion.isOk() && backdrop && panel && !this._closing) {
        this._closing = true;
        const done = () => {
          this._closing = false;
          this.root.innerHTML = '';
          document.body.classList.remove('modal-open');
          if (typeof Motion.onModalClosed === 'function') Motion.onModalClosed();
        };
        Motion.modalOut(backdrop, panel, done);
        return;
      }
      this._closing = false;
      this.root.innerHTML = '';
    }
  };

  /* ==========================================================================
     7. CLINIC ENGINE (DATA LAYER)
     ========================================================================== */

  const ClinicEngine = {
    getSettings() {
      return Storage.get(STORAGE_KEYS.SETTINGS, {});
    },

    updateSettings(newSettings) {
      const current = this.getSettings();
      const updated = { ...current, ...newSettings };
      Storage.set(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    },

    getAuth() {
      return Storage.get(STORAGE_KEYS.AUTH, { username: 'doctor', password: 'Doctor@123' });
    },

    updateCredentials(currentPassword, newUsername, newPassword) {
      const auth = this.getAuth();
      if (currentPassword !== auth.password) {
        return { success: false, error: 'كلمة المرور الحالية غير صحيحة.' };
      }
      if (!newUsername || newUsername.trim().length < 3) {
        return { success: false, error: 'اسم المستخدم الجديد يجب أن يتكون من 3 أحرف على الأقل.' };
      }
      if (!newPassword || newPassword.length < 6) {
        return { success: false, error: 'كلمة المرور الجديدة يجب أن تتكون من 6 خانات على الأقل.' };
      }

      auth.username = newUsername.trim();
      auth.password = newPassword;
      Storage.set(STORAGE_KEYS.AUTH, auth);
      return { success: true };
    },

    getWeeklySchedule() {
      return Storage.get(STORAGE_KEYS.SCHEDULE, {});
    },

    getOverrides() {
      return Storage.get(STORAGE_KEYS.OVERRIDES, {});
    },

    getBookings() {
      return Storage.get(STORAGE_KEYS.BOOKINGS, []);
    },

    getPayments() {
      return Storage.get(STORAGE_KEYS.PAYMENTS, []);
    },

    // Get combined schedule for a specific date (combines recurring + single-date overrides + booking status)
    getScheduleForDate(dateIso) {
      const date = DateHelper.fromISODate(dateIso);
      const dayKey = DateHelper.getDayKey(date);
      const weekly = this.getWeeklySchedule();
      const overrides = this.getOverrides();
      const bookings = this.getBookings();

      let baseSlots = (weekly[dayKey] || []).map(s => ({ ...s, isRecurring: true }));

      // Apply single-date overrides if any
      const dayOverrides = overrides[dateIso] || [];
      for (const ov of dayOverrides) {
        if (ov.action === 'delete') {
          baseSlots = baseSlots.filter(s => s.id !== ov.slotId);
        } else if (ov.action === 'edit') {
          const idx = baseSlots.findIndex(s => s.id === ov.slotId);
          if (idx !== -1) {
            baseSlots[idx] = { ...baseSlots[idx], startTime: ov.startTime, endTime: ov.endTime, isOverride: true };
          }
        } else if (ov.action === 'add') {
          baseSlots.push({ id: ov.id, startTime: ov.startTime, endTime: ov.endTime, isOverride: true });
        }
      }

      // Sort by start time
      baseSlots.sort((a, b) => DateHelper.timeToMinutes(a.startTime) - DateHelper.timeToMinutes(b.startTime));

      // Attach booking info & availability state
      const processedSlots = baseSlots.map(slot => {
        // Find if slot is booked on this date
        const booking = bookings.find(b =>
          b.date === dateIso &&
          (b.slotId === slot.id || (b.startTime === slot.startTime && b.endTime === slot.endTime)) &&
          b.bookingStatus !== 'cancelled'
        );

        const isPast = DateHelper.isPastSlot(dateIso, slot.startTime);
        let status = 'available';

        if (booking) {
          status = 'booked';
        } else if (isPast) {
          status = 'past';
        }

        return {
          ...slot,
          date: dateIso,
          dayKey,
          status,
          booking: booking || null,
          formattedTime: `${DateHelper.formatTimeArabic(slot.startTime)} - ${DateHelper.formatTimeArabic(slot.endTime)}`,
          formattedStart: DateHelper.formatTimeArabic(slot.startTime),
          formattedEnd: DateHelper.formatTimeArabic(slot.endTime)
        };
      });

      return processedSlots;
    },

    // Add session slot
    addSlot({ dayKey, dateIso, startTime, endTime, scope = 'weekly' }) {
      // Validation
      if (DateHelper.timeToMinutes(endTime) <= DateHelper.timeToMinutes(startTime)) {
        return { success: false, error: 'وقت نهاية الجلسة يجب أن يكون بعد وقت البداية.' };
      }

      const existingSlots = this.getScheduleForDate(dateIso);
      if (DateHelper.hasOverlap(existingSlots, startTime, endTime)) {
        return { success: false, error: 'يوجد تعارض في التوقيت! الجلسة تتداخل مع جلسة أخرى مسجلة.' };
      }

      const newId = `slot-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      if (scope === 'weekly') {
        const weekly = this.getWeeklySchedule();
        if (!weekly[dayKey]) weekly[dayKey] = [];
        weekly[dayKey].push({ id: newId, startTime, endTime });
        weekly[dayKey].sort((a, b) => DateHelper.timeToMinutes(a.startTime) - DateHelper.timeToMinutes(b.startTime));
        Storage.set(STORAGE_KEYS.SCHEDULE, weekly);
      } else {
        // Single date override
        const overrides = this.getOverrides();
        if (!overrides[dateIso]) overrides[dateIso] = [];
        overrides[dateIso].push({ action: 'add', id: newId, startTime, endTime });
        Storage.set(STORAGE_KEYS.OVERRIDES, overrides);
      }

      return { success: true };
    },

    // Edit session slot
    editSlot({ slotId, dayKey, dateIso, startTime, endTime, scope = 'weekly' }) {
      if (DateHelper.timeToMinutes(endTime) <= DateHelper.timeToMinutes(startTime)) {
        return { success: false, error: 'وقت نهاية الجلسة يجب أن يكون بعد وقت البداية.' };
      }

      const existingSlots = this.getScheduleForDate(dateIso);
      if (DateHelper.hasOverlap(existingSlots, startTime, endTime, slotId)) {
        return { success: false, error: 'يوجد تعارض في التوقيت! الموعد الجديد يتداخل مع جلسة أخرى.' };
      }

      if (scope === 'weekly') {
        const weekly = this.getWeeklySchedule();
        const slots = weekly[dayKey] || [];
        const target = slots.find(s => s.id === slotId);
        if (target) {
          target.startTime = startTime;
          target.endTime = endTime;
          slots.sort((a, b) => DateHelper.timeToMinutes(a.startTime) - DateHelper.timeToMinutes(b.startTime));
          Storage.set(STORAGE_KEYS.SCHEDULE, weekly);
        }
      } else {
        // Single date override
        const overrides = this.getOverrides();
        if (!overrides[dateIso]) overrides[dateIso] = [];
        overrides[dateIso].push({ action: 'edit', slotId, startTime, endTime });
        Storage.set(STORAGE_KEYS.OVERRIDES, overrides);
      }

      return { success: true };
    },

    // Delete session slot
    deleteSlot({ slotId, dayKey, dateIso, scope = 'weekly' }) {
      if (scope === 'weekly') {
        const weekly = this.getWeeklySchedule();
        if (weekly[dayKey]) {
          weekly[dayKey] = weekly[dayKey].filter(s => s.id !== slotId);
          Storage.set(STORAGE_KEYS.SCHEDULE, weekly);
        }
      } else {
        // Single date override
        const overrides = this.getOverrides();
        if (!overrides[dateIso]) overrides[dateIso] = [];
        overrides[dateIso].push({ action: 'delete', slotId });
        Storage.set(STORAGE_KEYS.OVERRIDES, overrides);
      }

      return { success: true };
    },

    // Create a new booking
    createBooking({ patientName, patientPhone, dateIso, slot, amount, walletPhone }) {
      // Race condition / duplicate booking check
      const currentSlots = this.getScheduleForDate(dateIso);
      const targetSlot = currentSlots.find(s => s.id === slot.id || (s.startTime === slot.startTime && s.endTime === slot.endTime));

      if (!targetSlot || targetSlot.status !== 'available') {
        return {
          success: false,
          error: 'عذراً! تم حجز هذه الجلسة بالفعل أو لم تعد متاحة. يرجى اختيار موعد آخر.'
        };
      }

      const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
      const paymentId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
      const nowIso = new Date().toISOString();

      const newBooking = {
        id: bookingId,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        date: dateIso,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotId: slot.id,
        amount: Number(amount),
        currency: 'ج.م',
        paymentId,
        paymentMethod: 'فودافون كاش',
        walletPhone: walletPhone.trim(),
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        createdAt: nowIso
      };

      const newPayment = {
        id: paymentId,
        bookingId,
        patientName: patientName.trim(),
        walletPhone: walletPhone.trim(),
        amount: Number(amount),
        currency: 'ج.م',
        method: 'فودافون كاش',
        status: 'success',
        timestamp: nowIso
      };

      const bookings = this.getBookings();
      bookings.unshift(newBooking);
      Storage.set(STORAGE_KEYS.BOOKINGS, bookings);

      const payments = this.getPayments();
      payments.unshift(newPayment);
      Storage.set(STORAGE_KEYS.PAYMENTS, payments);

      return {
        success: true,
        booking: newBooking,
        payment: newPayment
      };
    },

    // Update booking status
    updateBookingStatus(bookingId, newStatus) {
      const bookings = this.getBookings();
      const b = bookings.find(item => item.id === bookingId);
      if (b) {
        b.bookingStatus = newStatus;
        Storage.set(STORAGE_KEYS.BOOKINGS, bookings);
        return true;
      }
      return false;
    },

    // Calculate live dashboard statistics
    getDashboardStats() {
      const todayISO = DateHelper.todayISO();
      const todaySlots = this.getScheduleForDate(todayISO);
      const allBookings = this.getBookings();
      const allPayments = this.getPayments();

      const todayBookings = allBookings.filter(b => b.date === todayISO && b.bookingStatus !== 'cancelled');
      const todayAvailable = todaySlots.filter(s => s.status === 'available').length;
      const todayBooked = todaySlots.filter(s => s.status === 'booked').length;

      // Upcoming bookings (strictly from today onwards)
      const upcomingBookings = allBookings.filter(b => b.date >= todayISO && b.bookingStatus === 'confirmed');

      // Total payments recorded
      const totalRevenue = allPayments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      // Find immediate next appointment today
      const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      const upcomingToday = todayBookings
        .filter(b => DateHelper.timeToMinutes(b.startTime) >= nowMinutes)
        .sort((a, b) => DateHelper.timeToMinutes(a.startTime) - DateHelper.timeToMinutes(b.startTime));

      const nextAppointment = upcomingToday[0] || todayBookings[0] || null;

      return {
        todayBookingsCount: todayBookings.length,
        todayAvailableCount: todayAvailable,
        todayBookedCount: todayBooked,
        upcomingCount: upcomingBookings.length,
        totalRevenue,
        todayBookingsList: todayBookings,
        nextAppointment
      };
    }
  };

  /* ==========================================================================
     8. AUTHENTICATION (DOCTOR PORTAL)
     ========================================================================== */

  const Auth = {
    isLoggedIn() {
      const session = Storage.get(STORAGE_KEYS.SESSION, null);
      if (!session) return false;
      // Optional session validity check
      return !!session.token;
    },

    login(username, password, remember = true) {
      const creds = ClinicEngine.getAuth();
      if (username.trim() === creds.username && password === creds.password) {
        const session = {
          username: creds.username,
          token: 'token-' + Date.now(),
          loginTime: new Date().toISOString()
        };
        Storage.set(STORAGE_KEYS.SESSION, session);
        return { success: true };
      }
      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' };
    },

    logout() {
      Storage.remove(STORAGE_KEYS.SESSION);
    }
  };

  /* ==========================================================================
     VIEW REGISTRY — populated by js/views-*.js
     ========================================================================== */

  const Views = {};
