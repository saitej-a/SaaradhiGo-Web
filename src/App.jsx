import { useState, useEffect } from 'react'
import { translations } from './translations';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    language: 'English',
    address: '',
    vehicle: 'Auto',
    brand: '',
    model: '',
    registration: ''
  });

  const [spotsClaimed, setSpotsClaimed] = useState(() => {
    // Starting date to calculate offset deterministically.
    const startTime = new Date('2026-03-08T00:00:00Z').getTime();
    const diffMinutes = Math.max(0, Math.floor((Date.now() - startTime) / 60000));
    return 847 + Math.floor(diffMinutes / 5);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsClaimed(prev => prev + 1);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHeroMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageSelect = (langLabel) => {
    setFormData(prev => ({ ...prev, language: langLabel }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Registration Successful!");
  };

  // Convert the current language string to translation key 'en', 'te', or 'hi'
  const langCode = formData.language === 'English' ? 'en'
    : formData.language.includes('Telugu') ? 'te'
      : 'hi';

  const t = translations[langCode];

  // Helper mapping specifically for the language buttons
  const langOptions = ['English', 'తెలుగు (Telugu)', 'हिंदी (Hindi)'];

  return (
    <>
      <div className="interactive-grid-bg"></div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-black tracking-tighter uppercase cursor-default">
            Saaradhi<span className="text-primary">Go</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              {t.navLanguageOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleLanguageSelect(opt.id)}
                  className="text-xs md:text-sm font-medium hover:text-primary transition-colors border-r last:border-r-0 border-slate-300 dark:border-zinc-700 pr-2 md:pr-3 last:pr-0"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button className="bg-primary hover:bg-primary/90 text-black px-3 py-1.5 md:px-6 md:py-2 rounded-full font-bold transition-all text-xs md:text-sm shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              {t.joinNow}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 group"
        onMouseMove={handleHeroMouseMove}
      >
        <div className="hero-animate-bg">
          <div className="gold-pulse" style={{ left: '15%', animationDelay: '0s' }}></div>
          <div className="gold-pulse" style={{ left: '45%', animationDelay: '1.5s' }}></div>
          <div className="gold-pulse" style={{ left: '85%', animationDelay: '3s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/50 to-background-dark"></div>
        </div>

        {/* Soft glowing hover grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            backgroundImage: `
              radial-gradient(400px circle at ${heroMouse.x}px ${heroMouse.y}px, rgba(255, 215, 0, 0.1), transparent 40%),
              linear-gradient(rgba(255, 215, 0, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 215, 0, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: `100% 100%, 40px 40px, 40px 40px`,
            WebkitMaskImage: `radial-gradient(400px circle at ${heroMouse.x}px ${heroMouse.y}px, black, transparent)`,
            maskImage: `radial-gradient(400px circle at ${heroMouse.x}px ${heroMouse.y}px, black, transparent)`,
          }}
        />

        <div className="relative z-10 max-w-4xl text-center space-y-6 md:space-y-8 mt-20 md:mt-0">
          <div className="inline-flex items-center gap-2.5 bg-primary/10 border border-primary/30 px-5 py-2 md:px-6 md:py-3 rounded-full text-primary animate-pulse shadow-[0_0_20px_rgba(255,215,0,0.15)]">
            <span className="relative flex h-3.5 w-3.5 md:h-4 md:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 md:h-4 md:w-4 bg-primary"></span>
            </span>
            <span className="text-base md:text-lg font-black tracking-wide">{t.driverSpots.replace('847', spotsClaimed)}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
            {t.heroTitlePart1} <span className="text-primary italic drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">{t.heroTitleHighlight}</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
          <p className="text-sm md:text-base text-primary/80 font-bold italic tracking-wide mt-4 mb-6 py-2 px-6 border-y border-primary/20 bg-primary/5 inline-block mx-auto rounded-lg">
            {t.heroBadge}
          </p>
          <div className="flex flex-col items-center gap-4">
            <a href="#signup" className="w-full md:w-auto min-h-[64px] flex items-center justify-center px-10 bg-primary text-black text-xl font-black rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,215,0,0.4)]">
              {t.claimSpotText}
            </a>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{t.limitedSpots}</p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-slate-100 dark:bg-zinc-900 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative p-8 bg-white dark:bg-card-dark rounded-2xl border-l-4 border-primary shadow-sm">
            <span className="material-symbols-outlined text-primary/40 text-6xl absolute top-4 right-4">format_quote</span>
            <p className="text-lg md:text-2xl font-bold italic text-slate-800 dark:text-slate-200">
              {t.quote1}
            </p>
            <p className="mt-4 font-black text-sm uppercase tracking-widest text-primary">{t.quote1Author}</p>
          </div>
          <div className="relative p-8 bg-white dark:bg-card-dark rounded-2xl border-l-4 border-primary shadow-sm">
            <span className="material-symbols-outlined text-primary/40 text-6xl absolute top-4 right-4">format_quote</span>
            <p className="text-lg md:text-2xl font-bold italic text-slate-800 dark:text-slate-200">
              {t.quote2}
            </p>
            <p className="mt-4 font-black text-sm uppercase tracking-widest text-primary">{t.quote2Author}</p>
          </div>
        </div>
      </div>

      {/* The Offer */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-5xl font-black text-center mb-10 md:mb-16 tracking-tight">SAARADHI<span className="text-primary">{t.edgeTitleHighlight}</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-card-dark border-2 border-slate-200 dark:border-zinc-800 glow-border transition-all group">
            <span className="material-symbols-outlined text-5xl text-primary mb-6 group-hover:scale-110 transition-transform block">payments</span>
            <h3 className="text-xl md:text-2xl font-black mb-2 md:mb-4">{t.feature1Title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.feature1Desc}
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white dark:bg-card-dark border-2 border-slate-200 dark:border-zinc-800 glow-border transition-all group">
            <span className="material-symbols-outlined text-5xl text-primary mb-6 group-hover:scale-110 transition-transform block">account_balance_wallet</span>
            <h3 className="text-xl md:text-2xl font-black mb-2 md:mb-4">{t.feature2Title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.feature2Desc}
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white dark:bg-card-dark border-2 border-slate-200 dark:border-zinc-800 glow-border transition-all group">
            <span className="material-symbols-outlined text-5xl text-primary mb-6 group-hover:scale-110 transition-transform block">map</span>
            <h3 className="text-xl md:text-2xl font-black mb-2 md:mb-4">{t.feature3Title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.feature3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-primary text-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-6xl font-black mb-10 md:mb-16 tracking-tighter">{t.stepsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { num: '01', title: t.step1Title, desc: t.step1Desc },
              { num: '02', title: t.step2Title, desc: t.step2Desc },
              { num: '03', title: t.step3Title, desc: t.step3Desc }
            ].map((step) => (
              <div key={step.num} className="relative group p-8 md:p-10 rounded-[24px] hover:bg-black/5 transition-colors cursor-default">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="22" ry="22" fill="none" stroke="currentColor" strokeWidth="4"
                    pathLength="100" className="draw-border text-black" />
                </svg>
                <div className="relative z-10 space-y-2 md:space-y-4">
                  <span className="text-5xl md:text-8xl font-black opacity-30 block">{step.num}</span>
                  <h3 className="text-xl md:text-3xl font-black">{step.title}</h3>
                  <p className="font-bold text-sm md:text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-background-light dark:bg-background-dark relative z-10" id="signup">
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 md:p-12 border border-slate-200 dark:border-zinc-800 shadow-2xl relative z-20">
          <h2 className="text-2xl md:text-4xl font-black mb-6 md:mb-8">{t.formTitle}</h2>
          <form className="space-y-10" onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div className="space-y-6">
              <h3 className="text-lg md:text-xl font-bold border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-widest text-primary">{t.personalDetails}</h3>
              <div className="grid gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                  placeholder={t.fullNamePlaceholder}
                />
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full sm:flex-1 h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                    placeholder={t.mobilePlaceholder}
                  />
                  <button type="button" className="w-full sm:w-32 h-14 bg-primary/20 text-primary border border-primary/40 rounded-xl font-black hover:bg-primary/30 transition-colors text-sm">
                    {t.getOtp}
                  </button>
                </div>
                <select className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg text-slate-400 appearance-none pointer-events-none" disabled>
                  <option>{t.cityPlaceholder}</option>
                </select>
                <div className="space-y-3">
                  <p className="font-bold text-sm uppercase tracking-widest opacity-60">{t.preferredLanguage}</p>
                  <div className="flex flex-wrap gap-2">
                    {langOptions.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleLanguageSelect(lang)}
                        className={`flex-1 sm:flex-none text-center px-4 md:px-6 py-2 rounded-full border-2 font-bold text-sm md:text-base ${formData.language === lang
                          ? 'border-primary bg-primary text-black'
                          : 'border-slate-300 dark:border-zinc-700'
                          }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-sm uppercase tracking-widest opacity-60">{t.currentAddress}</p>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                    placeholder={t.addressPlaceholder}
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-6">
              <h3 className="text-lg md:text-xl font-bold border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-widest text-primary">{t.vehicleInfo}</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'Auto', icon: 'electric_rickshaw', label: t.auto },
                  { id: 'Car', icon: 'directions_car', label: t.car },
                  { id: 'Bike', icon: 'two_wheeler', label: t.bike }
                ].map((v) => (
                  <label key={v.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="vehicle"
                      className="hidden peer"
                      value={v.id}
                      checked={formData.vehicle === v.id}
                      onChange={handleChange}
                    />
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-100 dark:bg-zinc-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                      <span className="material-symbols-outlined text-4xl mb-2">{v.icon}</span>
                      <span className="font-bold">{v.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                    placeholder={t.vehicleBrandPlaceholder}
                  />
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                    placeholder={t.vehicleModelPlaceholder}
                  />
                </div>
                <input
                  type="text"
                  name="registration"
                  value={formData.registration}
                  onChange={handleChange}
                  required
                  className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary uppercase"
                  placeholder={t.registrationPlaceholder}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-bold text-xs uppercase tracking-widest opacity-60">{t.driversLicense}</p>
                  <label className="flex items-center justify-center w-full h-14 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-primary">
                    <span className="material-symbols-outlined mr-2">upload</span>
                    <span className="font-bold">{t.uploadDl}</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-xs uppercase tracking-widest opacity-60">{t.rcCopy}</p>
                  <label className="flex items-center justify-center w-full h-14 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-primary">
                    <span className="material-symbols-outlined mr-2">upload</span>
                    <span className="font-bold">{t.uploadRc}</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full h-16 bg-primary text-black text-xl font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-primary/20">
              {t.registerNow}
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-4 bg-slate-100 dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-black text-center">{t.faqTitle}</h2>
          <div className="space-y-4">
            <details className="group bg-white dark:bg-background-dark border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 open:ring-2 open:ring-primary transition-all">
              <summary className="flex items-center justify-between font-black text-lg md:text-xl cursor-pointer list-none">
                {t.faq1Question}
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">{t.faq1Answer}</p>
            </details>
            <details className="group bg-white dark:bg-background-dark border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 open:ring-2 open:ring-primary transition-all">
              <summary className="flex items-center justify-between font-black text-lg md:text-xl cursor-pointer list-none">
                {t.faq2Question}
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">{t.faq2Answer}</p>
            </details>
            <details className="group bg-white dark:bg-background-dark border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 open:ring-2 open:ring-primary transition-all">
              <summary className="flex items-center justify-between font-black text-lg md:text-xl cursor-pointer list-none">
                {t.faq3Question}
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">{t.faq3Answer}</p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-zinc-800 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
              <span className="text-2xl font-black tracking-tighter uppercase">Saaradhi<span className="text-primary">Go</span></span>
            </div>
            <p className="font-bold text-slate-600 dark:text-slate-400">{t.footerDesc}</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-primary uppercase tracking-widest text-sm">{t.footerLegal}</h4>
            <ul className="space-y-2 font-bold opacity-70">
              <li><a href="#" className="hover:text-primary transition-colors">{t.privacyPolicy}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.termsOfService}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.driverAgreement}</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-primary uppercase tracking-widest text-sm">{t.footerSupport}</h4>
            <ul className="space-y-2 font-bold opacity-70">
              <li><a href="#" className="hover:text-primary transition-colors">{t.contactUs}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.helpCenter}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.partnerWithUs}</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-primary uppercase tracking-widest text-sm">{t.footerLanguage}</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLanguageSelect('English')}
                className={`${langCode === 'en' ? 'bg-primary text-black' : 'bg-slate-200 dark:bg-zinc-800'} px-4 py-2 rounded-lg font-black text-sm transition-colors`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageSelect('తెలుగు (Telugu)')}
                className={`${langCode === 'te' ? 'bg-primary text-black' : 'bg-slate-200 dark:bg-zinc-800'} px-4 py-2 rounded-lg font-black text-sm transition-colors`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => handleLanguageSelect('हिंदी (Hindi)')}
                className={`${langCode === 'hi' ? 'bg-primary text-black' : 'bg-slate-200 dark:bg-zinc-800'} px-4 py-2 rounded-lg font-black text-sm transition-colors`}
              >
                HI
              </button>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-xl">share</span>
              </a>
              <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-xl">call</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-zinc-800 text-center text-sm font-bold opacity-50 relative z-10">
          {t.footerCopyright}
        </div>
      </footer>
    </>
  )
}

export default App
