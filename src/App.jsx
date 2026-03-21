import { useState, useEffect } from 'react';
import { translations } from './translations';
import { api } from './services/api';
import logo from './assets/icon/saaradhigo.jpeg';


function App() {
  const [step, setStep] = useState('OTP'); // 'OTP', 'VERIFY', 'PROFILE', 'VEHICLE', 'SUCCESS'
  console.log("App component rendered with step:", step);
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    otp: '',
    language: 'English',
    house_no: '',
    street: '',
    city: 'Hyderabad',
    zip_code: '',
    emergency_contact: '',
    avatar: null,
    // Driver & Vehicle
    active_vehicle: null,
    license_expiry: '',
    license_doc: null,
    vehicle_number: '',
    vehicle_type: 'sedan',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 4,
    rc_doc: null,
    vehicle_pic: null
  });

  const [spotsClaimed, setSpotsClaimed] = useState(() => {
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
    setHeroMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLanguageSelect = (langLabel) => {
    setFormData(prev => ({ ...prev, language: langLabel }));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!formData.phone_number) return;
    setIsLoading(true);
    setSubmitMessage(null);
    try {
      const formattedPhone = formData.phone_number.startsWith('+91')
        ? formData.phone_number
        : `+91${formData.phone_number}`;

      const res = await api.requestOTP(formattedPhone, 'driver');
      console.log("OTP response:", res);
      if (res.status === 'success') {
        setStep('VERIFY');
        setSubmitMessage({ type: 'success', text: 'OTP sent successfully!' });
      } else {
        throw new Error(res.message || 'Failed to send OTP');
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage(null);
    try {
      const formattedPhone = formData.phone_number.startsWith('+91')
        ? formData.phone_number
        : `+91${formData.phone_number}`;
      const res = await api.login(formattedPhone, formData.otp);
      if (res.status === 'success') {
        setToken(res.data.token);
        localStorage.setItem('driver_token', res.data.token);
        setStep('PROFILE');
      } else {
        throw new Error(res.message || 'Invalid OTP');
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage(null);
    try {
      const profileData = {
        full_name: formData.full_name,
        email: formData.email,
        house_no: formData.house_no,
        street: formData.street,
        city: formData.city,
        zip_code: formData.zip_code,
        emergency_contact: formData.emergency_contact,
        avatar: formData.avatar
      };
      const res = await api.updateProfile(token, profileData);
      if (res.status === 'success') {
        setStep('VEHICLE');
      } else {
        throw new Error(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage(null);
    try {
      // 1. Update Driver details (License)
      const driverRes = await api.updateDriver(token, {
        license_expiry: formData.license_expiry,
        license_doc: formData.license_doc
      });
      if (driverRes.status !== 'success') throw new Error('Failed to upload license details');

      // 2. Add Vehicle
      const vehicleRes = await api.addVehicle(token, {
        vehicle_number: formData.vehicle_number,
        vehicle_type: formData.vehicle_type,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        capacity: formData.capacity,
        rc_doc: formData.rc_doc,
        vehicle_pic: formData.vehicle_pic
      });
      if (vehicleRes.status !== 'success') throw new Error('Failed to register vehicle');

      setStep('SUCCESS');
      setSubmitMessage({ type: 'success', text: 'Registration complete! Welcome to SaaradhiGo.' });
    } catch (err) {
      setSubmitMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex items-center gap-2 cursor-default group">
            <img src={logo} alt="SaaradhiGo Logo" className="w-10 h-10 rounded-xl shadow-lg border border-primary/20 group-hover:scale-110 transition-transform" />
            <div className="text-xl md:text-2xl font-black tracking-tighter uppercase">
              Saaradhi<span className="text-primary">Go</span>
            </div>
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
            <a href="#signup" className="liquid-glass-gold w-full md:w-auto min-h-[64px] flex items-center justify-center px-10 text-white text-xl font-black rounded-full">
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
          <form className="space-y-10" onSubmit={
            step === 'OTP' ? handleRequestOTP :
              step === 'VERIFY' ? handleVerifyOTP :
                step === 'PROFILE' ? handleUpdateProfile :
                  handleFinalSubmit
          }>
            {/* Step 1: OTP Request */}
            {step === 'OTP' && (
              <div className="space-y-6">
                <h3 className="text-lg md:text-xl font-bold border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-widest text-primary">{t.personalDetails}</h3>
                <div className="grid gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                      placeholder={t.mobilePlaceholder}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'VERIFY' && (
              <div className="space-y-6">
                <h3 className="text-lg md:text-xl font-bold border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-widest text-primary">{t.verifyOtp}</h3>
                <div className="grid gap-4">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary text-center tracking-[1em]"
                    placeholder="------"
                  />
                  <p className="text-sm text-center opacity-70">{t.otpPlaceholder}</p>
                </div>
              </div>
            )}

            {/* Step 3: Profile Details */}
            {step === 'PROFILE' && (
              <div className="space-y-6">
                <h3 className="text-lg md:text-xl font-bold border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-widest text-primary">{t.personalDetails}</h3>
                <div className="grid gap-4">
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                    placeholder={t.fullNamePlaceholder}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                    placeholder="Email Address"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="house_no"
                      value={formData.house_no}
                      onChange={handleChange}
                      className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                      placeholder="House No."
                    />
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                      className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                      placeholder="Zip Code"
                    />
                  </div>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                    placeholder="Street / Locality"
                  />
                  <div className="space-y-2">
                    <p className="font-bold text-xs uppercase tracking-widest opacity-60">{t.uploadAvatar}</p>
                    <label className="flex items-center justify-center w-full h-14 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-primary">
                      <span className="material-symbols-outlined mr-2">photo_camera</span>
                      <span className="font-bold">{formData.avatar ? formData.avatar.name : t.uploadAvatar}</span>
                      <input type="file" name="avatar" className="hidden" onChange={handleChange} accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Vehicle Information */}
            {step === 'VEHICLE' && (
              <div className="space-y-6">
                <h3 className="text-lg md:text-xl font-bold border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-widest text-primary">{t.vehicleInfo}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'sedan', icon: 'directions_car', label: t.car },
                    { id: 'auto', icon: 'electric_rickshaw', label: t.auto },
                    { id: 'bike', icon: 'two_wheeler', label: t.bike }
                  ].map((v) => (
                    <label key={v.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="vehicle_type"
                        className="hidden peer"
                        value={v.id}
                        checked={formData.vehicle_type === v.id}
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
                      required
                      className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                      placeholder={t.vehicleBrandPlaceholder}
                    />
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                      placeholder={t.vehicleModelPlaceholder}
                    />
                  </div>
                  <input
                    type="text"
                    name="vehicle_number"
                    value={formData.vehicle_number}
                    onChange={handleChange}
                    required
                    className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary uppercase"
                    placeholder={t.registrationPlaceholder}
                  />
                  <div className="space-y-2">
                    <p className="font-bold text-xs uppercase tracking-widest opacity-60">License Expiry Date</p>
                    <input
                      type="date"
                      name="license_expiry"
                      value={formData.license_expiry}
                      onChange={handleChange}
                      required
                      className="w-full h-14 bg-slate-100 dark:bg-zinc-800 border-none rounded-xl px-6 font-bold text-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-bold text-xs uppercase tracking-widest opacity-60">{t.driversLicense}</p>
                    <label className="flex items-center justify-center w-full h-14 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-primary">
                      <span className="material-symbols-outlined mr-2">upload</span>
                      <span className="font-bold">{formData.license_doc ? formData.license_doc.name : t.uploadDl}</span>
                      <input type="file" name="license_doc" className="hidden" onChange={handleChange} />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-xs uppercase tracking-widest opacity-60">{t.rcCopy}</p>
                    <label className="flex items-center justify-center w-full h-14 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-primary">
                      <span className="material-symbols-outlined mr-2">upload</span>
                      <span className="font-bold">{formData.rc_doc ? formData.rc_doc.name : t.uploadRc}</span>
                      <input type="file" name="rc_doc" className="hidden" onChange={handleChange} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {submitMessage && (
              <div className={`p-4 rounded-xl font-bold flex items-start gap-3 ${submitMessage.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800/50'
                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800/50'
                }`}>
                <span className="material-symbols-outlined mt-0.5">
                  {submitMessage.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <span>{submitMessage.text}</span>
              </div>
            )}

            {step !== 'SUCCESS' && (
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-16 text-black text-xl font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-3
                  ${isLoading
                    ? 'bg-primary/50 cursor-not-allowed'
                    : 'bg-primary hover:scale-[1.02] active:scale-95 hover:shadow-primary/20'
                  }`}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    <span>Processing...</span>
                  </>
                ) : (
                  step === 'OTP' ? t.getOtp :
                    step === 'VERIFY' ? t.verifyOtp :
                      step === 'PROFILE' ? t.nextStep :
                        t.registerNow
                )}
              </button>
            )}
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
            <div className="flex items-center gap-3">
              <img src={logo} alt="SaaradhiGo Logo" className="w-10 h-10 rounded-xl" />
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
