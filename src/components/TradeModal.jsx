import React, { useState, useEffect } from 'react';

export const TradeModal = ({ G, ctx, moves, playerID, isActive }) => {
  const isInteractiveTrade = ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === 'interactiveTrade';
  const myPlayerId = playerID || "0";
  const isMyTurnForTrade = isInteractiveTrade && ctx.currentPlayer === myPlayerId;
  const tradeEvent = G.pendingTradeEvent;

  const [tradeState, setTradeState] = useState({ partnerId: '', price: 1, selectedToken1: 'none', selectedToken2: 'none', rewardToken: 'tech' });

  useEffect(() => {
    if (isInteractiveTrade) {
      const defaultPartner = Object.keys(G.players).find(id => id !== ctx.currentPlayer) || '0';
      setTradeState({ partnerId: defaultPartner, price: 1, selectedToken1: 'none', selectedToken2: 'none', rewardToken: 'tech' });
    }
  }, [isInteractiveTrade, ctx.currentPlayer, G.players]);

  if (!isInteractiveTrade) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col">
         {tradeEvent === 'trade_sell_tokens' ? (
           <>
             <div className="bg-gradient-to-r from-blue-900 to-cyan-900 p-6 text-center border-b-2 border-blue-500 shadow-lg">
               <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-200 to-cyan-400 uppercase tracking-widest drop-shadow-md">🤝 Kêu Gọi Vốn</h2>
             </div>
             <div className="p-8 flex flex-col gap-6">
               <div className="bg-blue-950/50 p-4 rounded-xl border border-blue-900/50 text-center">
                 <p className="text-blue-300 font-bold tracking-wide uppercase text-sm">Giao Thức Chuyển Nhượng Token</p>
               </div>
               
               <div className="space-y-4">
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                   <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Đối Tác Nhận:</label>
                   <select disabled={!isMyTurnForTrade} value={tradeState.partnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white font-bold focus:border-blue-500 outline-none transition">
                      {Object.keys(G.players).filter(id => id !== ctx.currentPlayer).map(id => (
                        <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                      ))}
                   </select>
                 </div>
                 
                 <div className="flex gap-4">
                   <div className="flex-1 bg-slate-800 p-4 rounded-xl border border-slate-700">
                     <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Gói Hàng 1:</label>
                     <select disabled={!isMyTurnForTrade} value={tradeState.selectedToken1} onChange={e => setTradeState({...tradeState, selectedToken1: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white font-bold focus:border-blue-500 outline-none transition">
                       <option value="none">Trống</option>
                       <option value="capital">Vốn 💰</option>
                       <option value="labor">Lao động 👷</option>
                       <option value="tech">Công nghệ 💻</option>
                       <option value="policy">Chính sách 📜</option>
                     </select>
                   </div>
                   <div className="flex-1 bg-slate-800 p-4 rounded-xl border border-slate-700">
                     <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Gói Hàng 2:</label>
                     <select disabled={!isMyTurnForTrade} value={tradeState.selectedToken2} onChange={e => setTradeState({...tradeState, selectedToken2: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white font-bold focus:border-blue-500 outline-none transition">
                       <option value="none">Trống</option>
                       <option value="capital">Vốn 💰</option>
                       <option value="labor">Lao động 👷</option>
                       <option value="tech">Công nghệ 💻</option>
                       <option value="policy">Chính sách 📜</option>
                     </select>
                   </div>
                 </div>
                 
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                   <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Yêu Cầu Tư Bản Hồi Báo:</label>
                   <input disabled={!isMyTurnForTrade} type="number" min="0" value={tradeState.price} onChange={e => setTradeState({...tradeState, price: parseInt(e.target.value) || 0})} className="w-1/2 bg-slate-900 border border-slate-600 rounded-lg p-3 text-blue-400 font-black text-2xl text-center focus:border-blue-500 outline-none transition" />
                 </div>
               </div>
               
               {isMyTurnForTrade ? (
                 <div className="mt-4 flex gap-4">
                   <button onClick={() => moves.skipTrade()} className="w-1/3 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-widest rounded-xl transition shadow-md border-b-4 border-slate-800 active:border-b-0 active:translate-y-1">Hủy Giao Thức</button>
                   <button onClick={() => {
                      const tokens = {};
                      if(tradeState.selectedToken1 !== 'none') tokens[tradeState.selectedToken1] = (tokens[tradeState.selectedToken1] || 0) + 1;
                      if(tradeState.selectedToken2 !== 'none') tokens[tradeState.selectedToken2] = (tokens[tradeState.selectedToken2] || 0) + 1;
                      moves.executeTrade({ partnerId: tradeState.partnerId, tokens, price: tradeState.price });
                   }} className="w-2/3 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-shadow">Xác Nhận Ký Kết</button>
                 </div>
               ) : (
                 <div className="mt-4 p-4 bg-slate-800 text-slate-400 font-bold uppercase tracking-widest text-center rounded-xl border border-slate-700 animate-pulse">
                   ⏳ Đang chờ P{parseInt(ctx.currentPlayer)+1} ra quyết định...
                 </div>
               )}
             </div>
           </>
         ) : tradeEvent === 'trade_buy_service' ? (
           <>
             <div className="bg-gradient-to-r from-teal-900 to-emerald-900 p-6 text-center border-b-2 border-teal-500 shadow-lg">
               <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-teal-200 to-emerald-400 uppercase tracking-widest drop-shadow-md">🏢 Hợp Đồng B2B</h2>
             </div>
             <div className="p-8 flex flex-col gap-6">
               <div className="bg-teal-950/50 p-4 rounded-xl border border-teal-900/50 text-center">
                 <p className="text-teal-300 font-bold tracking-wide uppercase text-sm">Chuyển 2 Tư Bản để nhận Gói Tài Nguyên</p>
               </div>
               
               <div className="space-y-4">
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                   <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Đơn Vị Thụ Hưởng (Nhận 2 TB):</label>
                   <select disabled={!isMyTurnForTrade} value={tradeState.partnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white font-bold focus:border-teal-500 outline-none transition">
                      {Object.keys(G.players).filter(id => id !== ctx.currentPlayer).map(id => (
                        <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                      ))}
                   </select>
                 </div>
                 
                 <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                   <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-widest text-center">Chọn Gói Yêu Cầu (Nhận 2):</label>
                   <div className="flex gap-4">
                      <label className={`flex-1 border-2 p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${tradeState.rewardToken === 'tech' ? 'bg-teal-900/50 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
                        <input disabled={!isMyTurnForTrade} type="radio" name="reward" checked={tradeState.rewardToken === 'tech'} onChange={() => setTradeState({...tradeState, rewardToken: 'tech'})} className="hidden" />
                        <span className="text-3xl drop-shadow-sm">💻</span> <span className="font-black text-sm text-white uppercase tracking-widest">Công Nghệ</span>
                      </label>
                      <label className={`flex-1 border-2 p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${tradeState.rewardToken === 'policy' ? 'bg-teal-900/50 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
                        <input disabled={!isMyTurnForTrade} type="radio" name="reward" checked={tradeState.rewardToken === 'policy'} onChange={() => setTradeState({...tradeState, rewardToken: 'policy'})} className="hidden" />
                        <span className="text-3xl drop-shadow-sm">📜</span> <span className="font-black text-sm text-white uppercase tracking-widest">Chính Sách</span>
                      </label>
                   </div>
                 </div>
               </div>
               
               {isMyTurnForTrade ? (
                 <div className="mt-4 flex gap-4">
                   <button onClick={() => moves.skipTrade()} className="w-1/3 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-widest rounded-xl transition shadow-md border-b-4 border-slate-800 active:border-b-0 active:translate-y-1">Hủy Giao Thức</button>
                   <button onClick={() => {
                      moves.executeTrade({ partnerId: tradeState.partnerId, rewardToken: tradeState.rewardToken });
                   }} className="w-2/3 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 text-shadow">Ký Hợp Đồng</button>
                 </div>
               ) : (
                 <div className="mt-4 p-4 bg-slate-800 text-slate-400 font-bold uppercase tracking-widest text-center rounded-xl border border-slate-700 animate-pulse">
                   ⏳ Đang chờ P{parseInt(ctx.currentPlayer)+1} ra quyết định...
                 </div>
               )}
             </div>
           </>
         ) : null}
      </div>
    </div>
  );
};
