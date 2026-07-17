import React, { useState, useEffect, useRef } from 'react';
import { Client } from 'boardgame.io/react';
import { DuongDenThiTruong } from './game/Game';
import { GameBoard } from './components/GameBoard';

const BoardWrapper = ({ G, ctx, moves, events, playerID, isActive }) => {
  // Xác định xem có đang ở Stage Boss Battle không
  const isBossBattle = ctx.activePlayers && Object.values(ctx.activePlayers).includes('bossBattle');
  const currentStage = ctx.activePlayers?.[ctx.currentPlayer] || 'actions';
  
  // Dành cho chế độ Hot-seat cục bộ
  const myPlayerId = playerID || "0";
  const p = G.players[myPlayerId];

  // ==========================================
  // HỆ THỐNG TOAST / ALERT THÔNG BÁO
  // ==========================================
  const [toasts, setToasts] = useState([]);
  const prevG = useRef(G);

  useEffect(() => {
    const newToasts = [];
    for(let i=0; i<4; i++) {
       const oldP = prevG.current.players[i];
       const newP = G.players[i];
       
       // Trigger: Phá sản chạm đáy (Điểm tư bản về 0 và rớt vòng 1)
       if (oldP.capitalPoints > 0 && newP.capitalPoints === 0 && newP.ring === 1 && oldP.ring > 1) {
          newToasts.push(`🚨 Người chơi ${i+1} đã phá sản chạm đáy!`);
       }
       
       // Trigger: Khủng hoảng dòng tiền (Bị lùi vòng do thẻ sự kiện)
       if (oldP.ring > newP.ring && G.skipActionStage[i]) {
          newToasts.push(`💸 Người chơi ${i+1} gặp khủng hoảng dòng tiền và bị lùi vòng!`);
       }
    }
    
    if (newToasts.length > 0) {
       setToasts(prev => [...prev, ...newToasts]);
       // Tự động ẩn Toast sau 5 giây
       setTimeout(() => setToasts(prev => prev.slice(newToasts.length)), 5000);
    }
    prevG.current = G;
  }, [G]);

  // ==========================================
  // STATE CHO BOSS MODAL
  // ==========================================
  const [bossContrib, setBossContrib] = useState({ policy: 0, capital: 0, labor: 0, tech: 0 });

  // ==========================================
  // STATE CHO INTERACTIVE TRADE MODAL
  // ==========================================
  const isInteractiveTrade = ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === 'interactiveTrade';
  const isMyTurnForTrade = isInteractiveTrade && ctx.currentPlayer === myPlayerId;
  const tradeEvent = G.pendingTradeEvent;
  const [tradeState, setTradeState] = useState({ partnerId: '', price: 1, selectedToken1: 'none', selectedToken2: 'none', rewardToken: 'tech' });

  useEffect(() => {
    if (isInteractiveTrade) {
      const defaultPartner = Object.keys(G.players).find(id => id !== ctx.currentPlayer) || '0';
      setTradeState({ partnerId: defaultPartner, price: 1, selectedToken1: 'none', selectedToken2: 'none', rewardToken: 'tech' });
    }
  }, [isInteractiveTrade, ctx.currentPlayer, G.players]);

  return (
    <div className="flex h-full w-full bg-gray-50 font-sans text-slate-800">
      
      {/* KHU VỰC HIỂN THỊ TOAST */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((msg, idx) => (
          <div key={idx} className="bg-red-600 text-white px-5 py-4 rounded-xl shadow-2xl font-bold animate-bounce border-2 border-white pointer-events-auto">
            {msg}
          </div>
        ))}
      </div>

      {/* 1. BẢNG THEO DÕI (SIDEBAR) */}
      <div className="w-1/4 min-w-[320px] bg-white border-r border-gray-200 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.1)] z-10 flex flex-col overflow-y-auto">
        <div className="p-5 bg-slate-900 text-white font-black text-xl uppercase tracking-widest text-center shadow-md">
          Bảng Theo Dõi
        </div>
        <div className="flex-1 p-4 flex flex-col gap-5">
          {Object.keys(G.players).map(id => {
             const player = G.players[id];
             const isCurrentTurn = ctx.currentPlayer === id;
             
             return (
               <div key={id} className={`p-5 rounded-2xl border-2 transition-all duration-300 ${isCurrentTurn ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg' : 'border-gray-100 bg-gray-50'}`}>
                 <div className="flex justify-between items-center mb-4">
                   <h3 className={`font-black text-lg ${isCurrentTurn ? 'text-blue-700' : 'text-gray-700'}`}>P{parseInt(id)+1}: {player.faction}</h3>
                   <span className="text-xs font-bold px-3 py-1 bg-white rounded shadow-sm border text-gray-600">Vòng {player.ring}</span>
                 </div>
                 
                 {/* Progress Bar: Điểm Tư Bản */}
                 <div className="mb-3">
                   <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                     <span>Điểm Tư bản ({player.capitalPoints}/20)</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-3">
                     <div className="bg-yellow-400 h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min((player.capitalPoints/20)*100, 100)}%` }}></div>
                   </div>
                 </div>

                 {/* Progress Bar: Điểm Xã Hội */}
                 <div className="mb-4">
                   <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                     <span>Điểm Xã hội ({player.socialPoints}/10)</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-3">
                     <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${Math.min((player.socialPoints/10)*100, 100)}%` }}></div>
                   </div>
                 </div>

                 {/* Tài nguyên (Tokens) */}
                 <div className="grid grid-cols-4 gap-2 text-center text-sm font-bold">
                   <div className="bg-white p-2 rounded-lg border shadow-sm flex flex-col items-center" title="Vốn">
                     <span className="text-lg">💰</span><span className="text-gray-700">{player.resources.capital}</span>
                   </div>
                   <div className="bg-white p-2 rounded-lg border shadow-sm flex flex-col items-center" title="Lao động">
                     <span className="text-lg">👷</span><span className="text-gray-700">{player.resources.labor}</span>
                   </div>
                   <div className="bg-white p-2 rounded-lg border shadow-sm flex flex-col items-center" title="Công nghệ">
                     <span className="text-lg">💻</span><span className="text-gray-700">{player.resources.tech}</span>
                   </div>
                   <div className="bg-white p-2 rounded-lg border shadow-sm flex flex-col items-center" title="Chính sách">
                     <span className="text-lg">📜</span><span className="text-gray-700">{player.resources.policy}</span>
                   </div>
                 </div>
               </div>
             )
          })}
        </div>
      </div>

      {/* 2. KHU VỰC BÀN CỜ & ACTION PANEL */}
      <div className="flex-1 flex flex-col relative bg-slate-100">
         
         {/* Bàn cờ SVG ở giữa */}
         <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
            <GameBoard G={G} />
         </div>

         {/* ACTION PANEL DƯỚI ĐÁY */}
         <div className="h-48 bg-white shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] z-10 flex flex-col border-t border-gray-200">
            <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-[2.5rem]">
              <span className="font-bold text-gray-700 text-lg">Bảng Điều Khiển - Người chơi {parseInt(myPlayerId)+1}</span>
              <span className="text-sm font-bold text-blue-700 bg-blue-100 border border-blue-200 px-4 py-1.5 rounded-full shadow-sm">
                Stage: {currentStage}
              </span>
            </div>
            
            <div className="flex-1 p-6 flex gap-4 items-center justify-center">
              {!isActive ? (
                 <div className="text-2xl font-bold text-gray-400">Đang chờ đến lượt của bạn...</div>
              ) : isBossBattle ? (
                 <div className="text-2xl font-bold text-purple-600 animate-pulse">⚔️ Trùm cuối đang tấn công! Hãy xem Modal.</div>
              ) : isInteractiveTrade ? (
                 <div className="text-2xl font-bold text-blue-600 animate-pulse">🤝 Đang thực hiện Giao dịch (Xem Modal)</div>
              ) : (
                 <>
                   {currentStage === 'rollDice' && (
                     <button onClick={() => moves.roll(['capital', 'labor', 'tech'])} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transform transition hover:scale-105 hover:-translate-y-1 text-xl flex items-center gap-3">
                       <span className="text-3xl">🎲</span> Đổ Xúc Xắc
                     </button>
                   )}

                   {currentStage === 'produce' && (
                     <>
                       <button 
                         disabled={!(p.resources.capital >= 1 && p.resources.labor >= 1 && p.resources.tech >= 1)}
                         onClick={() => moves.produceResources(1)} 
                         className="px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg transform transition hover:scale-105 hover:-translate-y-1 text-lg flex items-center gap-2"
                       >
                         🌱 Sản xuất Bền vững
                       </button>
                       <button 
                         disabled={!(p.resources.capital >= 1 && p.resources.labor >= 1)}
                         onClick={() => moves.produceResources(2)} 
                         className="px-6 py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg transform transition hover:scale-105 hover:-translate-y-1 text-lg flex items-center gap-2"
                       >
                         🔥 Sản xuất Bóc lột
                       </button>
                     </>
                   )}

                   {currentStage === 'marketEvent' && (
                     <button onClick={() => moves.resolveEvent()} className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl transform transition hover:scale-105 hover:-translate-y-1 text-xl flex items-center gap-3">
                       <span className="text-3xl">🃏</span> Rút thẻ Sự kiện
                     </button>
                   )}

                   {currentStage === 'actions' && (
                     <>
                       <button onClick={() => moves.upgradeRing()} className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition hover:-translate-y-1">
                         🚀 Nâng Cấp Vòng
                       </button>
                       <button onClick={() => moves.buySocialPoints()} className="px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-md transition hover:-translate-y-1">
                         ❤️ Mua Điểm Xã hội
                       </button>
                       <button onClick={() => alert('Giao dịch chưa có UI chi tiết')} className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl shadow-md transition hover:-translate-y-1">
                         🤝 Giao dịch
                       </button>
                       <button onClick={() => moves.endTurn()} className="px-5 py-3 bg-gray-800 hover:bg-black text-white font-bold rounded-xl shadow-md transition hover:-translate-y-1">
                         🛑 Kết thúc lượt
                       </button>
                     </>
                   )}
                 </>
              )}
            </div>
         </div>
      </div>

      {/* 3. BOSS BATTLE MODAL */}
      {isBossBattle && (
        <div className="fixed inset-0 z-[100] bg-slate-900 bg-opacity-80 flex items-center justify-center backdrop-blur-md">
           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100">
              <div className="bg-gradient-to-r from-purple-800 to-purple-600 p-8 text-center shadow-inner">
                <h2 className="text-4xl font-black text-white uppercase tracking-widest animate-pulse drop-shadow-md">🚨 TRÙM CUỐI XUẤT HIỆN! 🚨</h2>
                <p className="text-purple-100 mt-3 font-semibold text-lg">Tất cả người chơi hãy hợp lực đóng góp Token để vượt qua khủng hoảng!</p>
              </div>
              
              <div className="p-8">
                {/* Thông tin yêu cầu tài nguyên của Boss */}
                <div className="mb-8 p-5 bg-purple-50 rounded-2xl border border-purple-200 shadow-sm">
                   <h3 className="font-bold text-xl text-purple-900 mb-4 text-center">Yêu cầu từ {G.activeBoss?.name} (Đã x4 người chơi):</h3>
                   <div className="grid grid-cols-4 gap-4 text-center font-black text-2xl text-purple-800">
                     <div className="bg-white p-3 rounded-xl shadow-sm border border-purple-100">💰 {(G.activeBoss?.cost.capital || 0) * 4}</div>
                     <div className="bg-white p-3 rounded-xl shadow-sm border border-purple-100">👷 {(G.activeBoss?.cost.labor || 0) * 4}</div>
                     <div className="bg-white p-3 rounded-xl shadow-sm border border-purple-100">💻 {(G.activeBoss?.cost.tech || 0) * 4}</div>
                     <div className="bg-white p-3 rounded-xl shadow-sm border border-purple-100">📜 {(G.activeBoss?.cost.policy || 0) * 4}</div>
                   </div>
                </div>

                {/* Khu vực thao tác đóng góp */}
                {!isActive ? (
                   <div className="text-center p-8 font-black text-2xl text-green-600 bg-green-50 rounded-2xl border border-green-200 shadow-inner">
                      ✅ Bạn đã xác nhận đóng góp!<br/><span className="text-lg font-medium text-green-700">Hãy chờ các người chơi khác hoàn tất.</span>
                   </div>
                ) : (
                   <div>
                     <h3 className="font-bold text-xl text-gray-700 mb-6 text-center">Bạn muốn góp bao nhiêu? (Đang là: P{parseInt(myPlayerId)+1})</h3>
                     <div className="grid grid-cols-4 gap-6 mb-8">
                       {['capital', 'labor', 'tech', 'policy'].map(res => (
                         <div key={res} className="flex flex-col items-center gap-3">
                           <span className="capitalize font-black text-gray-500 text-lg">
                             {res === 'capital' ? 'Vốn 💰' : res === 'labor' ? 'LĐ 👷' : res === 'tech' ? 'CN 💻' : 'CS 📜'}
                           </span>
                           <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border">
                             <button 
                               onClick={() => setBossContrib(prev => ({...prev, [res]: Math.max(0, prev[res] - 1)}))} 
                               className="w-10 h-10 rounded-lg bg-white shadow text-xl font-bold hover:bg-gray-200 active:bg-gray-300 transition"
                             >
                               -
                             </button>
                             <span className="font-black text-2xl w-8 text-center text-indigo-700">{bossContrib[res]}</span>
                             <button 
                               onClick={() => setBossContrib(prev => ({...prev, [res]: Math.min(p.resources[res], prev[res] + 1)}))} 
                               className="w-10 h-10 rounded-lg bg-white shadow text-xl font-bold hover:bg-gray-200 active:bg-gray-300 transition"
                             >
                               +
                             </button>
                           </div>
                           <span className="text-sm font-bold text-gray-400">Tối đa: {p.resources[res]}</span>
                         </div>
                       ))}
                     </div>
                     <button 
                       onClick={() => moves.contributeTokens(bossContrib)} 
                       className="w-full py-5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-black rounded-2xl shadow-xl text-xl uppercase tracking-widest transition transform hover:scale-[1.02]"
                     >
                       Xác nhận đóng góp
                     </button>
                   </div>
                )}
              </div>
           </div>
        </div>
      )}

      {/* 4. INTERACTIVE TRADE MODAL */}
      {isInteractiveTrade && (
        <div className="fixed inset-0 z-[110] bg-slate-900 bg-opacity-80 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all">
             {tradeEvent === 'trade_sell_tokens' ? (
               <>
                 <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-center text-white">
                   <h2 className="text-3xl font-black uppercase shadow-sm">🤝 Kêu Gọi Vốn Đầu Tư</h2>
                 </div>
                 <div className="p-8">
                   <p className="text-gray-600 mb-6 font-semibold bg-blue-50 p-4 rounded-xl border border-blue-100">
                     Chọn tối đa 2 Token để bán cho 1 người chơi khác để đổi lấy Điểm Tư bản.
                   </p>
                   <div className="flex flex-col gap-5">
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Đối tác (Người mua):</label>
                       <select disabled={!isMyTurnForTrade} value={tradeState.partnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-blue-500 outline-none font-semibold text-gray-800">
                          {Object.keys(G.players).filter(id => id !== ctx.currentPlayer).map(id => (
                            <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                          ))}
                       </select>
                     </div>
                     <div className="flex gap-4">
                       <div className="flex-1">
                         <label className="block text-sm font-bold text-gray-700 mb-2">Token 1 bán:</label>
                         <select disabled={!isMyTurnForTrade} value={tradeState.selectedToken1} onChange={e => setTradeState({...tradeState, selectedToken1: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-blue-500 outline-none font-semibold">
                           <option value="none">Không bán</option>
                           <option value="capital">Vốn 💰</option>
                           <option value="labor">Lao động 👷</option>
                           <option value="tech">Công nghệ 💻</option>
                           <option value="policy">Chính sách 📜</option>
                         </select>
                       </div>
                       <div className="flex-1">
                         <label className="block text-sm font-bold text-gray-700 mb-2">Token 2 bán:</label>
                         <select disabled={!isMyTurnForTrade} value={tradeState.selectedToken2} onChange={e => setTradeState({...tradeState, selectedToken2: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-blue-500 outline-none font-semibold">
                           <option value="none">Không bán</option>
                           <option value="capital">Vốn 💰</option>
                           <option value="labor">Lao động 👷</option>
                           <option value="tech">Công nghệ 💻</option>
                           <option value="policy">Chính sách 📜</option>
                         </select>
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (Điểm Tư bản nhận về):</label>
                       <input disabled={!isMyTurnForTrade} type="number" min="0" value={tradeState.price} onChange={e => setTradeState({...tradeState, price: parseInt(e.target.value) || 0})} className="w-full border-2 border-gray-200 rounded-xl p-3 bg-white focus:border-blue-500 outline-none font-black text-xl text-blue-700 text-center" />
                     </div>
                   </div>
                   {isMyTurnForTrade ? (
                     <div className="mt-8 flex gap-4">
                       <button onClick={() => moves.skipTrade()} className="w-1/3 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition">Bỏ qua</button>
                       <button onClick={() => {
                          const tokens = {};
                          if(tradeState.selectedToken1 !== 'none') tokens[tradeState.selectedToken1] = (tokens[tradeState.selectedToken1] || 0) + 1;
                          if(tradeState.selectedToken2 !== 'none') tokens[tradeState.selectedToken2] = (tokens[tradeState.selectedToken2] || 0) + 1;
                          moves.executeTrade({ partnerId: tradeState.partnerId, tokens, price: tradeState.price });
                       }} className="w-2/3 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg transition uppercase tracking-wider">Xác nhận Bán</button>
                     </div>
                   ) : (
                     <div className="mt-8 p-5 bg-yellow-100 text-yellow-800 font-bold rounded-xl text-center shadow-inner">
                       Đang chờ Người chơi {parseInt(ctx.currentPlayer)+1} thao tác...
                     </div>
                   )}
                 </div>
               </>
             ) : tradeEvent === 'trade_buy_service' ? (
               <>
                 <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-6 text-center text-white">
                   <h2 className="text-3xl font-black uppercase shadow-sm">🏢 Hợp Đồng Cung Ứng B2B</h2>
                 </div>
                 <div className="p-8">
                   <p className="text-gray-700 mb-6 font-semibold bg-teal-50 p-5 rounded-xl border border-teal-100 shadow-inner">
                     Bạn sẽ chuyển <span className="font-black text-red-600 text-lg">2 Điểm Tư bản</span> cho đối tác. Hãy chọn loại Token muốn nhận từ Ngân hàng.
                   </p>
                   <div className="flex flex-col gap-6">
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Đối tác sẽ nhận 2 Điểm Tư bản:</label>
                       <select disabled={!isMyTurnForTrade} value={tradeState.partnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-teal-500 outline-none font-semibold text-gray-800">
                          {Object.keys(G.players).filter(id => id !== ctx.currentPlayer).map(id => (
                            <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                          ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-700 mb-3">Loại Token muốn nhận (Nhận 2):</label>
                       <div className="flex gap-4">
                          <label className={`flex-1 border-2 p-5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-3 ${tradeState.rewardToken === 'tech' ? 'bg-teal-50 border-teal-500 shadow-md transform scale-105' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                            <input disabled={!isMyTurnForTrade} type="radio" name="reward" checked={tradeState.rewardToken === 'tech'} onChange={() => setTradeState({...tradeState, rewardToken: 'tech'})} className="hidden" />
                            <span className="text-3xl">💻</span> <span className="font-bold text-lg text-gray-700">2 Công nghệ</span>
                          </label>
                          <label className={`flex-1 border-2 p-5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-3 ${tradeState.rewardToken === 'policy' ? 'bg-teal-50 border-teal-500 shadow-md transform scale-105' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                            <input disabled={!isMyTurnForTrade} type="radio" name="reward" checked={tradeState.rewardToken === 'policy'} onChange={() => setTradeState({...tradeState, rewardToken: 'policy'})} className="hidden" />
                            <span className="text-3xl">📜</span> <span className="font-bold text-lg text-gray-700">2 Chính sách</span>
                          </label>
                       </div>
                     </div>
                   </div>
                   {isMyTurnForTrade ? (
                     <div className="mt-8 flex gap-4">
                       <button onClick={() => moves.skipTrade()} className="w-1/3 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition">Bỏ qua</button>
                       <button onClick={() => {
                          moves.executeTrade({ partnerId: tradeState.partnerId, rewardToken: tradeState.rewardToken });
                       }} className="w-2/3 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-lg transition uppercase tracking-wider">Ký Hợp Đồng</button>
                     </div>
                   ) : (
                     <div className="mt-8 p-5 bg-yellow-100 text-yellow-800 font-bold rounded-xl text-center shadow-inner">
                       Đang chờ Người chơi {parseInt(ctx.currentPlayer)+1} thao tác...
                     </div>
                   )}
                 </div>
               </>
             ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

// Khởi tạo Client của boardgame.io
const GameClient = Client({
  game: DuongDenThiTruong,
  board: BoardWrapper,
  numPlayers: 4,
});

// Component Root App với Hot-seat switcher
export default function App() {
  const [playerID, setPlayerID] = useState('0');
  
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
       {/* BAR CHỌN NGƯỜI CHƠI (HOT-SEAT) ĐỂ TEST */}
       <div className="bg-slate-900 text-white p-3 flex gap-6 items-center justify-center shadow-lg z-20 relative">
         <span className="font-semibold text-gray-300">Chế độ Thử nghiệm (Hot-seat). Đang điều khiển:</span>
         <div className="flex gap-2">
           {[0,1,2,3].map(id => (
             <button 
               key={id} 
               onClick={() => setPlayerID(id.toString())} 
               className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                 playerID === id.toString() 
                 ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] scale-110 text-white' 
                 : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
               }`}
             >
               Người chơi {id + 1}
             </button>
           ))}
         </div>
       </div>
       
       <div className="flex-1 relative">
         <GameClient playerID={playerID} />
       </div>
    </div>
  )
}
