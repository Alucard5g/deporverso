import React, { useState } from 'react';
import { Maximize2, Sparkles, Camera } from 'lucide-react';

export interface CinematicActImageProps {
  id: string;
  actNumber: '01' | '02' | '03' | '04';
  tag: string;
  meta: string;
  title: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
  accent: 'amber' | 'cyan' | 'emerald' | 'indigo';
  onExpand?: () => void;
}

export const CinematicActImage: React.FC<CinematicActImageProps> = ({
  id,
  actNumber,
  tag,
  meta,
  title,
  caption,
  imageSrc,
  imageAlt,
  accent,
  onExpand
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Subtle tone-on-tone accents harmonized with the video's cyan/cobalt palette
  const accentConfig = {
    amber: {
      tagBorder: 'border-[#00F0FF]/30',
      tagText: 'text-[#00F0FF]',
      tagBg: 'bg-[#080F24]/80',
      glow: 'from-[#0066FF]/20 to-transparent',
      hoverBorder: 'group-hover:border-[#00F0FF]/60',
      pill: 'bg-[#080F24]/80 text-[#00F0FF] border-[#00F0FF]/30',
    },
    cyan: {
      tagBorder: 'border-[#00F0FF]/30',
      tagText: 'text-[#00F0FF]',
      tagBg: 'bg-[#080F24]/80',
      glow: 'from-[#0066FF]/20 to-transparent',
      hoverBorder: 'group-hover:border-[#00F0FF]/60',
      pill: 'bg-[#080F24]/80 text-[#00F0FF] border-[#00F0FF]/30',
    },
    emerald: {
      tagBorder: 'border-[#00F0FF]/30',
      tagText: 'text-[#00F0FF]',
      tagBg: 'bg-[#080F24]/80',
      glow: 'from-[#0066FF]/20 to-transparent',
      hoverBorder: 'group-hover:border-[#00F0FF]/60',
      pill: 'bg-[#080F24]/80 text-[#00F0FF] border-[#00F0FF]/30',
    },
    indigo: {
      tagBorder: 'border-[#00F0FF]/30',
      tagText: 'text-[#00F0FF]',
      tagBg: 'bg-[#080F24]/80',
      glow: 'from-[#0066FF]/20 to-transparent',
      hoverBorder: 'group-hover:border-[#00F0FF]/60',
      pill: 'bg-[#080F24]/80 text-[#00F0FF] border-[#00F0FF]/30',
    },
  }[accent];

  return (
    <figure
      id={`figure-${id}`}
      className="relative w-full max-w-5xl mx-auto my-8 group cursor-pointer"
      onClick={onExpand}
    >
      {/* Outer elegant frame: 1px whisper border, rounded-2xl, minimalist shadows */}
      <div
        className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] ${accentConfig.hoverBorder} bg-[#06080e] transition-all duration-700 shadow-2xl`}
      >
        {/* Top Minimalist Editorial Status Bar */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-5 right-3 sm:right-5 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase backdrop-blur-md border ${accentConfig.tagBg} ${accentConfig.tagBorder} ${accentConfig.tagText}`}
            >
              {actNumber} • {tag}
            </span>
          </div>
        </div>

        {/* Cinematic Photographic Aspect View */}
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden bg-black">
          <img
            id={id}
            src={imageSrc}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-[1.03] ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Minimalist Gradient Vignette: Melts into background at edges while keeping image clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#06080e] via-[#06080e]/60 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Editorial Caption Bar (Clean, uncluttered, readable) */}
        <div className="relative z-10 px-4 sm:px-6 py-4 bg-[#06080e] border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="space-y-0.5">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h4>
            <p className="text-xs text-white/60 font-light leading-relaxed max-w-3xl">
              {caption}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
};
