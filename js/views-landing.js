/**
 * نبض — صفحة الهبوط (Landing)
 * Frontend-Only Prototype (HTML5, CSS3, Vanilla JS, LocalStorage)
 * Part of the modular build. Load order is defined in index.html.
 */

(function () {
  'use strict';

  Object.assign(Views, {
    /* ---------------- LANDING PAGE (DR. MONTGOMERY EXACT THEME) ---------------- */
    Landing() {
      const settings = ClinicEngine.getSettings();
      // Doctor image URL: Using local transparent PNG (background removed)
      const doctorImageUrl = "OIP_transparent.png";

      return `
        <div class="mont-landing" id="landing" dir="rtl">
          <!-- Top Navigation Bar -->
          <header class="mont-nav-wrap" id="mont-header">
            <div class="mont-nav">
              <a href="#landing" class="mont-brand" id="mont-nav-brand">
                <span class="mont-brand-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 4v16m-8-8h16"/>
                  </svg>
                </span>
                <span>د.احمد محمد</span>
              </a>

              <!-- Desktop Navigation Links -->
              <ul class="mont-nav-links">
                <li><button type="button" class="mont-nav-link" id="link-about">عن الدكتور</button></li>
                <li><button type="button" class="mont-nav-link" id="link-testimonials">آراء المرضى</button></li>
                <li><button type="button" class="mont-nav-link" id="link-contact">اتصل بنا</button></li>
              </ul>

              <div class="mont-nav-actions">
                <button type="button" class="mont-nav-btn mont-nav-btn--desktop" id="mont-nav-consultation">استشارة</button>
                <button type="button" class="mont-nav-toggle" id="mont-nav-toggle" aria-label="فتح القائمة الرئيسية" aria-expanded="false" aria-controls="mont-nav-mobile">
                  <span class="mont-toggle-line"></span>
                  <span class="mont-toggle-line"></span>
                  <span class="mont-toggle-line"></span>
                </button>
              </div>
            </div>

            <!-- Mobile Dropdown / Drawer -->
            <div class="mont-nav-mobile" id="mont-nav-mobile" aria-hidden="true">
              <div class="mont-nav-mobile-inner">
                <ul class="mont-nav-mobile-links">
                  <li>
                    <button type="button" class="mont-nav-mobile-link" id="mobile-link-about">
                      <span class="mont-nav-icon">🏥</span>
                      <span>عن الدكتور والخدمات</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="mont-nav-mobile-link" id="mobile-link-testimonials">
                      <span class="mont-nav-icon">⭐</span>
                      <span>آراء المرضى والتقييمات</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="mont-nav-mobile-link" id="mobile-link-contact">
                      <span class="mont-nav-icon">📍</span>
                      <span>اتصل بنا والموقع</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="mont-nav-mobile-link" id="mobile-link-doctor">
                      <span class="mont-nav-icon">👨‍⚕️</span>
                      <span>بوابة دخول الطبيب</span>
                    </button>
                  </li>
                </ul>
                <div class="mont-nav-mobile-cta">
                  <button type="button" class="mont-nav-mobile-btn" id="mobile-nav-consultation">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>طلب استشارة طبية الآن</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          <!-- Backdrop for mobile menu -->
          <div class="mont-nav-backdrop" id="mont-nav-backdrop" aria-hidden="true"></div>

          <!-- Hero Stage (Holds Navy Base underneath & White Card on top) -->
          <div class="mont-hero-stage">
            <!-- Dark Navy Base Layer at the bottom with subtle lighter-blue curved bands -->
            <div class="mont-navy-base" id="mont-navy-base">
              <svg class="mont-navy-bands" viewBox="0 0 1440 220" fill="none" preserveAspectRatio="none">
                <path d="M-60 140 C 280 100, 620 170, 1080 120 C 1280 90, 1420 130, 1500 110" stroke="rgba(56, 112, 235, 0.35)" stroke-width="26" stroke-linecap="round"/>
                <path d="M-80 190 C 240 160, 520 220, 980 170 C 1220 140, 1380 180, 1520 160" stroke="rgba(42, 92, 215, 0.25)" stroke-width="18" stroke-linecap="round"/>
              </svg>

              <!-- Mouse Scroll Indicator on the bottom-right over the navy area -->
              <div class="mont-scroll-pill" id="mont-scroll-pill" title="Scroll down" aria-label="Scroll down">
                <div class="mont-scroll-wheel"></div>
              </div>
            </div>

            <!-- White Card with REVERSED CURVE (curved part is at the bottom of the shape) -->
            <div class="mont-white-card" id="mont-white-card">
              <!-- Background subtle doodle lines with animated ECG wave -->
              <svg class="mont-bg-doodles" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
                <path d="M-50 430 C 250 380, 420 480, 700 400" stroke="rgba(165, 195, 250, 0.45)" stroke-width="2" stroke-linecap="round" fill="none"/>
                <path d="M780 390 C 1050 330, 1220 420, 1500 340" stroke="rgba(165, 195, 250, 0.45)" stroke-width="2" stroke-linecap="round" fill="none"/>
                <path d="M840 340 C 1100 270, 1300 370, 1520 300" stroke="rgba(190, 215, 252, 0.35)" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                <!-- Creative pulse wave -->
                <path class="mont-ekg-line" d="M -50 360 L 450 360 L 470 340 L 485 385 L 505 315 L 525 395 L 540 345 L 560 360 L 1490 360" stroke="rgba(27, 79, 198, 0.3)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              </svg>

              <section class="mont-hero">
                <div class="mont-hero-grid">
                  <!-- Left Column: Headline & Action -->
                  <div class="mont-hero-left" id="mont-hero-left">
                    <span class="mont-eyebrow">طبيب باطني</span>
                    <h1 class="mont-heading">
                      احقق<br>
                      أفضل نسخة من<br>
                      <span class="mont-highlight">صحتك</span>
                    </h1>
                    <p class="mont-desc">
                      خطوتك الأولى نحو صحة أفضل<br>مع رعاية شخصية.
                    </p>
                    <button type="button" class="mont-btn-primary" id="mont-hero-consultation">
                      <span>استشارة</span>
                      <span class="arrow">←</span>
                    </button>
                  </div>

                  <!-- Center Column: Doctor Portrait -->
                  <div class="mont-hero-center" id="mont-hero-center">
                    <div class="mont-doctor-glow" id="mont-doctor-glow"></div>
                    <div class="mont-doctor-frame">
                      <!-- Creative Floating Badges -->
                      <div class="mont-float-badge mont-float-badge--live" id="mont-float-live">
                        <span class="mont-live-dot"></span>
                        <span>متاح للحجز اليوم</span>
                      </div>
                      <div class="mont-float-badge mont-float-badge--rating" id="mont-float-rating">
                        <span class="mont-badge-star">★</span>
                        <span>تقييم سريري 4.9</span>
                      </div>

                      <!-- DOCTOR IMAGE: Replace this src with your real photo whenever ready -->
                      <img 
                        src="${doctorImageUrl}" 
                        alt="د. احمد محمد" 
                        class="mont-doctor-img" 
                        id="mont-doctor-img"
                        loading="eager"
                      />
                    </div>
                  </div>

                  <!-- Right Column: Doctor's Quote -->
                  <div class="mont-hero-right" id="mont-hero-right">
                    <div class="mont-quote-icon">”</div>
                    <p class="mont-quote-text">
                      أنا هنا لتقديم رعاية متخصصة، وتوجيهك خلال مخاوفك الصحية، ومساعدتك على عيش حياة أكثر صحة.
                    </p>
                    <div class="mont-quote-author">د. هاربر مونتغمري</div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- ═══════ LIVE CLINICAL STATUS TICKER ═══════ -->
          
          <!-- ═══════ TRUST METRICS STRIP ═══════ -->
          <section class="mont-trust-strip" id="section-metrics">
            <div class="mont-trust-bg-wave" aria-hidden="true">
              <svg viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none">
                <path class="mont-metrics-ekg" d="M -50 45 L 380 45 L 400 22 L 415 68 L 430 14 L 448 72 L 465 28 L 485 45 L 1490 45" stroke="rgba(27, 79, 198, 0.16)" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </div>
            <div class="mont-trust-inner">
              <div class="mont-metric-item" data-metric="15" data-suffix="+">
                <div class="mont-metric-badge">
                  <div class="mont-metric-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <span class="mont-metric-num" data-target="15">+15</span>
                </div>
                <span class="mont-metric-label">عاماً من الخبرة السريرية المعتمدة</span>
              </div>
              <div class="mont-metric-sep"></div>
              <div class="mont-metric-item" data-metric="4800" data-suffix="+">
                <div class="mont-metric-badge">
                  <div class="mont-metric-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <span class="mont-metric-num" data-target="4800">+4,800</span>
                </div>
                <span class="mont-metric-label">كشف واستشارة طبية ناجحة</span>
              </div>
              <div class="mont-metric-sep"></div>
              <div class="mont-metric-item" data-metric="99.4" data-suffix="%" data-decimals="1">
                <div class="mont-metric-badge">
                  <div class="mont-metric-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <span class="mont-metric-num" data-target="99.4">%99.4</span>
                </div>
                <span class="mont-metric-label">نسبة تقييمات المرضى الإيجابية</span>
              </div>
              <div class="mont-metric-sep"></div>
              <div class="mont-metric-item" data-metric="0" data-suffix=" دقيقة">
                <div class="mont-metric-badge">
                  <span class="mont-metric-live-dot"></span>
                  <span class="mont-metric-num" data-target="0">0 دقيقة</span>
                </div>
                <span class="mont-metric-label">متوسط وقت الانتظار بالحجز المسبق</span>
              </div>
            </div>
          </section>

          <!-- ═══════ ABOUT & CLINICAL PILLARS (MODERN BENTO GRID) ═══════ -->
          <section class="mont-section mont-section--relative" id="section-about">
            <!-- Ambient glowing decorative shapes -->
            <div class="mont-ambient-orb mont-ambient-orb--1" aria-hidden="true"></div>
            <div class="mont-ambient-orb mont-ambient-orb--2" aria-hidden="true"></div>
            <div class="mont-ambient-cross mont-cross-1" aria-hidden="true">✚</div>
            <div class="mont-ambient-cross mont-cross-2" aria-hidden="true">✚</div>

            <div class="mont-section-header">
              <span class="mont-section-eyebrow">نهجنا الطبي والرعاية السريرية</span>
              <h2 class="mont-section-title">رعاية ترتكز على جذور الحالة لا مجرد تسكين الأعراض</h2>
              <p class="mont-section-desc">نؤمن في عيادتنا بأن كل مريض يستحق وقتاً كاملاً واستماعاً دقيقاً لتشخيص شامل، مع وضع خطة علاجية ووقائية مخصصة تناسب صحتك ونمط حياتك.</p>
            </div>

            <div class="mont-bento-grid">
              <!-- Feature Card 1: Main Detailed Diagnostic Assessment (Large) -->
              <div class="mont-bento-card mont-bento-card--large">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-bento-badge">الركيزة الأساسية</div>
                <div class="mont-bento-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <h3 class="mont-bento-title">استشارة متأنية وتشخيص سريري متكامل</h3>
                <p class="mont-bento-p">
                  جلسات استشارة متأنية (تصل إلى 40 دقيقة) تشمل قياس وتقييم المؤشرات الحيوية، فحص وظائف الجهاز الهضمي والباطنة، ومراجعة الفحوصات والتحاليل المخبرية بدقة لوضع تشخيص سليم من المرة الأولى.
                </p>
                <div class="mont-bento-tags">
                  <span class="mont-tag">فحص المؤشرات الحيوية</span>
                  <span class="mont-tag">تشخيص الجهاز الهضمي</span>
                  <span class="mont-tag">مراجعة الفحوصات المخبرية</span>
                  <span class="mont-tag">متابعة الضغط والسكري</span>
                </div>

                <!-- Live Vital Signs Monitor HUD -->
                <div class="mont-vital-hud">
                  <div class="mont-hud-item">
                    <div class="mont-hud-wave-wrap">
                      <svg class="mont-hud-ecg" viewBox="0 0 100 24" fill="none">
                        <path class="mont-hud-ecg-path" d="M 0 12 L 30 12 L 35 4 L 42 20 L 48 2 L 54 22 L 60 9 L 66 12 L 100 12" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="mont-hud-info">
                      <span class="mont-hud-label">نبض القلب المباشر</span>
                      <span class="mont-hud-val"><strong class="mont-hud-bpm">72</strong> bpm <span class="mont-hud-dot"></span></span>
                    </div>
                  </div>

                  <div class="mont-hud-sep"></div>

                  <div class="mont-hud-item">
                    <div class="mont-hud-info">
                      <span class="mont-hud-label">ضغط الدم المعياري</span>
                      <span class="mont-hud-val"><strong>120/80</strong> mmHg</span>
                    </div>
                  </div>

                  <div class="mont-hud-sep"></div>

                  <div class="mont-hud-item">
                    <div class="mont-hud-info">
                      <span class="mont-hud-label">تشبع الأكسجين SpO2</span>
                      <span class="mont-hud-val"><strong>%99</strong> مستقر</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Feature Card 2: Custom Care Plans -->
              <div class="mont-bento-card">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-bento-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3 class="mont-bento-title">خطط علاجية مخصصة ومستدامة</h3>
                <p class="mont-bento-p">
                  بروتوكولات علاجية قائمة على أحدث الأدلة الطبية، مصممة بدقة لتلائم تاريخك المرضي وجدولك اليومي دون إرهاق بالأدوية غير الضرورية.
                </p>
              </div>

              <!-- Feature Card 3: Preventive Care -->
              <div class="mont-bento-card">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-bento-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <h3 class="mont-bento-title">الرعاية الوقائية واستدامة الصحة</h3>
                <p class="mont-bento-p">
                  برامج كشف استباقية وتوجيهات غذائية وحياتية متقدمة لتجنب الانتكاسات وتعزيز المناعة والنشاط العام على المدى الطويل.
                </p>
              </div>

              <!-- Feature Card 4: Digital Continuity -->
              <div class="mont-bento-card">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-bento-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <h3 class="mont-bento-title">متابعة رقمية وتأكيد فوري</h3>
                <p class="mont-bento-p">
                  نظام حجز ذكي بدون انتظار، إيصالات دفع إلكترونية مؤكدة، وسهولة تامة في متابعة استجابتك للعلاج مع العيادة.
                </p>
              </div>
            </div>
          </section>

          <!-- ═══════ PATIENT JOURNEY / 3-STEP PROCESS ═══════ -->
          <section class="mont-section mont-section--tinted mont-section--relative" id="section-journey">
            <div class="mont-section-header">
              <span class="mont-section-eyebrow">خطوات زيارتك</span>
              <h2 class="mont-section-title">تجربة علاجية سلسة ومنظمة من لحظة الحجز</h2>
              <p class="mont-section-desc">صممنا نظام الحجز والكشف ليكون واضحاً ومريحاً ويوفر وقتك بالكامل.</p>
            </div>

            <!-- Connected Pathway Track -->
            <div class="mont-journey-track-container" aria-hidden="true">
              <svg class="mont-journey-track-svg" viewBox="0 0 1000 50" fill="none" preserveAspectRatio="none">
                <!-- Base guide line (RTL: from right to left) -->
                <path class="mont-track-dashed" d="M 900 25 L 100 25" stroke="rgba(27, 79, 198, 0.15)" stroke-width="3" stroke-dasharray="8 8" />
                <!-- Illuminated fill line drawn by GSAP -->
                <path class="mont-track-line" d="M 900 25 L 100 25" stroke="url(#journeyPulseGrad)" stroke-width="4.5" stroke-linecap="round" />
                <!-- Glowing beacon circle traveling along the line -->
                <circle class="mont-track-beacon" cx="900" cy="25" r="7" fill="#1b4fc6" />
                <defs>
                  <linearGradient id="journeyPulseGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#1b4fc6" />
                    <stop offset="50%" stop-color="#3870eb" />
                    <stop offset="100%" stop-color="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div class="mont-journey-grid">
              <div class="mont-journey-step">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-step-glow" aria-hidden="true"></div>
                <div class="mont-step-header">
                  <span class="mont-step-number">01</span>
                  <span class="mont-step-line"></span>
                </div>
                <h3 class="mont-step-title">حجز الموعد إلكترونياً</h3>
                <p class="mont-step-p">اختر اليوم المناسب والفترة الصباحية أو المسائية واحجز في أقل من دقيقة بتأكيد فوري ومباشر.</p>
              </div>

              <div class="mont-journey-step">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-step-glow" aria-hidden="true"></div>
                <div class="mont-step-header">
                  <span class="mont-step-number">02</span>
                  <span class="mont-step-line"></span>
                </div>
                <h3 class="mont-step-title">كشف واستماع متأنٍ</h3>
                <p class="mont-step-p">احضر في موعدك المحدد مباشرة دون أي انتظار، مع فحص سريري دقيق واستماع لكافة شكواك الصحية.</p>
              </div>

              <div class="mont-journey-step">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-step-glow" aria-hidden="true"></div>
                <div class="mont-step-header">
                  <span class="mont-step-number">03</span>
                  <span class="mont-step-line"></span>
                </div>
                <h3 class="mont-step-title">خطة علاجية ومتابعة</h3>
                <p class="mont-step-p">استلم خطة علاجك وتوجيهاتك الوقائية مع جدول متابعة واضح لضمان تحقيق أفضل نتائج صحية.</p>
              </div>
            </div>
          </section>

          <!-- ═══════ TESTIMONIALS & SOCIAL PROOF ═══════ -->
          <section class="mont-section mont-section--relative" id="section-testimonials">
            <div class="mont-section-header">
              <span class="mont-section-eyebrow">آراء وتجارب المرضى</span>
              <h2 class="mont-section-title">ثقة نعتز بها من مئات المراجعين</h2>
              <div class="mont-rating-badge">
                <div class="mont-stars">
                  <span class="mont-star-item">★</span>
                  <span class="mont-star-item">★</span>
                  <span class="mont-star-item">★</span>
                  <span class="mont-star-item">★</span>
                  <span class="mont-star-item">★</span>
                </div>
                <span class="mont-rating-text">تقييم <strong>4.9 من 5.0</strong> استناداً لأكثر من 250 تقييم موثق</span>
              </div>
            </div>

            <div class="mont-reviews-grid">
              <!-- Review 1 -->
              <div class="mont-review-card">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-quote-watermark" aria-hidden="true">“</div>
                <div class="mont-review-head">
                  <div class="mont-review-avatar">أ.ح</div>
                  <div class="mont-review-user">
                    <h4 class="mont-review-name">أحمد حسن</h4>
                    <span class="mont-review-tag">كشف باطنة عام وفحص دوري</span>
                  </div>
                  <span class="mont-verified-pill">مريض موثق ✓</span>
                </div>
                <p class="mont-review-quote">
                  "أكثر ما يميز د. أحمد هو أمانته في التشخيص واستماعه بدون أي استعجال. فسر لي أسباب الأعراض التي كنت أعاني منها لشهور، وبفضل الله تحسنت حالتي بشكل ملحوظ بعد الالتزام بالخطة."
                </p>
                <div class="mont-review-audio-indicator" title="تسجيل صوتي سريري موثق">
                  <span class="mont-audio-icon">🎙️</span>
                  <div class="mont-audio-waveform">
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                  </div>
                  <span class="mont-audio-label">استشارة مسجلة وموثقة</span>
                </div>
                <div class="mont-review-foot">
                  <span class="mont-stars-sm">★★★★★</span>
                  <span class="mont-review-date">منذ أسبوعين</span>
                </div>
              </div>

              <!-- Review 2 -->
              <div class="mont-review-card">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-quote-watermark" aria-hidden="true">“</div>
                <div class="mont-review-avatar-wrap">
                  <div class="mont-review-head">
                    <div class="mont-review-avatar" style="background: #eef2ff; color: #1b4fc6;">م.ع</div>
                    <div class="mont-review-user">
                      <h4 class="mont-review-name">مروة عبد الرحمن</h4>
                      <span class="mont-review-tag">صحة الجهاز الهضمي والقولون</span>
                    </div>
                    <span class="mont-verified-pill">مريض موثق ✓</span>
                  </div>
                </div>
                <p class="mont-review-quote">
                  "النظام في العيادة ممتاز جداً، لا يوجد أي وقت انتظار بفضل الحجز المسبق. الدكتور متمكن جداً وخلوق، وشرح لي النظام الغذائي والعلاجي بكل بساطة ووضوح."
                </p>
                <div class="mont-review-audio-indicator" title="تسجيل صوتي سريري موثق">
                  <span class="mont-audio-icon">🎙️</span>
                  <div class="mont-audio-waveform">
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                  </div>
                  <span class="mont-audio-label">استشارة مسجلة وموثقة</span>
                </div>
                <div class="mont-review-foot">
                  <span class="mont-stars-sm">★★★★★</span>
                  <span class="mont-review-date">منذ شهر</span>
                </div>
              </div>

              <!-- Review 3 -->
              <div class="mont-review-card">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <div class="mont-quote-watermark" aria-hidden="true">“</div>
                <div class="mont-review-head">
                  <div class="mont-review-avatar" style="background: #eff6ff; color: #0c2152;">ع.س</div>
                  <div class="mont-review-user">
                    <h4 class="mont-review-name">عمرو السعيد</h4>
                    <span class="mont-review-tag">متابعة دورية وضغط الدم</span>
                  </div>
                  <span class="mont-verified-pill">مريض موثق ✓</span>
                </div>
                <p class="mont-review-quote">
                  "طبيب يراعي ضميره بكل ما تعنيه الكلمة. لم يطلب تحاليل غير مبررة ووضع خطة علاج متوازنة تماماً. أنصح أي شخص يبحث عن طبيب باطنة ممتاز بالتوجه لعيادته."
                </p>
                <div class="mont-review-audio-indicator" title="تسجيل صوتي سريري موثق">
                  <span class="mont-audio-icon">🎙️</span>
                  <div class="mont-audio-waveform">
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                    <span class="mont-wave-bar"></span>
                  </div>
                  <span class="mont-audio-label">استشارة مسجلة وموثقة</span>
                </div>
                <div class="mont-review-foot">
                  <span class="mont-stars-sm">★★★★★</span>
                  <span class="mont-review-date">منذ 3 أسابيع</span>
                </div>
              </div>
            </div>
          </section>

          <!-- ═══════ FAQ ACCORDION ═══════ -->
          <section class="mont-section mont-section--tinted" id="section-faq">
            <div class="mont-section-header">
              <span class="mont-section-eyebrow">الأسئلة الشائعة</span>
              <h2 class="mont-section-title">إجابات على أكثر استفسارات المرضى</h2>
              <p class="mont-section-desc">كل ما تود معرفته عن الكشف، نظام المواعيد، وطرق الدفع بالعيادة.</p>
            </div>

            <div class="mont-faq-container">
              <div class="mont-faq-item is-active">
                <button type="button" class="mont-faq-trigger">
                  <span class="mont-faq-title">كيف يتم تأكيد موعد الكشف بعد الحجز الإلكتروني؟</span>
                  <span class="mont-faq-chevron"></span>
                </button>
                <div class="mont-faq-content">
                  <p>بمجرد اختيار اليوم والفترة المناسبة لك على الموقع، يتم حجز مقعدك وتأكيده فورياً. يمكنك إتمام الدفع بسهولة عبر فودافون كاش أو كاش بالعيادة مع استلام إيصال الحجز فوراً.</p>
                </div>
              </div>

              <div class="mont-faq-item">
                <button type="button" class="mont-faq-trigger">
                  <span class="mont-faq-title">كم تستغرق جلسة الكشف الطبي مع الدكتور؟</span>
                  <span class="mont-faq-chevron"></span>
                </button>
                <div class="mont-faq-content">
                  <p>تستغرق الاستشارة ما بين 30 إلى 45 دقيقة لضمان فحص سريري كامل، الاستماع لكافة شكواك ومراجعة فحوصاتك السابقة دون أي استعجال.</p>
                </div>
              </div>

              <div class="mont-faq-item">
                <button type="button" class="mont-faq-trigger">
                  <span class="mont-faq-title">هل يجب إحضار تحاليل أو فحوصات سابقة؟</span>
                  <span class="mont-faq-chevron"></span>
                </button>
                <div class="mont-faq-content">
                  <p>نعم، نوصي بإحضار أي تحاليل أو تقارير طبية سابقة أو أدوية تتناولها حالياً لمساعدة الطبيب في تكوين صورة كاملة ودقيقة عن حالتك الصحية.</p>
                </div>
              </div>

              <div class="mont-faq-item">
                <button type="button" class="mont-faq-trigger">
                  <span class="mont-faq-title">كيف تتم المتابعة بعد بدء الخطة العلاجية؟</span>
                  <span class="mont-faq-chevron"></span>
                </button>
                <div class="mont-faq-content">
                  <p>يتم تحديد موعد استشارة متابعة دورية لمراجعة نتائج الفحوصات ومتابعة استجابة جسمك للعلاج، مع إمكانية التواصل السريع مع العيادة للاستفسارات الضرورية.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- ═══════ CLINIC INFO & RESERVATION BANNER ═══════ -->
          <section class="mont-section" id="section-contact">
            <div class="mont-contact-split">
              <!-- Info Block -->
              <div class="mont-contact-info">
                <div class="mont-card-spotlight" aria-hidden="true"></div>
                <span class="mont-section-eyebrow">مقر العيادة ومواعيد العمل</span>
                <h3 class="mont-info-heading">موقع العيادة ومواعيد الاستقبال</h3>
                <p class="mont-info-desc">نسعد باستقبالكم وتوفير أعلى مستويات الراحة والرعاية الطبية المنظمة.</p>

                <div class="mont-info-list">
                  <div class="mont-info-row">
                    <div class="mont-info-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <strong>عنوان العيادة</strong>
                      <span>عيادة الشفاء التخصصية — القاهرة، جمهورية مصر العربية</span>
                    </div>
                  </div>

                  <div class="mont-info-row">
                    <div class="mont-info-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                      <strong>أيام ومواعيد العمل</strong>
                      <span>السبت إلى الخميس: فترات صباحية (10 ص - 2 ظ) ومسائية (5 م - 9 م)</span>
                    </div>
                  </div>

                  <div class="mont-info-row">
                    <div class="mont-info-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                      <strong>للاستفسارات السريعة</strong>
                      <span>دعم الحجز والعيادة متاح يومياً عبر محفظة فودافون كاش ومسؤول الاستقبال</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reservation Card (Navy) -->
              <div class="mont-reserve-card">
                <div class="mont-reserve-glow"></div>
                <!-- Animated radar ripple rings -->
                <div class="mont-radar-wrap" aria-hidden="true">
                  <div class="mont-radar-ring mont-radar-ring--1"></div>
                  <div class="mont-radar-ring mont-radar-ring--2"></div>
                  <div class="mont-radar-ring mont-radar-ring--3"></div>
                </div>
                <span class="mont-reserve-pill">حجز فوري مؤكد</span>
                <h3 class="mont-reserve-title">جاهز لبدء رحلة العناية بصحتك؟</h3>
                <p class="mont-reserve-text">
                  احجز موعد استشارتك الآن مع د. أحمد محمد. استعرض المواعيد المتاحة خلال هذا الأسبوع واختر الوقت الأنسب لك.
                </p>

                <div class="mont-reserve-actions">
                  <button type="button" class="mont-btn-reserve mont-btn-magnetic" id="mont-cta-consultation">
                    <span>احجز موعدك الآن</span>
                    <span class="arrow">←</span>
                  </button>
                  <button type="button" class="mont-btn-doctor-link" id="mont-doctor-portal-btn">
                    <span>بوابة الطبيب</span>
                  </button>
                </div>

                <div class="mont-reserve-trust">
                  <span>✓ بدون إنشاء حساب</span>
                  <span>✓ تأكيد فوري</span>
                  <span>✓ بدون وقت انتظار</span>
                </div>

                <!-- Certified Medical Trust Seal -->
                <div class="mont-reserve-seal" aria-hidden="true">
                  <svg class="mont-seal-svg" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(147, 197, 253, 0.22)" stroke-width="2" stroke-dasharray="4 4" />
                    <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(147, 197, 253, 0.35)" stroke-width="1.5" />
                    <path d="M60 46v28M46 60h28" stroke="#93c5fd" stroke-width="3" stroke-linecap="round" />
                    <circle cx="60" cy="60" r="8" fill="rgba(147, 197, 253, 0.15)" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <!-- ═══════ MODERN REFINED FOOTER ═══════ -->
          <footer class="mont-footer">
            <div class="mont-footer-inner">
              <div class="mont-footer-brand-col">
                <div class="mont-footer-logo">د. أحمد محمد</div>
                <p class="mont-footer-tagline">استشاري طب الباطنة والجهاز الهضمي — رعاية طبية متكاملة برؤية حديثة تضع صحة المريض في المقام الأول.</p>
              </div>

              <div class="mont-footer-links-col">
                <h5 class="mont-footer-heading">روابط سريعة</h5>
                <div class="mont-footer-nav">
                  <button type="button" id="footer-link-about">عن الدكتور</button>
                  <button type="button" id="footer-link-testimonials">آراء المرضى</button>
                  <button type="button" id="footer-link-contact">الموقع ومواعيد العمل</button>
                  <button type="button" id="footer-link-doctor" style="color: #1b4fc6; font-weight: 700;">دخول الطبيب</button>
                </div>
              </div>

              <div class="mont-footer-info-col">
                <h5 class="mont-footer-heading">العيادة</h5>
                <p>عيادة الشفاء التخصصية</p>
                <p class="mont-footer-sub">نظام إلكتروني لإدارة المواعيد السريرية وحجز الكشوفات</p>
              </div>
            </div>

            <div class="mont-footer-bottom">
              <span>جميع الحقوق محفوظة © ${new Date().getFullYear()} عيادة د. أحمد محمد.</span>
              <span class="mont-footer-disclaimer">رعاية طبية موثوقة وتشخيص قائم على الأدلة السريرية.</span>
            </div>
          </footer>
        </div>
      `;
    },

    bindLandingEvents() {
      // Consultation actions navigate to patient portal
      const goToBooking = () => App.navigate('patient');
      document.getElementById('mont-nav-consultation')?.addEventListener('click', goToBooking);
      document.getElementById('mont-hero-consultation')?.addEventListener('click', goToBooking);
      document.getElementById('mont-cta-consultation')?.addEventListener('click', goToBooking);

      // Doctor portal login actions
      const goToDoctor = () => {
        if (Auth.isLoggedIn()) App.navigate('doctor', 'overview');
        else App.navigate('doctor-login');
      };
      document.getElementById('mont-doctor-portal-btn')?.addEventListener('click', goToDoctor);
      document.getElementById('footer-link-doctor')?.addEventListener('click', goToDoctor);

      // Smooth scroll navigation
      const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      };

      // ── Mobile Responsive Navbar Drawer Logic ──
      const navToggle = document.getElementById('mont-nav-toggle');
      const navMobile = document.getElementById('mont-nav-mobile');
      const navBackdrop = document.getElementById('mont-nav-backdrop');

      const closeMobileMenu = () => {
        if (!navToggle || !navMobile) return;
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('is-open');
        navMobile.setAttribute('aria-hidden', 'true');
        navBackdrop?.classList.remove('is-open');
        if (navBackdrop) navBackdrop.setAttribute('aria-hidden', 'true');
      };

      const openMobileMenu = () => {
        if (!navToggle || !navMobile) return;
        navToggle.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navMobile.classList.add('is-open');
        navMobile.setAttribute('aria-hidden', 'false');
        navBackdrop?.classList.add('is-open');
        if (navBackdrop) navBackdrop.setAttribute('aria-hidden', 'false');
      };

      const toggleMobileMenu = () => {
        if (navMobile?.classList.contains('is-open')) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      };

      navToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
      });

      navBackdrop?.addEventListener('click', () => {
        closeMobileMenu();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMobile?.classList.contains('is-open')) {
          closeMobileMenu();
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 860 && navMobile?.classList.contains('is-open')) {
          closeMobileMenu();
        }
      });

      // Mobile Menu Link Actions
      document.getElementById('mobile-link-about')?.addEventListener('click', () => {
        closeMobileMenu();
        scrollToId('section-about');
      });

      document.getElementById('mobile-link-testimonials')?.addEventListener('click', () => {
        closeMobileMenu();
        scrollToId('section-testimonials');
      });

      document.getElementById('mobile-link-contact')?.addEventListener('click', () => {
        closeMobileMenu();
        scrollToId('section-contact');
      });

      document.getElementById('mobile-link-doctor')?.addEventListener('click', () => {
        closeMobileMenu();
        goToDoctor();
      });

      document.getElementById('mobile-nav-consultation')?.addEventListener('click', () => {
        closeMobileMenu();
        goToBooking();
      });

      document.getElementById('link-about')?.addEventListener('click', () => scrollToId('section-about'));
      document.getElementById('footer-link-about')?.addEventListener('click', () => scrollToId('section-about'));

      document.getElementById('link-testimonials')?.addEventListener('click', () => scrollToId('section-testimonials'));
      document.getElementById('footer-link-testimonials')?.addEventListener('click', () => scrollToId('section-testimonials'));

      document.getElementById('link-contact')?.addEventListener('click', () => scrollToId('section-contact'));
      document.getElementById('footer-link-contact')?.addEventListener('click', () => scrollToId('section-contact'));

      document.getElementById('mont-scroll-pill')?.addEventListener('click', () => scrollToId('section-metrics'));

      // ── Enhanced GSAP Accordion Engine ──
      document.querySelectorAll('.mont-faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.mont-faq-item');
          if (!item) return;
          const content = item.querySelector('.mont-faq-content');
          const chevron = item.querySelector('.mont-faq-chevron');
          const wasActive = item.classList.contains('is-active');

          // Close all other accordion items with smooth GSAP tween
          document.querySelectorAll('.mont-faq-item').forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('is-active')) {
              otherItem.classList.remove('is-active');
              const otherContent = otherItem.querySelector('.mont-faq-content');
              const otherChevron = otherItem.querySelector('.mont-faq-chevron');
              if (otherContent) {
                if (typeof gsap !== 'undefined') {
                  gsap.to(otherContent, {
                    maxHeight: 0,
                    opacity: 0,
                    duration: 0.35,
                    ease: 'power2.inOut',
                    onComplete: () => { otherContent.style.paddingBottom = '0px'; }
                  });
                } else {
                  otherContent.style.maxHeight = '0px';
                }
              }
              if (otherChevron && typeof gsap !== 'undefined') {
                gsap.to(otherChevron, { rotate: 45, duration: 0.3, ease: 'power2.out' });
              }
            }
          });

          if (wasActive) {
            item.classList.remove('is-active');
            if (content) {
              if (typeof gsap !== 'undefined') {
                gsap.to(content, {
                  maxHeight: 0,
                  opacity: 0,
                  duration: 0.35,
                  ease: 'power2.inOut',
                  onComplete: () => { content.style.paddingBottom = '0px'; }
                });
              } else {
                content.style.maxHeight = '0px';
              }
            }
            if (chevron && typeof gsap !== 'undefined') {
              gsap.to(chevron, { rotate: 45, duration: 0.3, ease: 'power2.out' });
            }
          } else {
            item.classList.add('is-active');
            if (content) {
              content.style.paddingBottom = '22px';
              if (typeof gsap !== 'undefined') {
                gsap.fromTo(content,
                  { maxHeight: 0, opacity: 0 },
                  { maxHeight: 300, opacity: 1, duration: 0.45, ease: 'power2.out' }
                );
              } else {
                content.style.maxHeight = '300px';
              }
            }
            if (chevron && typeof gsap !== 'undefined') {
              gsap.to(chevron, { rotate: -135, duration: 0.35, ease: 'power2.out' });
            }
          }
        });
      });

      // ── Interactive Subtle 3D Parallax on Doctor Portrait (Hero) ──
      const heroStage = document.getElementById('mont-hero-stage');
      const docImg = document.getElementById('mont-doctor-img');
      const floatLive = document.getElementById('mont-float-live');
      const floatRating = document.getElementById('mont-float-rating');
      const docGlow = document.getElementById('mont-doctor-glow');

      if (heroStage && docImg && window.matchMedia('(min-width: 992px)').matches) {
        heroStage.addEventListener('mousemove', (e) => {
          const rect = heroStage.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          if (typeof gsap !== 'undefined') {
            gsap.to(docImg, { x: x * 16, y: y * 12, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
            if (docGlow) gsap.to(docGlow, { x: x * 22, y: y * 18, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
            if (floatLive) gsap.to(floatLive, { x: -x * 24, y: -y * 18, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
            if (floatRating) gsap.to(floatRating, { x: -x * 20, y: -y * 16, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
          }
        });

        heroStage.addEventListener('mouseleave', () => {
          if (typeof gsap !== 'undefined') {
            gsap.to([docImg, docGlow, floatLive, floatRating], { x: 0, y: 0, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
          }
        });
      }

      // ── Interactive 3D Cursor Tilt & Spotlight Tracking for Cards (Desktop) ──
      if (window.matchMedia('(min-width: 992px)').matches && typeof gsap !== 'undefined') {
        const interactiveCards = document.querySelectorAll('.mont-bento-card, .mont-review-card, .mont-journey-step, .mont-contact-info');
        interactiveCards.forEach(card => {
          const spotlight = card.querySelector('.mont-card-spotlight');

          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
              rotateY: x * 7,
              rotateX: -y * 7,
              scale: 1.015,
              transformPerspective: 1000,
              duration: 0.35,
              ease: 'power1.out',
              overwrite: 'auto'
            });

            if (spotlight) {
              const px = ((e.clientX - rect.left) / rect.width) * 100;
              const py = ((e.clientY - rect.top) / rect.height) * 100;
              spotlight.style.background = `radial-gradient(circle 240px at ${px}% ${py}%, rgba(27, 79, 198, 0.1), transparent 70%)`;
              spotlight.style.opacity = '1';
            }
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            if (spotlight) {
              spotlight.style.opacity = '0';
            }
          });
        });

        // ── Magnetic Attraction Physics on Reservation CTA Button ──
        const ctaBtn = document.getElementById('mont-cta-consultation');
        if (ctaBtn) {
          ctaBtn.addEventListener('mousemove', (e) => {
            const rect = ctaBtn.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            gsap.to(ctaBtn, {
              x: x * 0.28,
              y: y * 0.28,
              duration: 0.25,
              ease: 'power1.out',
              overwrite: 'auto'
            });
          });

          ctaBtn.addEventListener('mouseleave', () => {
            gsap.to(ctaBtn, {
              x: 0,
              y: 0,
              duration: 0.65,
              ease: 'elastic.out(1, 0.4)',
              overwrite: 'auto'
            });
          });
        }
      }

      // Launch GSAP animations
      requestAnimationFrame(() => Views.initLandingAnimations());
    },

    /* ------------------------------------------------------------------ */
    /* CREATIVE GSAP LANDING ANIMATIONS (HERO + ALL RICH SECTIONS)        */
    /* ------------------------------------------------------------------ */
    initLandingAnimations() {
      if (typeof gsap === 'undefined') return;

      // Register ScrollTrigger plugin
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        // Clear any previous landing scrolltriggers to prevent duplication
        ScrollTrigger.getAll().forEach(t => t.kill());
      }

      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // ── 1. Hero Entrance Timeline (Preserved Exact Signature Animation) ──
      try {
        const heroTl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            gsap.set('#mont-header, #mont-hero-left, #mont-hero-center, #mont-hero-right, #mont-navy-base', {
              clearProps: 'opacity,transform'
            });
          }
        });

        gsap.set('#mont-header', { y: -24, opacity: 0 });
        gsap.set('#mont-hero-left', { x: 30, opacity: 0 });
        gsap.set('#mont-hero-center', { y: 30, opacity: 0, scale: 0.96 });
        gsap.set('#mont-hero-right', { x: -30, opacity: 0 });
        gsap.set('#mont-navy-base', { y: 40, opacity: 0 });
        gsap.set('#mont-float-live, #mont-float-rating', { scale: 0.6, opacity: 0 });

        heroTl.to('#mont-header', { y: 0, opacity: 1, duration: 0.55 })
          .to('#mont-hero-left', { x: 0, opacity: 1, duration: 0.7 }, 0.15)
          .to('#mont-hero-center', { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }, 0.25)
          .to('#mont-hero-right', { x: 0, opacity: 1, duration: 0.7 }, 0.35)
          .to('#mont-navy-base', { y: 0, opacity: 1, duration: 0.6 }, 0.3)
          .to('#mont-float-live', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 0.5)
          .to('#mont-float-rating', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 0.65);
      } catch (err) {
        console.warn('Hero entrance animation notice:', err);
      }

      if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') return;

      // ── 2. Ambient Floating Background Medical Accents ──
      try {
        // Live Clinical Status Ticker Entrance & Floating
        const ticker = document.getElementById('mont-live-ticker');
        if (ticker) {
          gsap.fromTo(ticker,
            { opacity: 0, y: -18, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.75, delay: 0.65, ease: 'back.out(1.5)' }
          );
        }

        // Live Vital Signs HUD BPM Heartbeat Fluctuation
        const bpmEl = document.querySelector('.mont-hud-bpm');
        if (bpmEl && !window._vitalBpmInterval) {
          window._vitalBpmInterval = setInterval(() => {
            const currentBpm = document.querySelector('.mont-hud-bpm');
            if (currentBpm && Math.random() > 0.45) {
              const delta = Math.floor(Math.random() * 5) - 2;
              currentBpm.textContent = 72 + delta;
              gsap.fromTo(currentBpm, { scale: 1.15, color: '#10b981' }, { scale: 1, color: '#1b4fc6', duration: 0.45 });
            }
          }, 2400);
        }

        // Oscillating Voice Review Audio Waveform Bars
        document.querySelectorAll('.mont-review-card').forEach((card) => {
          const bars = card.querySelectorAll('.mont-wave-bar');
          bars.forEach((bar, idx) => {
            gsap.to(bar, {
              scaleY: () => 0.2 + Math.random() * 0.8,
              duration: 0.4 + idx * 0.09,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: idx * 0.08
            });
          });
        });

        // Rotating Medical Trust Seal in Reservation Card
        const seal = document.querySelector('.mont-seal-svg');
        if (seal) {
          gsap.to(seal, {
            rotation: 360,
            duration: 28,
            repeat: -1,
            ease: 'none',
            transformOrigin: '50% 50%'
          });
        }

        gsap.to('.mont-ambient-orb--1', {
          x: 35,
          y: 25,
          scale: 1.12,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.to('.mont-ambient-orb--2', {
          x: -30,
          y: -20,
          scale: 0.9,
          duration: 11,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
        gsap.to('.mont-ambient-cross', {
          rotation: 360,
          duration: 36,
          repeat: -1,
          ease: 'none'
        });
      } catch (e) { /* ignore */ }

      // ── 3. Trust Metrics Strip (Animated Counter & EKG Wave) ──
      try {
        const metricsSection = document.getElementById('section-metrics');
        if (metricsSection) {
          ScrollTrigger.create({
            trigger: metricsSection,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              // Stagger items up with elastic bounce
              gsap.fromTo('.mont-metric-item',
                { opacity: 0, y: 35, scale: 0.94 },
                { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.12, ease: 'back.out(1.4)' }
              );

              // Draw separator lines down
              gsap.fromTo('.mont-metric-sep',
                { scaleY: 0, transformOrigin: 'top center' },
                { scaleY: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
              );

              // Draw animated EKG pulse wave behind metrics
              const ekg = metricsSection.querySelector('.mont-metrics-ekg');
              if (ekg) {
                const len = ekg.getTotalLength ? ekg.getTotalLength() : 1200;
                gsap.fromTo(ekg,
                  { strokeDasharray: len, strokeDashoffset: len },
                  { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }
                );
              }

              // Dynamic count-up for numbers
              metricsSection.querySelectorAll('.mont-metric-num[data-target]').forEach(numEl => {
                const targetStr = numEl.getAttribute('data-target');
                const target = parseFloat(targetStr);
                if (isNaN(target)) return;

                const parent = numEl.closest('.mont-metric-item');
                const isDecimals = parent?.getAttribute('data-decimals');
                const counter = { val: 0 };

                gsap.to(counter, {
                  val: target,
                  duration: 1.8,
                  ease: 'power2.out',
                  onUpdate: () => {
                    if (targetStr === '0') {
                      numEl.textContent = '0 دقيقة';
                    } else if (isDecimals) {
                      numEl.textContent = '%' + counter.val.toFixed(1);
                    } else if (target >= 1000) {
                      numEl.textContent = '+' + Math.round(counter.val).toLocaleString('en-US');
                    } else {
                      numEl.textContent = '+' + Math.round(counter.val);
                    }
                  }
                });
              });
            }
          });
        }
      } catch (err) {
        console.warn('Metrics animation notice:', err);
      }

      // ── 4. About & Clinical Pillars (Bento Grid 3D Reveal) ──
      try {
        const aboutSection = document.getElementById('section-about');
        if (aboutSection) {
          ScrollTrigger.create({
            trigger: aboutSection,
            start: 'top 82%',
            once: true,
            onEnter: () => {
              // Section header reveal
              gsap.fromTo('#section-about .mont-section-header > *',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out' }
              );

              // Large Diagnostic Bento Card with 3D perspective reveal
              gsap.fromTo('#section-about .mont-bento-card--large',
                { opacity: 0, y: 55, rotateX: 7, transformPerspective: 1000 },
                { opacity: 1, y: 0, rotateX: 0, duration: 0.85, ease: 'power3.out', delay: 0.2 }
              );

              // Pill tags pop in sequentially
              gsap.fromTo('#section-about .mont-bento-card--large .mont-tag',
                { opacity: 0, scale: 0.65, y: 12 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(2)', delay: 0.45 }
              );

              // The 3 sub-cards cascade with staggered 3D wave
              gsap.fromTo('#section-about .mont-bento-card:not(.mont-bento-card--large)',
                { opacity: 0, y: 60, scale: 0.94 },
                { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.14, ease: 'power3.out', delay: 0.35 }
              );

              // Feature icons pop & rotate
              gsap.fromTo('#section-about .mont-bento-icon',
                { scale: 0, rotate: -25 },
                { scale: 1, rotate: 0, duration: 0.65, stagger: 0.1, ease: 'back.out(1.8)', delay: 0.4 }
              );
            }
          });
        }
      } catch (err) {
        console.warn('Bento animation notice:', err);
      }

      // ── 5. Patient Journey (Timeline with Animated Connected Track) ──
      try {
        const journeySection = document.getElementById('section-journey');
        if (journeySection) {
          ScrollTrigger.create({
            trigger: journeySection,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              // Header
              gsap.fromTo('#section-journey .mont-section-header > *',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out' }
              );

              // Animated SVG Pathway Track Drawing & Traveling Beacon
              const trackLine = journeySection.querySelector('.mont-track-line');
              const beacon = journeySection.querySelector('.mont-track-beacon');
              if (trackLine) {
                const pathLen = trackLine.getTotalLength ? trackLine.getTotalLength() : 800;
                gsap.fromTo(trackLine,
                  { strokeDasharray: pathLen, strokeDashoffset: pathLen },
                  { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', delay: 0.3 }
                );
                if (beacon) {
                  // RTL: beacon travels from 900 to 100
                  gsap.fromTo(beacon,
                    { attr: { cx: 900 }, opacity: 0 },
                    { attr: { cx: 100 }, opacity: 1, duration: 1.6, ease: 'power2.inOut', delay: 0.3 }
                  );
                }
              }

              // Sequential step cards entrance
              gsap.fromTo('#section-journey .mont-journey-step',
                { opacity: 0, y: 45, scale: 0.94 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.18, ease: 'back.out(1.3)', delay: 0.35 }
              );

              // Step numbers pop with energetic pulse
              gsap.fromTo('#section-journey .mont-step-number',
                { scale: 0.3, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6, stagger: 0.18, ease: 'back.out(2)', delay: 0.5 }
              );
            }
          });
        }
      } catch (err) {
        console.warn('Journey animation notice:', err);
      }

      // ── 6. Testimonials (Tactile Card Deal & Star Sparkle) ──
      try {
        const testimonialsSection = document.getElementById('section-testimonials');
        if (testimonialsSection) {
          ScrollTrigger.create({
            trigger: testimonialsSection,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              // Header
              gsap.fromTo('#section-testimonials .mont-section-header > *',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' }
              );

              // Rating badge pop
              gsap.fromTo('#section-testimonials .mont-rating-badge',
                { opacity: 0, scale: 0.85, y: 15 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
              );

              // Star items sequential sparkle
              gsap.fromTo('#section-testimonials .mont-star-item',
                { scale: 0, rotate: -40, opacity: 0 },
                { scale: 1, rotate: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(2)', delay: 0.38 }
              );

              // 3 Review Cards - tactile dealt cards effect
              const cards = gsap.utils.toArray('#section-testimonials .mont-review-card');
              if (cards.length >= 3) {
                gsap.fromTo(cards[0],
                  { opacity: 0, y: 45, rotateZ: 2.5, transformOrigin: 'bottom center' },
                  { opacity: 1, y: 0, rotateZ: 0, duration: 0.8, ease: 'power3.out', delay: 0.28 }
                );
                gsap.fromTo(cards[1],
                  { opacity: 0, y: 55, scale: 0.94 },
                  { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.42 }
                );
                gsap.fromTo(cards[2],
                  { opacity: 0, y: 45, rotateZ: -2.5, transformOrigin: 'bottom center' },
                  { opacity: 1, y: 0, rotateZ: 0, duration: 0.8, ease: 'power3.out', delay: 0.56 }
                );
              }
            }
          });
        }
      } catch (err) {
        console.warn('Testimonials animation notice:', err);
      }

      // ── 7. FAQ Accordion (Smooth Stagger Reveal) ──
      try {
        const faqSection = document.getElementById('section-faq');
        if (faqSection) {
          ScrollTrigger.create({
            trigger: faqSection,
            start: 'top 82%',
            once: true,
            onEnter: () => {
              gsap.fromTo('#section-faq .mont-section-header > *',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' }
              );
              gsap.fromTo('#section-faq .mont-faq-item',
                { opacity: 0, y: 35 },
                { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out', delay: 0.25 }
              );
            }
          });
        }
      } catch (err) {
        console.warn('FAQ animation notice:', err);
      }

      // ── 8. Split Contact & Navy Reservation Banner ──
      try {
        const contactSection = document.getElementById('section-contact');
        if (contactSection) {
          ScrollTrigger.create({
            trigger: contactSection,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              // Contact Info card slides from right
              gsap.fromTo('#section-contact .mont-contact-info',
                { opacity: 0, x: 40 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
              );

              // Info rows cascade
              gsap.fromTo('#section-contact .mont-info-row',
                { opacity: 0, x: 25 },
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.2 }
              );

              // Navy Reservation card slides from left
              gsap.fromTo('#section-contact .mont-reserve-card',
                { opacity: 0, x: -40, scale: 0.96 },
                { opacity: 1, x: 0, scale: 1, duration: 0.85, ease: 'power3.out', delay: 0.15 }
              );

              // Radar ripple rings continuous pulse loop
              gsap.to('.mont-radar-ring', {
                scale: 2.3,
                opacity: 0,
                duration: 2.4,
                stagger: 0.8,
                repeat: -1,
                ease: 'power1.out'
              });

              // Floating orbital glow inside reservation card
              gsap.to('.mont-reserve-glow', {
                x: 50,
                y: 35,
                scale: 1.25,
                duration: 6,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
              });
            }
          });
        }
      } catch (err) {
        console.warn('Contact animation notice:', err);
      }

      // ── 9. Editorial Footer Entrance ──
      try {
        const footer = document.querySelector('.mont-footer');
        if (footer) {
          ScrollTrigger.create({
            trigger: footer,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              gsap.fromTo(footer.querySelectorAll('.mont-footer-inner > div'),
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.14, ease: 'power2.out' }
              );
            }
          });
        }
      } catch (e) { /* ignore */ }

      // ── 10. Robust Fallback Watchdog ──
      // Guarantees all content is 100% visible even if tabs are switched or scrolled before load
      setTimeout(() => {
        try {
          document.querySelectorAll(
            '.mont-bento-card, .mont-journey-step, .mont-review-card, .mont-faq-item, .mont-contact-split > div, .mont-metric-item, .mont-section-header'
          ).forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
              gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.4 });
            }
          });
        } catch (e) { /* ignore */ }
      }, 1600);
    },
  });

})();
