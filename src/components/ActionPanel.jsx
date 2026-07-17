import React, { useState } from 'react';

export const ActionPanel = ({ G, ctx, moves, playerID, isActive }) => {
  const currentStage = ctx.activePlayers?.[ctx.currentPlayer] || 'actions';
  const myPlayerId = playerID || "0";
  const p = G.players[myPlayerId];
  const isBossBattle = ctx.activePlayers && Object.values(ctx.activePlayers).includes('bossBattle');
  const isInteractiveTrade = ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === 'interactiveTrade';

  const [tradeForm, setTradeForm] = useState(false);
  const [tradeState, setTradeState] = useState({ partnerId: '0', offer: 'capital', request: 'capital' });

  // Render text Header
  const getHeader = () => {
    switch (currentStage) {
      case 'rollDice': return 'BƯỚC 1: THU HÚT NGUỒN LỰC';
      case 'produce': return 'BƯỚC 2: SẢN XUẤT';
      case 'marketEvent': return 'BƯỚC 3: SỰ KIỆN THỊ TRƯỜNG';
      case 'actions': return 'BƯỚC 4: HÀNH ĐỘNG & MỞ RỘNG';
      default: return 'TRUNG TÂM CHỈ HUY';
    }
  };

  // Render Body
  const renderBody = () => {
    if (!isActive) {
      return (
         <div className="flex-1 flex items-center justify-center bg-black/40 rounded-3xl border border-slate-700/50">
           <span className="text-xl font-bold text-slate-500 uppercase tracking-widest animate-pulse">Đang chờ lượt...</span>
         </div>
      );
    }
    
    if (isBossBattle) {
      return (
         <div className="flex-1 flex items-center justify-center bg-purple-900/40 rounded-3xl border border-purple-500/50 animate-pulse">
           <span className="text-xl font-bold text-purple-300 uppercase tracking-widest">⚔️ Trùm Cuối Tấn Công</span>
         </div>
      );
    }
    
    if (isInteractiveTrade) {
      return (
         <div className="flex-1 flex items-center justify-center bg-blue-900/40 rounded-3xl border border-blue-500/50 animate-pulse">
           <span className="text-xl font-bold text-blue-300 uppercase tracking-widest">🤝 Đang Giao Dịch</span>
         </div>
      );
    }

    switch (currentStage) {
      case 'rollDice':
        return (
          <div className="flex flex-col gap-8 h-full justify-center">
            <div className="flex justify-center gap-6 drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]">
               <span className="text-8xl animate-bounce" style={{animationDelay: '0s'}}>🎲</span>
               <span className="text-8xl animate-bounce" style={{animationDelay: '0.2s'}}>🎲</span>
            </div>
            <button onClick={() => moves.roll(['capital', 'labor', 'tech'])} className="w-full py-8 bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 active:from-indigo-600 active:to-indigo-800 text-white rounded-[2rem] shadow-[0_15px_30px_rgba(79,70,229,0.5)] border-b-8 border-indigo-950 active:border-b-0 active:translate-y-2 transition-all group">
              <span className="font-black text-3xl uppercase tracking-widest text-shadow">Đổ Xúc Xắc</span>
            </button>
            <div className="text-center">
              <p className="text-indigo-300/80 text-sm font-bold uppercase tracking-widest">Nhận Vốn, Lao Động, Công Nghệ hoặc Chính Sách</p>
            </div>
          </div>
        );

      case 'produce':
        return (
          <div className="flex flex-col gap-6 h-full justify-center">
            <div className="text-center px-4">
              <p className="text-slate-300 font-bold uppercase tracking-wider text-sm mb-4">Quyết định phương thức sản xuất:</p>
            </div>
            
            <button 
              disabled={!(p.resources.capital >= 1 && p.resources.labor >= 1 && p.resources.tech >= 1)}
              onClick={() => moves.produceResources(1)} 
              className="w-full p-6 bg-gradient-to-br from-emerald-500 to-emerald-800 hover:from-emerald-400 hover:to-emerald-700 disabled:from-slate-800 disabled:to-slate-900 disabled:cursor-not-allowed text-white rounded-[2rem] shadow-[0_15px_30px_rgba(16,185,129,0.3)] disabled:shadow-none border-b-8 border-emerald-950 disabled:border-slate-950 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-4xl">🌱</span>
                <span className="font-black text-2xl uppercase tracking-widest text-shadow">Sản Xuất Bền Vững</span>
              </div>
              <div className="bg-black/40 px-6 py-2 rounded-xl relative z-10 w-full text-center border border-white/10">
                <span className="text-sm text-emerald-100 font-bold tracking-wide">Tốn 1💰 1👷 1💻 ➡️ <strong className="text-emerald-300">Nhận 3 Tư Bản</strong></span>
              </div>
            </button>

            <button 
              disabled={!(p.resources.capital >= 1 && p.resources.labor >= 1)}
              onClick={() => moves.produceResources(2)} 
              className="w-full p-6 bg-gradient-to-br from-rose-600 to-rose-900 hover:from-rose-500 hover:to-rose-800 disabled:from-slate-800 disabled:to-slate-900 disabled:cursor-not-allowed text-white rounded-[2rem] shadow-[0_15px_30px_rgba(225,29,72,0.3)] disabled:shadow-none border-b-8 border-rose-950 disabled:border-slate-950 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-4xl">🔥</span>
                <span className="font-black text-2xl uppercase tracking-widest text-shadow">Sản Xuất Bóc Lột</span>
              </div>
              <div className="bg-black/40 px-6 py-2 rounded-xl relative z-10 w-full text-center border border-white/10">
                <span className="text-sm text-rose-100 font-bold tracking-wide">Tốn 1💰 1👷 ➡️ <strong className="text-rose-300">Nhận 3 Tư Bản + Rút Thẻ Phạt</strong></span>
              </div>
            </button>

            <div className="mt-2 text-center">
              <button onClick={() => moves.produceResources(3)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-bold uppercase tracking-widest rounded-full transition-colors border border-slate-700">
                Bỏ qua bước này
              </button>
            </div>
          </div>
        );

      case 'marketEvent':
        const isRing3 = Object.values(G.players).some(pl => pl.ring === 3);
        return (
          <div className="flex flex-col gap-10 h-full justify-center px-4">
             <div className="grid grid-cols-3 gap-4">
               {/* Deck 1 */}
               <div className="flex flex-col items-center gap-3">
                 <div className="w-full aspect-[2/3] bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.6)] border-2 border-blue-300 flex items-center justify-center transform -rotate-6">
                   <span className="text-4xl drop-shadow-md">🌍</span>
                 </div>
                 <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest text-center">Hội Nhập</span>
               </div>
               {/* Deck 2 */}
               <div className="flex flex-col items-center gap-3">
                 <div className="w-full aspect-[2/3] bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.6)] border-2 border-amber-300 flex items-center justify-center transform translate-y-4">
                   <span className="text-4xl drop-shadow-md">⚖️</span>
                 </div>
                 <span className="text-[10px] font-black text-amber-200 uppercase tracking-widest text-center">Đấu Tranh</span>
               </div>
               {/* Deck 3 (Boss) */}
               <div className={`flex flex-col items-center gap-3 transition-all duration-700 ${!isRing3 ? 'grayscale opacity-40' : ''}`}>
                 <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-600 to-purple-900 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.8)] border-2 border-purple-400 flex items-center justify-center transform rotate-6">
                   <span className="text-4xl drop-shadow-md">💀</span>
                 </div>
                 <span className="text-[10px] font-black text-purple-200 uppercase tracking-widest text-center">Boss Độc Quyền</span>
               </div>
             </div>

             <button onClick={() => moves.resolveEvent()} className="w-full py-8 bg-gradient-to-b from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 active:from-orange-600 active:to-orange-800 text-white rounded-[2rem] shadow-[0_15px_30px_rgba(249,115,22,0.4)] border-b-8 border-orange-950 active:border-b-0 active:translate-y-2 transition-all">
               <span className="font-black text-2xl uppercase tracking-[0.2em] text-shadow">Rút Thẻ Sự Kiện</span>
             </button>
          </div>
        );

      case 'actions':
        return (
          <div className="flex flex-col gap-4 h-full justify-center">
            <button onClick={() => moves.upgradeRing()} className="w-full p-5 bg-gradient-to-r from-cyan-800 to-cyan-900 hover:from-cyan-700 hover:to-cyan-800 text-cyan-100 rounded-2xl shadow-xl border border-cyan-700/50 hover:border-cyan-400 transition-all text-left group">
               <div className="flex items-center gap-4">
                 <div className="bg-cyan-950/80 p-3 rounded-xl border border-cyan-800 group-hover:scale-110 transition-transform"><span className="text-2xl">🚀</span></div>
                 <div>
                   <h3 className="font-black uppercase tracking-widest text-lg">1. Hội Nhập</h3>
                   <p className="text-[10px] text-cyan-400/80 font-bold uppercase mt-1">Lên V2: 5💰 2📜 &nbsp;|&nbsp; Lên V3: 10💰 3📜</p>
                 </div>
               </div>
            </button>
            
            <button onClick={() => moves.buySocialPoints()} className="w-full p-5 bg-gradient-to-r from-pink-800 to-pink-900 hover:from-pink-700 hover:to-pink-800 text-pink-100 rounded-2xl shadow-xl border border-pink-700/50 hover:border-pink-400 transition-all text-left group">
               <div className="flex items-center gap-4">
                 <div className="bg-pink-950/80 p-3 rounded-xl border border-pink-800 group-hover:scale-110 transition-transform"><span className="text-2xl">❤️</span></div>
                 <div>
                   <h3 className="font-black uppercase tracking-widest text-lg">2. Mua Điểm Xã Hội</h3>
                   <p className="text-[10px] text-pink-400/80 font-bold uppercase mt-1">Đổi Điểm Tư Bản lấy Điểm Xã Hội</p>
                 </div>
               </div>
            </button>

            {!tradeForm ? (
               <button onClick={() => setTradeForm(true)} className="w-full p-5 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-100 rounded-2xl shadow-xl border border-amber-700/50 hover:border-amber-400 transition-all text-left group">
                 <div className="flex items-center gap-4">
                   <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-800 group-hover:scale-110 transition-transform"><span className="text-2xl">🤝</span></div>
                   <div>
                     <h3 className="font-black uppercase tracking-widest text-lg">3. Liên Doanh</h3>
                     <p className="text-[10px] text-amber-400/80 font-bold uppercase mt-1">Giao dịch tài nguyên với đối tác</p>
                   </div>
                 </div>
               </button>
            ) : (
               <div className="w-full p-5 bg-slate-800 rounded-2xl shadow-xl border border-amber-500/50 flex flex-col gap-4 animate-fade-in">
                 <h3 className="font-black uppercase tracking-widest text-amber-400 border-b border-slate-700 pb-2">Liên Doanh Giao Dịch</h3>
                 
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Đối Tác:</label>
                   <select value={tradeState.partnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm outline-none">
                     {Object.keys(G.players).filter(id => id !== ctx.currentPlayer).map(id => (
                       <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                     ))}
                   </select>
                 </div>
                 
                 <div className="flex gap-2">
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Đưa ra:</label>
                     <select value={tradeState.offer} onChange={e => setTradeState({...tradeState, offer: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm outline-none">
                       <option value="capital">1 Vốn</option>
                       <option value="labor">1 Lao động</option>
                       <option value="tech">1 Công nghệ</option>
                       <option value="policy">1 Chính sách</option>
                     </select>
                   </div>
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Yêu cầu:</label>
                     <select value={tradeState.request} onChange={e => setTradeState({...tradeState, request: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm outline-none">
                       <option value="capital">1 Vốn</option>
                       <option value="labor">1 Lao động</option>
                       <option value="tech">1 Công nghệ</option>
                       <option value="policy">1 Chính sách</option>
                     </select>
                   </div>
                 </div>

                 <div className="flex gap-2 mt-2">
                   <button onClick={() => setTradeForm(false)} className="flex-1 py-3 bg-slate-700 text-slate-300 font-black uppercase text-xs rounded-xl">Hủy</button>
                   <button onClick={() => {
                     moves.trade(tradeState.partnerId, { [tradeState.offer]: 1 }, { [tradeState.request]: 1 });
                     setTradeForm(false);
                   }} className="flex-1 py-3 bg-amber-600 text-white font-black uppercase text-xs rounded-xl shadow-lg border-b-4 border-amber-900 active:border-b-0 active:translate-y-1">Thỏa Thuận</button>
                 </div>
               </div>
            )}

            <div className="mt-4">
               <button onClick={() => moves.endTurn()} className="w-full py-5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-200 rounded-2xl shadow-xl border border-slate-600 hover:border-slate-400 transition-all font-black text-xl uppercase tracking-[0.2em] text-center border-b-4 border-black active:border-b-0 active:translate-y-1">
                 🛑 Qua Lượt
               </button>
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="h-full bg-slate-900/90 backdrop-blur-3xl border-l border-slate-700/50 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col relative z-20">
      <div className="p-8 bg-gradient-to-b from-black/60 to-transparent border-b border-slate-700/50 text-center">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
          {getHeader()}
        </h2>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto">
        {renderBody()}
      </div>
    </div>
  );
};
