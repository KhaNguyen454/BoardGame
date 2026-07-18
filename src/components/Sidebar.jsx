import React from 'react';

const FACTION_COLORS = {
  'Doanh nghiệp Nhà nước': 'from-red-900 to-red-700 border-red-500 shadow-red-900/50',
  'Kinh tế Tư nhân': 'from-blue-900 to-blue-700 border-blue-500 shadow-blue-900/50',
  'Khối FDI': 'from-orange-900 to-orange-700 border-orange-500 shadow-orange-900/50',
  'Kinh tế Tập thể / HTX': 'from-emerald-900 to-emerald-700 border-emerald-500 shadow-emerald-900/50'
};

export const Sidebar = ({ G, ctx }) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden gap-2">
      <div className="text-center py-1 bg-amber-900/50 rounded-lg border border-amber-700/50">
        <h2 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 tracking-[0.2em] uppercase drop-shadow-md">
          Bảng Theo Dõi
        </h2>
      </div>
      
      {Object.keys(G.players).map(id => {
         const player = G.players[id];
         const isCurrentTurn = ctx.currentPlayer === id;
         const colorClass = FACTION_COLORS[player.faction] || 'from-gray-800 to-gray-700 border-gray-500';
         
         return (
           <div key={id} className={`p-2 flex-1 min-h-0 flex flex-col justify-between rounded-xl border-2 bg-gradient-to-br ${colorClass} transition-all duration-300 ${isCurrentTurn ? 'scale-[1.02] shadow-[0_0_20px_rgba(251,191,36,0.6)] border-amber-400 ring-2 ring-amber-300/50 animate-pulse' : 'opacity-80 hover:opacity-100'} overflow-hidden`}>
             <div className="flex flex-col mb-1 gap-1">
               <div className="flex justify-between items-start">
                 <h3 className="font-black text-white text-sm md:text-base drop-shadow-md tracking-wide leading-none truncate">{player.name || `Người chơi ${parseInt(id)+1}`}</h3>
                 <span className="text-[9px] font-black px-1.5 py-0.5 bg-black/40 text-amber-300 rounded shadow-inner border border-white/10 uppercase whitespace-nowrap">
                   Vòng {player.ring}
                 </span>
               </div>
               <p className="text-[9px] text-gray-300 font-bold uppercase tracking-wider truncate leading-none">{player.faction}</p>
             </div>
             
             {/* Progress Bars */}
             <div className="space-y-1 mb-1">
               <div>
                 <div className="flex justify-between text-[9px] font-black text-gray-300 mb-0.5 uppercase tracking-widest leading-none">
                   <span>Tư bản</span>
                   <span>{player.capitalPoints} / 20</span>
                 </div>
                 <div className="w-full bg-black/50 rounded-full h-2 shadow-inner border border-white/5 overflow-hidden">
                   <div className="bg-gradient-to-r from-yellow-500 to-amber-300 h-full rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" style={{ width: `${Math.min((player.capitalPoints/20)*100, 100)}%` }}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-[9px] font-black text-gray-300 mb-0.5 uppercase tracking-widest leading-none">
                   <span>Xã hội</span>
                   <span>{player.socialPoints} / 10</span>
                 </div>
                 <div className="w-full bg-black/50 rounded-full h-2 shadow-inner border border-white/5 overflow-hidden">
                   <div className="bg-gradient-to-r from-emerald-500 to-green-300 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" style={{ width: `${Math.min((player.socialPoints/10)*100, 100)}%` }}></div>
                 </div>
               </div>
             </div>

             {/* Tokens Badges */}
             <div className="grid grid-cols-4 gap-1 mt-auto">
               <div className="bg-black/40 py-1 px-0.5 rounded border border-white/10 flex flex-col items-center justify-center gap-0.5 backdrop-blur-sm shadow-inner" title="Vốn">
                 <span className="text-sm drop-shadow-md leading-none">💰</span>
                 <span className="font-black text-white text-xs drop-shadow-md leading-none">{player.resources.capital}</span>
               </div>
               <div className="bg-black/40 py-1 px-0.5 rounded border border-white/10 flex flex-col items-center justify-center gap-0.5 backdrop-blur-sm shadow-inner" title="Lao động">
                 <span className="text-sm drop-shadow-md leading-none">👷</span>
                 <span className="font-black text-white text-xs drop-shadow-md leading-none">{player.resources.labor}</span>
               </div>
               <div className="bg-black/40 py-1 px-0.5 rounded border border-white/10 flex flex-col items-center justify-center gap-0.5 backdrop-blur-sm shadow-inner" title="Công nghệ">
                 <span className="text-sm drop-shadow-md leading-none">💻</span>
                 <span className="font-black text-white text-xs drop-shadow-md leading-none">{player.resources.tech}</span>
               </div>
               <div className="bg-black/40 py-1 px-0.5 rounded border border-white/10 flex flex-col items-center justify-center gap-0.5 backdrop-blur-sm shadow-inner" title="Chính sách">
                 <span className="text-sm drop-shadow-md leading-none">📜</span>
                 <span className="font-black text-white text-xs drop-shadow-md leading-none">{player.resources.policy}</span>
               </div>
             </div>
           </div>
         )
      })}
    </div>
  );
};
