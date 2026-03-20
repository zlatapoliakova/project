import React, { useState } from "react";
import { Camera, Droplets, Check } from "lucide-react";

function ProfileBanner({ banner, bannerBlur, onBannerChange, onBlurChange, name }) {
  const [showBlurSlider, setShowBlurSlider] = useState(false);
  const fileInputRef = React.useRef(null);

  return (
    <div className="relative rounded-2xl shadow-lg mb-10 overflow-hidden h-56 bg-slate-800 group border-4 border-white">
      {banner && (
        <img 
          src={banner} 
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300" 
          style={{ filter: `blur(${bannerBlur}px) brightness(0.7)` }}
          alt="Banner" 
        />
      )}
      
      <div className="relative p-8 flex justify-between items-center text-white h-full z-10">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {name ? `Welcome back, ${name}!` : "Welcome to your Dashboard"}
          </h2>
          <p className="text-lg opacity-90 mt-1 font-medium">Build your professional presence today.</p>
        </div>

        {!showBlurSlider && (
          <div className="flex flex-col gap-2 items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => fileInputRef.current.click()} 
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              <Camera size={16} /> Change Cover
            </button>
            <button 
              onClick={() => setShowBlurSlider(true)} 
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              <Droplets size={16} /> Adjust Blur
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

      {showBlurSlider && (
        <div className="absolute bottom-4 right-4 z-20 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 animate-in slide-in-from-bottom-2 duration-300 shadow-xl">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-white/70" />
            <input 
              type="range" 
              min="0" 
              max="20" 
              step="0.5"
              value={bannerBlur} 
              onChange={(e) => onBlurChange(e.target.value)}
              className="w-40 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
            />
            <span className="text-white text-xs font-mono w-10 text-right">{bannerBlur}px</span>
          </div>
          <button 
            onClick={() => setShowBlurSlider(false)} 
            className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition shadow-md"
          >
            <Check size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileBanner;