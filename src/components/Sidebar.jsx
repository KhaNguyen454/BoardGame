import React from 'react';

const FACTION_COLORS = {
  'Doanh nghiệp Nhà nước': 'from-red-900 to-red-700 border-red-500 shadow-red-900/50',
  'Kinh tế Tư nhân': 'from-blue-900 to-blue-700 border-blue-500 shadow-blue-900/50',
  'Khối FDI': 'from-orange-900 to-orange-700 border-orange-500 shadow-orange-900/50',
  'Kinh tế Tập thể / HTX': 'from-emerald-900 to-emerald-700 border-emerald-500 shadow-emerald-900/50'
};

export const Sidebar = ({ G, ctx }) => {
  return (
    <div className="h-full bg-slate-900/80 backdrop-blur-xl border-r border-slate-700 shadow-2xl flex flex-col overflow-y-auto p-4 gap-4">
      <div className="text-center py-2">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 tracking-widest uppercase drop-shadow-lg">
          Bảng Theo Dõi
        </h2>
      </div>
      
      {Object.keys(G.players).map(id => {
         const player = G.players[id];
         const isCurrentTurn = ctx.currentPlayer === id;
         const colorClass = FACTION_COLORS[player.faction] || 'from-gray-800 to-gray-700 border-gray-500';
         
         return (
           <div key={id} className={`p-4 rounded-2xl border-2 bg-gradient-to-br ${colorClass} transition-all duration-300 ${isCurrentTurn ? 'scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)] ring-2 ring-white/50' : 'opacity-80 hover:opacity-100'}`}>
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-black text-white text-lg drop-shadow-md tracking-wide">P{parseInt(id)+1}: {player.faction}</h3>
               <span className="text-xs font-black px-3 py-1 bg-black/40 text-amber-300 rounded-lg shadow-inner border border-white/10 uppercase tracking-widest">
                 Vòng {player.ring}
               </span>
             </div>
             
             {/* Progress Bars */}
             <div className="space-y-3 mb-4">
               <div>
                 <div className="flex justify-between text-[10px] font-black text-gray-300 mb-1 uppercase tracking-widest">
                   <span>Tư bản</span>
                   <span>{player.capitalPoints} / 20</span>
                 </div>
                 <div className="w-full bg-black/50 rounded-full h-2.5 shadow-inner border border-white/5 overflow-hidden">
                   <div className="bg-gradient-to-r from-yellow-500 to-amber-300 h-2.5 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" style={{ width: `${Math.min((player.capitalPoints/20)*100, 100)}%` }}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-[10px] font-black text-gray-300 mb-1 uppercase tracking-widest">
                   <span>Xã hội</span>
                   <span>{player.socialPoints} / 10</span>
                 </div>
                 <div className="w-full bg-black/50 rounded-full h-2.5 shadow-inner border border-white/5 overflow-hidden">
                   <div className="bg-gradient-to-r from-emerald-500 to-green-300 h-2.5 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" style={{ width: `${Math.min((player.socialPoints/10)*100, 100)}%` }}></div>
                 </div>
               </div>
             </div>

             {/* Tokens Badges */}
             <div className="grid grid-cols-4 gap-2">
               <div className="bg-black/40 p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1 backdrop-blur-sm" title="Vốn">
                 <span className="text-sm">💰</span><span className="font-black text-white text-sm">{player.resources.capital}</span>
               </div>
               <div className="bg-black/40 p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1 backdrop-blur-sm" title="Lao động">
                 <span className="text-sm">👷</span><span className="font-black text-white text-sm">{player.resources.labor}</span>
               </div>
               <div className="bg-black/40 p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1 backdrop-blur-sm" title="Công nghệ">
                 <span className="text-sm">💻</span><span className="font-black text-white text-sm">{player.resources.tech}</span>
               </div>
               <div className="bg-black/40 p-2 rounded-xl border border-white/10 flex items-center justify-center gap-1 backdrop-blur-sm" title="Chính sách">
                 <span className="text-sm">📜</span><span className="font-black text-white text-sm">{player.resources.policy}</span>
               </div>
             </div>
           </div>
         )
      })}
    </div>
  );
};
