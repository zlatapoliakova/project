import React, { useState } from "react";
import { Camera, Droplets, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 

function ProfileBanner({ 
  banner, 
  bannerBlur, 
  onBannerChange, 
  onBlurChange, 
  name, 
  readOnly = false, 
  onBlurSave 
}) {
  const { t } = useAuth(); 
  const [showBlurSlider, setShowBlurSlider] = useState(false);
  const fileInputRef = React.useRef(null);

  const bannerUrl = banner 
    ? (banner.startsWith('http') || banner.startsWith('data:') 
        ? banner 
        : `http://localhost:5000${banner}`)
    : null;

  if (!t) return null;

  return (
    <div className="relative rounded-[2rem] sm:rounded-[2.5rem] shadow-xl mb-6 sm:mb-10 overflow-hidden min-h-[240px] sm:h-64 bg-slate-900 group border-4 border-white">
      {bannerUrl ? (
        <img 
          src={bannerUrl} 
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700" 
          style={{ 
            filter: `blur(${bannerBlur}px) brightness(0.65)`,
            transform: showBlurSlider ? 'scale(1.05)' : 'scale(1)'
          }}
          alt="Profile Banner" 
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900" />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-0" />

      <div className="relative p-5 sm:p-8 lg:p-10 flex flex-col justify-end items-start gap-5 sm:flex-row sm:justify-between sm:items-center text-white h-full z-10">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-md leading-tight">
            {readOnly 
              ? `${name || t.search.defaultProfession}${t.profile.banner.portfolioOf}` 
              : (name ? `${t.profile.banner.welcomeBack} ${name}!` : t.profile.banner.welcome)}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg opacity-80 mt-2 font-bold tracking-wide max-w-2xl">
            {readOnly 
              ? t.profile.banner.explore 
              : t.profile.banner.ready}
          </p>
        </div>

        {!readOnly && !showBlurSlider && (
          <div className="flex w-full sm:w-auto flex-col sm:flex-row lg:flex-col gap-3 sm:items-center lg:items-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-x-0 sm:translate-x-4 sm:group-hover:translate-x-0">
            <button 
              onClick={() => fileInputRef.current.click()} 
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 sm:px-5 py-2.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border border-white/20 shadow-lg w-full sm:w-auto"
            >
              <Camera size={16} /> {t.profile.banner.changeCover}
            </button>
            <button 
              onClick={() => setShowBlurSlider(true)} 
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 sm:px-5 py-2.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border border-white/20 shadow-lg w-full sm:w-auto"
            >
              <Droplets size={16} /> {t.profile.banner.focusBlur}
            </button>
          </div>
        )}
        
        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={onBannerChange} 
        />
      </div>

      {!readOnly && showBlurSlider && (
        <div className="absolute left-4 right-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 z-20 bg-white/10 backdrop-blur-xl p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border border-white/30 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 animate-in slide-in-from-right-4 duration-300 shadow-2xl">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2 bg-white/20 rounded-xl">
              <Droplets size={20} className="text-white" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-tighter text-white/60">
                {t.profile.banner.surfaceBlur}
              </span>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="0.5"
                value={bannerBlur} 
                onChange={(e) => onBlurChange(e.target.value)}
                className="w-full sm:w-48 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
              />
            </div>
            <span className="text-white text-sm font-black min-w-[40px] text-center shrink-0">{bannerBlur}px</span>
          </div>
          <button 
            onClick={() => {
              setShowBlurSlider(false);
              if (onBlurSave) onBlurSave();
            }} 
            className="p-3 bg-white text-indigo-600 rounded-2xl hover:scale-110 transition-transform shadow-xl self-end sm:self-auto"
          >
            <Check size={20} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileBanner;
