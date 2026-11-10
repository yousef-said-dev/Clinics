/**
 * نبض — الراوتر والتهيئة (App Router & Bootstrap)
 * Frontend-Only Prototype (HTML5, CSS3, Vanilla JS, LocalStorage)
 * Part of the modular build. Load order is defined in index.html.
 */

'use strict';

  /* ==========================================================================
     9. APPLICATION ROUTER & STATE
     ========================================================================== */

  const App = {
    currentRoute: '',
    activeSubView: '', // 'overview', 'schedule', 'today', 'all-bookings', 'settings'
    patientBookingState: {
      selectedDate: null,
      selectedSlot: null,
      patientName: '',
      patientPhone: '',
      paymentScenario: 'success', // 'success' or 'fail'
      bookingResult: null
    },

    init() {
      initDemoData();
      Modal.init();
      Motion.init();

      // Setup window hash listener
      window.addEventListener('hashchange', () => this.handleRouting());

      // Real-time synchronization across browser tabs
      window.addEventListener('storage', (e) => {
        if (Object.values(STORAGE_KEYS).includes(e.key)) {
          this.refreshCurrentView();
          if (e.key === STORAGE_KEYS.BOOKINGS && this.currentRoute === 'doctor') {
            showToast('تحديث جديد', 'تم تسجيل حجز جديد في النظام.', 'info');
          }
        }
      });

      // Initial route
      if (!window.location.hash) {
        window.location.hash = '#landing';
      } else {
        this.handleRouting();
      }
    },

    handleRouting() {
      const hash = window.location.hash.replace(/^#/, '');
      const parts = hash.split('/');
      const mainRoute = parts[0] || 'landing';
      const subRoute = parts[1] || 'overview';

      // Doctor protection guard
      if (mainRoute === 'doctor' && !Auth.isLoggedIn()) {
        showToast('تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول للوصول إلى لوحة تحكم العيادة.', 'warning');
        this.navigate('doctor-login');
        return;
      }

      const isSameRoute = mainRoute === this.currentRoute &&
        (mainRoute !== 'doctor' || subRoute === this.activeSubView);

      // remember previous route to pick the right theatrical transition
      const routeChanged = this.currentRoute !== mainRoute;
      const wipeLabels = {
        'doctor': 'لوحة تحكم الطبيب…',
        'doctor-login': 'منطقة الطبيب…',
        'patient': 'بوابة المرضى…'
      };

      this.currentRoute = mainRoute;
      this.activeSubView = subRoute;

      if (isSameRoute) {
        // data / step refresh inside the same page: no full transition
        this.render();
        Motion.onSameRoute(mainRoute, subRoute);
        return;
      }

      const go = () => {
        this.render();
        Motion.run(mainRoute, subRoute);
      };

      // Seamless route transition without stuck overlay
      Motion.leave(go);
    },

    navigate(route, subView = '') {
      const newHash = subView ? `#${route}/${subView}` : `#${route}`;
      if (window.location.hash !== newHash) {
        window.location.hash = newHash;
      }
      this.handleRouting();
    },

    refreshCurrentView() {
      this.render();
      Motion.onSameRoute(this.currentRoute, this.activeSubView);
    },

    render() {
      const appContainer = document.getElementById('app');
      if (!appContainer) return;

      if (this.currentRoute === 'landing') {
        document.body.classList.add('is-landing-active');
      } else {
        document.body.classList.remove('is-landing-active');
      }

      switch (this.currentRoute) {
        case 'landing':
          appContainer.innerHTML = Views.Landing();
          Views.bindLandingEvents();
          break;
        case 'doctor-login':
          if (Auth.isLoggedIn()) {
            this.navigate('doctor', 'overview');
            return;
          }
          appContainer.innerHTML = Views.DoctorLogin();
          Views.bindDoctorLoginEvents();
          break;
        case 'doctor':
          appContainer.innerHTML = Views.DoctorShell(this.activeSubView);
          Views.bindDoctorShellEvents(this.activeSubView);
          break;
        case 'patient':
          appContainer.innerHTML = Views.PatientPortal();
          Views.bindPatientPortalEvents();
          break;
        default:
          this.navigate('landing');
      }

      // Render floating demo helper pill
      this.renderFloatingHelper();
    },

    renderFloatingHelper() {
      let existing = document.getElementById('demo-quick-switcher');
      if (existing) existing.remove();

      const switcher = document.createElement('div');
      switcher.id = 'demo-quick-switcher';
      switcher.setAttribute('role', 'navigation');
      switcher.setAttribute('aria-label', 'التنقل السريع بين صفحات العرض');

      switcher.innerHTML = `
        <button type="button" id="sw-landing" class="demo-sw-btn" title="الرئيسية" aria-label="الرئيسية" data-cursor="الرئيسية">
          <span class="demo-sw-icon">${Icons.home}</span>
          <span class="demo-sw-label">الرئيسية</span>
        </button>
        <button type="button" id="sw-patient" class="demo-sw-btn" title="بوابة حجز المرضى" aria-label="بوابة حجز المرضى" data-cursor="حجز المرضى">
          <span class="demo-sw-icon">${Icons.calendar}</span>
          <span class="demo-sw-label">حجز المرضى</span>
        </button>
        <button type="button" id="sw-doctor" class="demo-sw-btn" title="لوحة الطبيب" aria-label="لوحة الطبيب" data-cursor="لوحة الطبيب">
          <span class="demo-sw-icon">${Icons.stethoscope}</span>
          <span class="demo-sw-label">لوحة الطبيب</span>
        </button>
        <button type="button" id="sw-reset" class="demo-sw-btn demo-sw-btn--reset" title="إعادة ضبط البيانات التجريبية" aria-label="إعادة ضبط البيانات التجريبية" data-cursor="إعادة الضبط">
          <span class="demo-sw-icon">${Icons.refresh}</span>
        </button>
      `;

      document.body.appendChild(switcher);

      switcher.querySelector('#sw-landing').onclick = () => App.navigate('landing');
      switcher.querySelector('#sw-patient').onclick = () => App.navigate('patient');
      switcher.querySelector('#sw-doctor').onclick = () => {
        if (Auth.isLoggedIn()) App.navigate('doctor', 'overview');
        else App.navigate('doctor-login');
      };
      switcher.querySelector('#sw-reset').onclick = () => Modals.openResetDataConfirm();
    }
  };

  window.nabdApp = App;

  function boot() {
    try {
      App.init();
    } catch (error) {
      document.title = 'INIT ERROR: ' + error.message;
      const marker = document.createElement('pre');
      marker.textContent = 'INIT ERROR ' + error.message + ' :: ' + String(error && error.stack || '').slice(0, 400);
      marker.style.cssText = 'position:fixed;top:0;right:0;z-index:99999;background:#fff;color:#b00;font-size:11px;padding:10px;max-width:100%;white-space:pre-wrap;';
      document.body.appendChild(marker);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
