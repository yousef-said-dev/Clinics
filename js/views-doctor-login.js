/**
 * نبض — صفحة تسجيل دخول الطبيب (Doctor Login)
 * Frontend-Only Prototype (HTML5, CSS3, Vanilla JS, LocalStorage)
 * Part of the modular build. Load order is defined in index.html.
 */

(function () {
  'use strict';

  Object.assign(Views, {
    /* ---------------- DOCTOR LOGIN ---------------- */
    DoctorLogin() {
      const settings = ClinicEngine.getSettings();
      return `
        <div class="auth-page">
          <div class="auth-panel">
            <div class="auth-top-link">
              <button class="auth-back" id="login-back-to-landing">
                ${Icons.chevronRight} العودة لموقع العيادة
              </button>
            </div>

            <div class="auth-card">
              <div class="auth-brand">
                <div class="brand-mark brand-mark--lg">
                  <svg viewBox="0 0 64 64" fill="none"><path d="M12 34h11l6-17 9 31 6-22 4 8h9" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="brand-word">
                  <strong>${settings.doctorName || 'د. أحمد محمد'}</strong>
                  <span>${settings.clinicName || 'عيادة الشفاء التخصصية'}</span>
                </div>
              </div>

              <div class="auth-welcome">مرحباً بك د. أحمد محمد</div>
              <h1 class="auth-title">تسجيل دخول الطبيب</h1>
              <p class="auth-subtitle">أدخل بيانات الحساب لإدارة جدول المواعيد وكشوفات المرضى.</p>

              <div class="auth-error" id="auth-error-msg">
                ${Icons.alert}
                <span id="auth-error-text">اسم المستخدم أو كلمة المرور غير صحيحة.</span>
              </div>

              <form class="auth-form" id="doctor-login-form">
                <div class="field">
                  <label for="doctor-username">اسم المستخدم</label>
                  <input type="text" id="doctor-username" class="input" placeholder="أدخل اسم المستخدم" required autocomplete="username" value="doctor">
                </div>

                <div class="field">
                  <label for="doctor-password">كلمة المرور</label>
                  <div style="position: relative; display: flex; align-items: center;">
                    <input type="password" id="doctor-password" class="input" placeholder="••••••••" required autocomplete="current-password" value="Doctor@123" style="width: 100%; padding-left: 42px;">
                    <button type="button" id="toggle-password-btn" style="position: absolute; left: 12px; background: none; border: 0; color: #7b8a99; cursor: pointer; padding: 4px;" title="إظهار / إخفاء كلمة المرور">
                      ${Icons.eye}
                    </button>
                  </div>
                </div>

                <div class="auth-options">
                  <label style="display: flex; align-items: center; gap: 7px; font-size: 11.5px; cursor: pointer;">
                    <input type="checkbox" id="remember-me" checked>
                    <span>تذكّر تسجيل الدخول</span>
                  </label>
                </div>

                <button type="submit" class="btn btn--accent auth-submit">
                  ${Icons.lock} تسجيل الدخول للوحة التحكم
                </button>
              </form>

              <div class="auth-demo">
                <div class="auth-demo__head">
                  ${Icons.info} بيانات الدخول التجريبية الخاصة بالطبيب:
                </div>
                <div class="auth-demo__body">
                  <span>اسم المستخدم: <code>doctor</code></span>
                  <span>كلمة المرور: <code>Doctor@123</code></span>
                </div>
              </div>

              <div class="auth-security-note">
                ${Icons.shield}
                <span>ملاحظة: هذا نموذج أولي تجريبي يعمل على المتصفح عبر التخزين المحلي (LocalStorage).</span>
              </div>
            </div>
          </div>

          <div class="auth-visual">
            <div class="auth-visual__top">
              <span class="badge badge--green">${settings.clinicName || 'عيادة الشفاء التخصصية'}</span>
            </div>
            <div style="max-width: 440px;">
              <h2 style="font-size: 28px; font-weight: 800; line-height: 1.4; color: #fff;">
                عيادة ${settings.doctorName || 'د. أحمد محمد'}
              </h2>
              <p style="margin-top: 10px; color: rgba(255,255,255,0.7); font-size: 13.5px; line-height: 1.8;">
                ${settings.specialty || 'استشاري طب الباطنة والجهاز الهضمي'} — تحكم بالجدول الأسبوعي للعيادة، تابع كشوفات اليوم، واستعرض سجلات المرضى والمدفوعات بكل سهولة ودقة.
              </p>
            </div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
              جميع الحقوق محفوظة © عيادة ${settings.doctorName || 'د. أحمد محمد'}
            </div>
          </div>
        </div>
      `;
    },

    bindDoctorLoginEvents() {
      document.getElementById('login-back-to-landing')?.addEventListener('click', () => App.navigate('landing'));

      const passInput = document.getElementById('doctor-password');
      const toggleBtn = document.getElementById('toggle-password-btn');
      if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
          if (passInput.type === 'password') {
            passInput.type = 'text';
            toggleBtn.innerHTML = Icons.eyeOff;
          } else {
            passInput.type = 'password';
            toggleBtn.innerHTML = Icons.eye;
          }
        });
      }

      const form = document.getElementById('doctor-login-form');
      const errorBox = document.getElementById('auth-error-msg');
      const errorText = document.getElementById('auth-error-text');

      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('doctor-username').value;
        const password = passInput.value;
        const remember = document.getElementById('remember-me')?.checked ?? true;

        const res = Auth.login(username, password, remember);
        if (res.success) {
          showToast('مرحباً بك دكتور', 'تم تسجيل الدخول بنجاح.', 'success');
          App.navigate('doctor', 'overview');
        } else {
          if (errorBox) {
            errorBox.classList.add('is-visible');
            if (errorText) errorText.textContent = res.error;
          }
        }
      });
    },
  });

})();
