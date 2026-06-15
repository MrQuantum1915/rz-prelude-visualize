import React from 'react';
import { PALETTES } from '../utils/colors';

interface HeatmapLegendProps {
  palette: string;
  isDark: boolean;
}

export default function HeatmapLegend({ palette, isDark }: HeatmapLegendProps) {
  const colorStops = PALETTES[palette] || PALETTES.rocket;
  
  // Build a CSS linear-gradient string. to top means 0% is bottom, 100% is top
  const gradientString = colorStops
    .map(stop => `rgb(${stop.color[0]}, ${stop.color[1]}, ${stop.color[2]}) ${stop.offset * 100}%`)
    .join(', ');

  return (
    <div className={`absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-row h-64 border shadow-xl ${isDark ? 'border-zinc-800 bg-zinc-900/90' : 'border-zinc-200 bg-white/90'} p-3 backdrop-blur-sm pointer-events-none`}>
      <div 
        className="w-4 h-full border border-zinc-500/50"
        style={{
          background: `linear-gradient(to top, ${gradientString})`
        }}
      />
      <div className={`flex flex-col justify-between ml-3 font-mono text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
        <div>MAX</div>
        <div 
          className="uppercase tracking-widest text-xs opacity-50 flex-1 flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Relative Traffic
        </div>
        <div>MIN</div>
      </div>
    </div>
  );
}
