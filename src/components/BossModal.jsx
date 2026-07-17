import React, { useState } from 'react';

export const BossModal = ({ G, ctx, moves, playerID, isActive }) => {
  const isBossBattle = ctx.activePlayers && Object.values(ctx.activePlayers).includes('bossBattle');
  const myPlayerId = playerID || "0";
  const p = G.players[myPlayerId];
  const [bossContrib, setBossContrib] = useState({ policy: 0, capital: 0, labor: 0, tech: 0 });

  if (!isBossBattle) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
       <div className="bg-slate-900 w-full max-w-4xl rounded-2xl shadow-[0_0_100px_rgba(147,51,234,0.4)] overflow-hidden border border-purple-500/30 flex flex-col">
          
          {/* Header */}
          <div className="bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] bg-purple-950 p-8 text-center border-b-2 border-purple-500 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
            <h2 className="relative text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-200 to-purple-600 uppercase tracking-[0.2em] animate-pulse drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
              ⚠️ KHỦNG HOẢNG CẤP ĐỘ S ⚠️
            </h2>
            <p className="relative text-purple-200 mt-4 font-bold text-xl tracking-widest">HỆ THỐNG YÊU CẦU ĐÓNG GÓP TÀI NGUYÊN</p>
          </div>
          
          <div className="p-8 flex-1 bg-slate-900 flex flex-col gap-8">
            {/* Target Box */}
            <div className="p-6 bg-black/50 rounded-xl border border-purple-900/50 shadow-inner flex flex-col gap-4">
               <h3 className="font-black text-xl text-purple-400 text-center uppercase tracking-widest">{G.activeBoss?.name} (Mục tiêu tổng)</h3>
               <div className="flex justify-center gap-6">
                 <div className="bg-slate-800 p-4 rounded-lg shadow-lg border-b-2 border-yellow-500 flex flex-col items-center min-w-[80px]">
                   <span className="text-2xl mb-1">💰</span><span className="font-black text-2xl text-white">{(G.activeBoss?.cost.capital || 0) * 4}</span>
                 </div>
                 <div className="bg-slate-800 p-4 rounded-lg shadow-lg border-b-2 border-orange-500 flex flex-col items-center min-w-[80px]">
                   <span className="text-2xl mb-1">👷</span><span className="font-black text-2xl text-white">{(G.activeBoss?.cost.labor || 0) * 4}</span>
                 </div>
                 <div className="bg-slate-800 p-4 rounded-lg shadow-lg border-b-2 border-blue-500 flex flex-col items-center min-w-[80px]">
                   <span className="text-2xl mb-1">💻</span><span className="font-black text-2xl text-white">{(G.activeBoss?.cost.tech || 0) * 4}</span>
                 </div>
                 <div className="bg-slate-800 p-4 rounded-lg shadow-lg border-b-2 border-emerald-500 flex flex-col items-center min-w-[80px]">
                   <span className="text-2xl mb-1">📜</span><span className="font-black text-2xl text-white">{(G.activeBoss?.cost.policy || 0) * 4}</span>
                 </div>
               </div>
            </div>

            {/* Input Controls */}
            {!isActive ? (
               <div className="flex-1 flex items-center justify-center p-8 bg-green-900/20 rounded-xl border border-green-500/30">
                  <div className="text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="font-black text-3xl text-green-400 uppercase tracking-widest">Giao Thức Hoàn Tất</h3>
                    <p className="text-green-200/60 mt-2 font-bold tracking-wide">Đang chờ các hệ thống khác đồng bộ...</p>
                  </div>
               </div>
            ) : (
               <div className="flex-1 bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col gap-6">
                 <h3 className="font-black text-lg text-slate-300 text-center tracking-widest uppercase">Bảng Điều Khiển Đóng Góp - P{parseInt(myPlayerId)+1}</h3>
                 <div className="flex justify-center gap-6">
                   {['capital', 'labor', 'tech', 'policy'].map(res => (
                     <div key={res} className="flex flex-col items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-700 w-32">
                       <span className="capitalize font-black text-slate-400 text-sm tracking-widest">
                         {res === 'capital' ? 'Vốn' : res === 'labor' ? 'LĐ' : res === 'tech' ? 'CN' : 'CS'}
                       </span>
                       <div className="flex items-center justify-between w-full bg-black/50 rounded-lg p-1">
                         <button onClick={() => setBossContrib(prev => ({...prev, [res]: Math.max(0, prev[res] - 1)}))} className="w-8 h-8 rounded bg-slate-700 text-white font-black hover:bg-slate-600 active:scale-95 transition">-</button>
                         <span className="font-black text-xl text-purple-400">{bossContrib[res]}</span>
                         <button onClick={() => setBossContrib(prev => ({...prev, [res]: Math.min(p.resources[res], prev[res] + 1)}))} className="w-8 h-8 rounded bg-slate-700 text-white font-black hover:bg-slate-600 active:scale-95 transition">+</button>
                       </div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase">Kho: {p.resources[res]}</span>
                     </div>
                   ))}
                 </div>
                 <button onClick={() => moves.contributeTokens(bossContrib)} className="mt-4 w-full py-6 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 active:from-purple-800 active:to-indigo-800 text-white rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.4)] border-b-4 border-indigo-950 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3">
                   <span className="text-2xl">⚡</span>
                   <span className="font-black text-xl uppercase tracking-[0.2em] text-shadow">Kích Hoạt Truyền Tải</span>
                 </button>
               </div>
            )}
          </div>
       </div>
    </div>
  );
};
