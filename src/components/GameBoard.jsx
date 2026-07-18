import React from 'react';

const RINGS = [
  { level: 3, w: 900, h: 640, stroke: "#c084fc", text: "VÒNG 3: TOÀN CẦU", subtext: "Rủi ro cực cao - Lợi nhuận khổng lồ" },
  { level: 2, w: 660, h: 420, stroke: "#60a5fa", text: "VÒNG 2: ASEAN", subtext: "Cạnh tranh trung bình" },
  { level: 1, w: 420, h: 200, stroke: "#4ade80", text: "VÒNG 1: NỘI ĐỊA", subtext: "An toàn - Lợi nhuận thấp" }
];

const FACTION_COLORS = {
  'Doanh nghiệp Nhà nước': '#ef4444',
  'Kinh tế Tư nhân': '#3b82f6',
  'Khối FDI': '#f97316',
  'Kinh tế Tập thể / HTX': '#10b981'
};

export const GameBoard = ({ G, ctx }) => {
  const center = { x: 500, y: 350 };

  return (
    <div className="w-full h-full max-h-[70vh] lg:max-h-[75vh] mx-auto rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(0,0,0,0.8)] border-[16px] border-amber-900/80 bg-slate-900 relative flex items-center justify-center overflow-hidden ring-4 ring-amber-700/50 bg-[url('/board_map.png')] bg-cover bg-center">
      <svg viewBox="0 0 1000 700" width="100%" height="100%" className="drop-shadow-2xl">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b0764" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#581c87" stopOpacity="0.3"/>
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#172554" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.3"/>
          </linearGradient>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#052e16" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#14532d" stopOpacity="0.3"/>
          </linearGradient>
        </defs>

        {/* Vẽ MAP (3 Vòng) */}
        {RINGS.map((ring) => {
          const rx = center.x - ring.w / 2;
          const ry = center.y - ring.h / 2;
          
          return (
            <g key={ring.level}>
              <rect 
                x={rx} 
                y={ry} 
                width={ring.w} 
                height={ring.h}
                rx="40"
                fill={`url(#grad${ring.level})`}
                stroke={ring.stroke}
                strokeWidth="4"
                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-1000"
              />
              {/* Vòng sáng phát quang viền */}
              <rect x={rx} y={ry} width={ring.w} height={ring.h} rx="40" fill="none" stroke={ring.stroke} strokeWidth="8" opacity="0.3" filter="blur(4px)" />
              
              {/* Chữ nửa trên (Text chính) */}
              <text x={center.x} y={ry + 35} textAnchor="middle" className="text-xl font-black uppercase tracking-[0.2em] fill-white opacity-80" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,1))' }}>
                {ring.text}
              </text>

              {/* Chữ nửa dưới (Subtext) */}
              <text x={center.x} y={ry + ring.h - 15} textAnchor="middle" className="text-sm font-bold uppercase tracking-[0.1em] fill-white opacity-60" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,1))' }}>
                {ring.subtext}
              </text>
            </g>
          );
        })}

        {/* START POINT */}
        <circle cx={center.x} cy={center.y} r="50" fill="#020617" stroke="#fbbf24" strokeWidth="6" className="shadow-[inset_0_0_20px_rgba(0,0,0,1)]" />
        <circle cx={center.x} cy={center.y} r="50" fill="none" stroke="#fbbf24" strokeWidth="10" opacity="0.3" filter="blur(5px)" />
        <text x={center.x} y={center.y + 6} textAnchor="middle" fill="#fbbf24" className="text-xl font-black tracking-widest drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" style={{ fontFamily: 'sans-serif' }}>
          START
        </text>

        {/* QUÂN CỜ ĐẠI DIỆN 3D */}
        {G && G.players && Object.keys(G.players).map(playerId => {
          const player = G.players[playerId];
          const ringLevel = player.ring || 1; 
          
          const ringConfig = RINGS.find(r => r.level === ringLevel) || RINGS[2];
          const color = FACTION_COLORS[player.faction] || '#fff';
          
          const rx = center.x - ringConfig.w / 2;
          const ry = center.y - ringConfig.h / 2;
          
          // Tính góc đặt: Góc 1: trên trái, góc 2: trên phải, góc 3: dưới trái, góc 4: dưới phải
          let px, py;
          const offset = 60; // Khoảng cách từ viền góc vào trong
          switch(parseInt(playerId)) {
            case 0: // Top-Left
              px = rx + offset; py = ry + offset; break;
            case 1: // Top-Right
              px = rx + ringConfig.w - offset; py = ry + offset; break;
            case 2: // Bottom-Left
              px = rx + offset; py = ry + ringConfig.h - offset; break;
            case 3: // Bottom-Right
              px = rx + ringConfig.w - offset; py = ry + ringConfig.h - offset; break;
            default:
              px = center.x; py = center.y;
          }

          return (
            <g key={playerId} className="transition-all duration-1000 ease-in-out">
              {/* Bóng quân cờ (Shadow) */}
              <ellipse cx={px + 10} cy={py + 20} rx="18" ry="8" fill="rgba(0,0,0,0.8)" filter="blur(4px)"/>
              
              {/* Đế quân cờ 3D */}
              <circle cx={px} cy={py + 8} r="24" fill="#1f2937" stroke="#0f172a" strokeWidth="2"/>
              <path d={`M ${px - 24} ${py + 8} A 24 24 0 0 0 ${px + 24} ${py + 8} L ${px + 24} ${py - 2} A 24 24 0 0 1 ${px - 24} ${py - 2} Z`} fill="#334155" />
              
              {/* Bề mặt quân cờ */}
              <circle cx={px} cy={py - 2} r="24" fill={color} stroke="#fff" strokeWidth="2" className="drop-shadow-lg"/>
              
              {/* Hiệu ứng Active Player (Glow) */}
              {ctx && ctx.currentPlayer === playerId && (
                <>
                  <circle cx={px} cy={py - 2} r="32" fill="none" stroke="#fbbf24" strokeWidth="4" className="animate-pulse" filter="blur(2px)"/>
                  <circle cx={px} cy={py - 2} r="28" fill="none" stroke="#fcd34d" strokeWidth="2" className="animate-pulse"/>
                </>
              )}
              
              {/* Hiệu ứng kính bóng (Highlight) */}
              <ellipse cx={px} cy={py - 12} rx="12" ry="6" fill="rgba(255,255,255,0.4)" filter="blur(1px)"/>
              
              {/* Chữ */}
              <text 
                x={px} 
                y={py + 3} 
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
