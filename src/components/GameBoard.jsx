import React from 'react';

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const RINGS = [
  { level: 3, r: 350, id: 'ring3', fill: "url(#grad3)", stroke: "#c084fc", text: "VÒNG 3: TOÀN CẦU (Rủi ro cực cao - Lợi nhuận khổng lồ)" },
  { level: 2, r: 240, id: 'ring2', fill: "url(#grad2)", stroke: "#60a5fa", text: "VÒNG 2: ASEAN (Cạnh tranh trung bình)" },
  { level: 1, r: 130, id: 'ring1', fill: "url(#grad1)", stroke: "#4ade80", text: "VÒNG 1: NỘI ĐỊA (An toàn - Lợi nhuận thấp)" }
];

const FACTION_COLORS = {
  'Doanh nghiệp Nhà nước': '#ef4444',
  'Kinh tế Tư nhân': '#3b82f6',
  'Khối FDI': '#f97316',
  'Kinh tế Tập thể / HTX': '#10b981'
};

export const GameBoard = ({ G }) => {
  const center = 400;

  return (
    <div className="w-full max-w-[850px] aspect-square rounded-full shadow-[0_0_80px_rgba(0,0,0,0.8)] border-8 border-slate-800 bg-slate-950 relative overflow-hidden ring-4 ring-slate-900/50">
      <svg viewBox="0 0 800 800" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="grad3" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#2e1065" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#4c1d95" stopOpacity="1"/>
          </radialGradient>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#1e3a8a" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1"/>
          </radialGradient>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stopColor="#14532d" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#15803d" stopOpacity="1"/>
          </radialGradient>
          
          {RINGS.map(ring => (
             <path 
               key={`path-${ring.id}`} 
               id={`text-path-${ring.id}`} 
               d={`M ${center}, ${center} m 0, -${ring.r - 20} a ${ring.r - 20},${ring.r - 20} 0 1,1 0,${(ring.r - 20)*2} a ${ring.r - 20},${ring.r - 20} 0 1,1 0,-${(ring.r - 20)*2}`}
             />
          ))}
        </defs>

        {/* Vẽ MAP (3 Vòng) */}
        {RINGS.map((ring) => (
          <g key={ring.level}>
            <circle 
              cx={center} 
              cy={center} 
              r={ring.r} 
              fill={ring.fill}
              stroke={ring.stroke}
              strokeWidth="3"
              className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-1000"
            />
            {/* Vòng sáng phát quang viền */}
            <circle cx={center} cy={center} r={ring.r} fill="none" stroke={ring.stroke} strokeWidth="6" opacity="0.3" filter="blur(4px)" />
            
            <text className="text-base font-black uppercase tracking-[0.2em] fill-white opacity-60" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,1))' }}>
              <textPath href={`#text-path-${ring.id}`} startOffset="50%" textAnchor="middle">
                {ring.text}
              </textPath>
            </text>
          </g>
        ))}

        {/* START POINT */}
        <circle cx={center} cy={center} r="50" fill="#020617" stroke="#fbbf24" strokeWidth="6" className="shadow-[inset_0_0_20px_rgba(0,0,0,1)]" />
        <circle cx={center} cy={center} r="50" fill="none" stroke="#fbbf24" strokeWidth="10" opacity="0.3" filter="blur(5px)" />
        <text x={center} y={center + 6} textAnchor="middle" fill="#fbbf24" className="text-xl font-black tracking-widest drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" style={{ fontFamily: 'sans-serif' }}>
          START
        </text>

        {/* QUÂN CỜ ĐẠI DIỆN 3D */}
        {G && G.players && Object.keys(G.players).map(playerId => {
          const player = G.players[playerId];
          const ringLevel = player.ring || 1; 
          
          const ringConfig = RINGS.find(r => r.level === ringLevel) || RINGS[2];
          
          const baseAngle = parseInt(playerId) * 90;
          const coords = polarToCartesian(center, center, ringConfig.r - 60, baseAngle + 45); 
          const color = FACTION_COLORS[player.faction] || '#fff';

          return (
            <g key={playerId} className="transition-all duration-1000 ease-in-out">
              {/* Bóng quân cờ (Shadow) */}
              <ellipse cx={coords.x + 10} cy={coords.y + 20} rx="18" ry="8" fill="rgba(0,0,0,0.8)" filter="blur(4px)"/>
              
              {/* Đế quân cờ 3D */}
              <circle cx={coords.x} cy={coords.y + 8} r="24" fill="#1f2937" stroke="#0f172a" strokeWidth="2"/>
              <path d={`M ${coords.x - 24} ${coords.y + 8} A 24 24 0 0 0 ${coords.x + 24} ${coords.y + 8} L ${coords.x + 24} ${coords.y - 2} A 24 24 0 0 1 ${coords.x - 24} ${coords.y - 2} Z`} fill="#334155" />
              
              {/* Bề mặt quân cờ */}
              <circle cx={coords.x} cy={coords.y - 2} r="24" fill={color} stroke="#fff" strokeWidth="2" className="drop-shadow-lg"/>
              
              {/* Hiệu ứng kính bóng (Highlight) */}
              <ellipse cx={coords.x} cy={coords.y - 12} rx="12" ry="6" fill="rgba(255,255,255,0.4)" filter="blur(1px)"/>
              
              {/* Chữ */}
              <text 
                x={coords.x} 
                y={coords.y + 3} 
                textAnchor="middle" 
                fill="#fff"
                className="text-lg font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: 'sans-serif' }}
              >
                P{parseInt(playerId) + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
