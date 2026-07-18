import React from 'react';

const FACTION_STYLES = {
  'Doanh nghiệp Nhà nước': {
    bg: 'from-slate-900 to-red-950/40',
    border: 'border-red-500/30',
    accent: 'text-red-300'
  },
  'Kinh tế Tư nhân': {
    bg: 'from-slate-900 to-blue-950/40',
    border: 'border-blue-500/30',
    accent: 'text-blue-300'
  },
  'Khối FDI': {
    bg: 'from-slate-900 to-amber-950/40',
    border: 'border-amber-500/30',
    accent: 'text-amber-300'
  },
  'Kinh tế Tập thể / HTX': {
    bg: 'from-slate-900 to-emerald-950/40',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-300'
  }
};

export const Sidebar = ({ G, ctx }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-hidden bg-slate-950/50 p-1">
      <div className="text-center py-2 bg-slate-900/80 rounded-xl border border-slate-700 shadow-md shrink-0">
        <h2 className="text-xs md:text-sm font-bold text-slate-200 tracking-widest uppercase font-sans">
          Bảng Người Chơi
        </h2>
      </div>
      
      {Object.keys(G.players).map(id => {
         const player = G.players[id];
         const isCurrentTurn = ctx.currentPlayer === id;
         const style = FACTION_STYLES[player.faction] || FACTION_STYLES['Kinh tế Tư nhân'];
         
         return (
           <div key={id} className={`flex-1 min-h-0 flex flex-col justify-between rounded-xl border bg-gradient-to-br ${style.bg} ${style.border} transition-all duration-300 ${isCurrentTurn ? 'scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] border-white/40 ring-1 ring-white/20 z-10' : 'opacity-80 hover:opacity-100'} relative overflow-hidden backdrop-blur-md`}>
             {/* Glass shine effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>

             <div className="p-1.5 pb-2 flex flex-col h-full justify-between gap-0.5 relative z-10">
               {/* Header Info */}
               <div className="flex flex-col shrink-0">
                 <div className="flex justify-between items-start">
                   <div className="overflow-hidden">
                     <h3 className="font-semibold text-white text-[11px] md:text-xs truncate">{player.name || `Người chơi ${parseInt(id)+1}`}</h3>
                     <p className={`text-[7px] md:text-[8px] font-medium uppercase tracking-wider truncate mt-0.5 ${style.accent}`}>{player.faction}</p>
                   </div>
                   <span className="text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 bg-slate-800/80 text-slate-200 rounded-full border border-slate-600 uppercase shadow-sm whitespace-nowrap ml-1">
                     Vòng {player.ring}
                   </span>
                 </div>
               </div>
               
               {/* Points Stats */}
               <div className="flex flex-col gap-1 shrink-0 my-auto">
                 <div className="flex justify-between items-center bg-black/30 px-2 py-1 rounded-md border border-white/5">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tư bản</span>
                   <span className="text-[11px] font-black text-amber-400">{player.capitalPoints} / 20</span>
                 </div>
                 <div className="flex justify-between items-center bg-black/30 px-2 py-1 rounded-md border border-white/5">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Xã hội</span>
                   <span className="text-[11px] font-black text-emerald-400">{player.socialPoints} / 10</span>
                 </div>
               </div>

               {/* Tokens Badges */}
               <div className="grid grid-cols-4 gap-1 shrink-0 mt-0.5">
                 <div className="bg-black/40 rounded flex flex-col items-center justify-center py-0.5 border border-white/10 shadow-inner" title="Vốn">
                   <span className="text-xs">💰</span>
                   <span className="font-black text-white text-[10px] mt-0.5 leading-none">{player.resources.capital}</span>
                 </div>
                 <div className="bg-black/40 rounded flex flex-col items-center justify-center py-0.5 border border-white/10 shadow-inner" title="Lao động">
                   <span className="text-xs">👷</span>
                   <span className="font-black text-white text-[10px] mt-0.5 leading-none">{player.resources.labor}</span>
                 </div>
                 <div className="bg-black/40 rounded flex flex-col items-center justify-center py-0.5 border border-white/10 shadow-inner" title="Công nghệ">
                   <span className="text-xs">💻</span>
                   <span className="font-black text-white text-[10px] mt-0.5 leading-none">{player.resources.tech}</span>
                 </div>
                 <div className="bg-black/40 rounded flex flex-col items-center justify-center py-0.5 border border-white/10 shadow-inner" title="Chính sách">
                   <span className="text-xs">📜</span>
                   <span className="font-black text-white text-[10px] mt-0.5 leading-none">{player.resources.policy}</span>
                 </div>
               </div>
             </div>
           </div>
         )
      })}
    </div>
  );
};
