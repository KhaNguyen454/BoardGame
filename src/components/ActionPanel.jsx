import React, { useState, useEffect } from 'react';

// --- Hỗ trợ bóc tách thông số Thẻ bài ---
const getCardBadges = (card) => {
  if (!card) return [];
  const badges = [];
  if (card.isBoss) badges.push('💀 BOSS ĐỘC QUYỀN');
  else if (card?.type?.includes('reward')) badges.push('🌟 CƠ HỘI');
  else if (card?.type?.includes('penalty')) badges.push('⚠️ RỦI RO');
  else if (card?.type?.includes('trade')) badges.push('🤝 TƯƠNG TÁC');

  if (card.amount) {
    if (card?.type?.includes('capital') || card?.effect?.includes('capital')) badges.push(`📈 C.Points ${card.amount}`);
    if (card?.type?.includes('social') || card?.effect?.includes('social')) badges.push(`🌱 S.Points ${card.amount}`);
    if (card?.type?.includes('tech')) badges.push(`💻 Tech ${card.amount}`);
    if (card?.effect === 'minus_labor') badges.push(`👷 Labor -${card.amount}`);
  }
  if (card.capitalAmount) badges.push(`📈 C.Points ${card.capitalAmount}`);
  if (card.laborAmount) badges.push(`👷 Labor ${card.laborAmount}`);
  if (card?.effect === 'lose_turn' || card?.type?.includes('ban')) badges.push('⛔ Bỏ Lượt / Cấm');
  return badges;
};

const DiceFace = ({ value, rolling, small }) => {
  const dots = Array(value).fill(0);
  return (
    <div className={`${small ? 'w-12 h-12 border-2 p-2 gap-1 rounded-xl' : 'w-24 h-24 border-4 p-4 gap-2 rounded-2xl'} bg-indigo-900 border-indigo-500 flex flex-wrap justify-center content-center shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] ${rolling ? 'animate-spin' : ''}`}>
      {dots.map((_, i) => (
        <div key={i} className={`${small ? 'w-2 h-2' : 'w-4 h-4'} bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]`}></div>
      ))}
    </div>
  );
};

export const ActionPanel = ({ G, ctx, moves, playerID, myPlayerId, isActive }) => {
  const currentStage = ctx.activePlayers?.[ctx.currentPlayer] || 'actions';
  const currentPlayerViewId = myPlayerId !== undefined ? myPlayerId : (playerID || ctx.currentPlayer);
  const p = G.players[currentPlayerViewId];
  const isBossBattle = ctx.activePlayers && Object.values(ctx.activePlayers).includes('bossBattle');
  const isInteractiveTrade = ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === 'interactiveTrade';

  const [tradeForm, setTradeForm] = useState(false);
  const [tradeState, setTradeState] = useState({ partnerId: '0', offer: 'none', request: 'none', price: 1, rewardToken: 'tech' });
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const [customAlert, setCustomAlert] = useState(null);
  const [selectedBonus, setSelectedBonus] = useState({ capital: 0, labor: 0, tech: 0, policy: 0 });
  const [isRolling, setIsRolling] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAnimatingDraw, setIsAnimatingDraw] = useState(false);
  const [animatingCardIndex, setAnimatingCardIndex] = useState(-1);

  const handleRoll = () => {
    setIsRolling(true);
    setTimeout(() => {
      setIsRolling(false);
      moves.roll(['capital', 'labor', 'tech']);
    }, 1000);
  };

  const handleDrawCard = () => {
    setIsAnimatingDraw(true);
    setAnimatingCardIndex(-1);

    const isRing3 = Object.values(G.players).some(pl => pl.ring === 3);
    const activeIndices = [0, 1, 2]; // Cơ hội, Rủi ro, Tương tác luôn có
    if (G.isExploiting) activeIndices.push(3); // Nếu bóc lột, có Đấu tranh
    if (isRing3) activeIndices.push(4); // Boss nếu có người vòng 3

    let tick = 0;
    const interval = setInterval(() => {
       setAnimatingCardIndex(activeIndices[tick % activeIndices.length]);
       tick++;
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsAnimatingDraw(false);
      setAnimatingCardIndex(-1);
      moves.resolveEvent();
    }, 3000);
  };

  const showAlert = (message) => setCustomAlert(message);

  const getHeader = () => {
    switch (currentStage) {
      case 'rollDice': return 'BƯỚC 1: THU HÚT NGUỒN LỰC';
      case 'produce': return 'BƯỚC 2: SẢN XUẤT';
      case 'marketEvent': return 'BƯỚC 3: SỰ KIỆN THỊ TRƯỜNG';
      case 'interactiveTrade': return G.pendingTradeEvent === 'trade_sell_tokens' ? '🤝 KÊU GỌI VỐN' : '🏢 HỢP ĐỒNG B2B';
      case 'actions': return 'BƯỚC 4: HÀNH ĐỘNG & MỞ RỘNG';
      default: return 'TRUNG TÂM CHỈ HUY';
    }
  };

  const renderBody = () => {
    if (!isActive) {
      return (
         <div className="flex-1 flex items-center justify-center bg-slate-900/40 rounded-3xl border border-slate-700/50">
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

    switch (currentStage) {
      case 'rollDice':
        return (
          <div className={`flex flex-col h-full justify-center text-center ${G.pendingBonusTokens > 0 ? 'gap-2' : 'gap-8'}`}>
            {G.lastRoll ? (
              <div className={`flex flex-col items-center animate-fade-in w-full ${G.pendingBonusTokens > 0 ? 'gap-2' : 'gap-6'}`}>
                <div className={`flex justify-center drop-shadow-[0_0_15px_rgba(79,70,229,0.5)] ${G.pendingBonusTokens > 0 ? 'gap-2' : 'gap-6'}`}>
                  <DiceFace value={G.lastRoll.d1} rolling={false} small={G.pendingBonusTokens > 0} />
                  <DiceFace value={G.lastRoll.d2} rolling={false} small={G.pendingBonusTokens > 0} />
                </div>
                <div className={`bg-slate-800 rounded-2xl border border-slate-700 w-full shadow-lg ${G.pendingBonusTokens > 0 ? 'p-3' : 'p-6'}`}>
                  <h3 className={`font-black text-indigo-400 uppercase tracking-widest ${G.pendingBonusTokens > 0 ? 'mb-2 text-sm' : 'mb-4'}`}>Nhận được từ tổng {G.lastRoll.sum}:</h3>
                  <div className="flex justify-center gap-4">
                    {G.lastRoll.resourcesAdded.capital > 0 && <span className="font-bold text-lg md:text-xl">💰 +{G.lastRoll.resourcesAdded.capital}</span>}
                    {G.lastRoll.resourcesAdded.labor > 0 && <span className="font-bold text-lg md:text-xl">👷 +{G.lastRoll.resourcesAdded.labor}</span>}
                    {G.lastRoll.resourcesAdded.tech > 0 && <span className="font-bold text-lg md:text-xl">💻 +{G.lastRoll.resourcesAdded.tech}</span>}
                    {G.lastRoll.resourcesAdded.policy > 0 && <span className="font-bold text-lg md:text-xl">📜 +{G.lastRoll.resourcesAdded.policy}</span>}
                    {Object.values(G.lastRoll.resourcesAdded).every(v => v === 0) && <span className="font-bold text-lg md:text-xl text-amber-400">✨ Xúc xắc may mắn ✨</span>}
                  </div>
                </div>

                {G.pendingBonusTokens > 0 ? (
                  <div className="w-full bg-slate-900 border border-amber-500/50 rounded-2xl p-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    <p className="text-base md:text-lg font-black text-amber-400 mb-3 uppercase tracking-widest">
                      🎁 CHỌN TÀI NGUYÊN THƯỞNG
                    </p>
                    
                    {(() => {
                       const totalSelected = Object.values(selectedBonus).reduce((a, b) => a + b, 0);
                       const remaining = G.pendingBonusTokens - totalSelected;
                       
                       const handleModify = (res, delta) => {
                         if (delta > 0 && remaining === 0) return;
                         if (delta < 0 && selectedBonus[res] === 0) return;
                         setSelectedBonus(prev => ({ ...prev, [res]: prev[res] + delta }));
                       };

                       const confirmBonus = () => {
                         moves.claimBonusTokens(selectedBonus);
                         setSelectedBonus({ capital: 0, labor: 0, tech: 0, policy: 0 });
                       };

                       return (
                         <div className="flex flex-col gap-4">
                           <div className="grid grid-cols-2 gap-2">
                             {[
                               { id: 'capital', icon: '💰', label: 'Tư bản' },
                               { id: 'labor', icon: '👷', label: 'L.Động' },
                               { id: 'tech', icon: '💻', label: 'C.Nghệ' },
                               { id: 'policy', icon: '📜', label: 'C.Sách' }
                             ].map(res => (
                               <div key={res.id} className="bg-slate-800 border border-slate-700 rounded-lg p-2 flex flex-col items-center gap-1">
                                 <span className="text-xl md:text-2xl">{res.icon}</span>
                                 <span className="text-[9px] md:text-[10px] uppercase font-bold text-slate-400 truncate w-full text-center">{res.label}</span>
                                 <div className="flex justify-center items-center gap-1 mt-1">
                                   <button 
                                     disabled={selectedBonus[res.id] === 0} 
                                     onClick={() => handleModify(res.id, -1)} 
                                     className="w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-30 font-bold text-white transition-all flex items-center justify-center text-sm"
                                   >
                                     -
                                   </button>
                                   <span className="font-black text-sm md:text-base w-4 text-center">{selectedBonus[res.id]}</span>
                                   <button 
                                     disabled={remaining === 0} 
                                     onClick={() => handleModify(res.id, 1)} 
                                     className="w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 font-bold text-white shadow-lg transition-all flex items-center justify-center text-sm"
                                   >
                                     +
                                   </button>
                                 </div>
                               </div>
                             ))}
                           </div>
                           
                           <button 
                             disabled={remaining > 0} 
                             onClick={confirmBonus} 
                             className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 disabled:border-slate-800 text-white rounded-xl shadow-[0_10px_20px_rgba(245,158,11,0.4)] disabled:shadow-none border-b-4 border-yellow-900 disabled:cursor-not-allowed active:border-b-0 active:translate-y-1 transition-all"
                           >
                             {remaining > 0 ? (
                               <span className="font-black text-lg md:text-xl uppercase tracking-widest">CHỌN THÊM {remaining} THẺ</span>
                             ) : (
                               <span className="font-black text-xl md:text-2xl uppercase tracking-[0.2em] animate-pulse">XÁC NHẬN</span>
                             )}
                           </button>
                         </div>
                       );
                    })()}
                  </div>
                ) : (
                  <button onClick={() => moves.confirmRoll()} className="w-full py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.4)] border-b-4 border-teal-900 active:border-b-0 active:translate-y-1 transition-all mt-4">
                    <span className="font-black text-2xl uppercase tracking-[0.2em]">TIẾP TỤC</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-8 h-full justify-center">
                <div className="flex justify-center gap-6 drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                   <div className={`text-8xl ${isRolling ? 'animate-spin' : 'animate-bounce'}`} style={{animationDelay: '0s'}}>🎲</div>
                   <div className={`text-8xl ${isRolling ? 'animate-spin' : 'animate-bounce'}`} style={{animationDelay: '0.2s'}}>🎲</div>
                </div>
                <button disabled={isRolling} onClick={handleRoll} className="w-full py-8 bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 active:from-indigo-600 active:to-indigo-800 disabled:opacity-50 text-white rounded-[2rem] shadow-[0_15px_30px_rgba(79,70,229,0.5)] border-b-8 border-indigo-950 active:border-b-0 active:translate-y-2 transition-all group">
                  <span className="font-black text-3xl uppercase tracking-widest text-shadow">{isRolling ? 'Đang Lắc...' : 'Đổ Xúc Xắc'}</span>
                </button>
                <div className="text-center">
                  <p className="text-indigo-300/80 text-sm font-bold uppercase tracking-widest">Nhận Vốn, Lao Động, Công Nghệ hoặc Chính Sách</p>
                </div>
              </div>
            )}
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
              <div className="flex items-center gap-4 relative z-10 w-full justify-center">
                <span className="text-4xl flex-shrink-0">🌱</span>
                <span className="font-black text-lg md:text-xl uppercase tracking-widest text-shadow whitespace-nowrap overflow-hidden text-ellipsis">Sản Xuất Bền Vững</span>
              </div>
              <div className="bg-black/40 px-6 py-2 rounded-xl relative z-10 w-full text-center border border-white/10 whitespace-normal">
                <span className="text-sm text-emerald-100 font-bold tracking-wide">Tốn 1💰 1👷 1💻 ➡️ <strong className="text-emerald-300">Nhận 3 Tư Bản</strong></span>
              </div>
            </button>

            <button 
              disabled={!(p.resources.capital >= 1 && p.resources.labor >= 1)}
              onClick={() => moves.produceResources(2)} 
              className="w-full p-6 bg-gradient-to-br from-rose-600 to-rose-900 hover:from-rose-500 hover:to-rose-800 disabled:from-slate-800 disabled:to-slate-900 disabled:cursor-not-allowed text-white rounded-[2rem] shadow-[0_15px_30px_rgba(225,29,72,0.3)] disabled:shadow-none border-b-8 border-rose-950 disabled:border-slate-950 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="flex items-center gap-4 relative z-10 w-full justify-center">
                <span className="text-4xl flex-shrink-0">🔥</span>
                <span className="font-black text-lg md:text-xl uppercase tracking-widest text-shadow whitespace-nowrap overflow-hidden text-ellipsis">Sản Xuất Bóc Lột</span>
              </div>
              <div className="bg-black/40 px-6 py-2 rounded-xl relative z-10 w-full text-center border border-white/10 whitespace-normal">
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
        const cardToDisplay = G.lastEvent;

        if (cardToDisplay && !isAnimatingDraw) {
           let cardColor = 'bg-gradient-to-br from-slate-700 to-slate-900 border-slate-500';
           if (cardToDisplay.isBoss) {
             cardColor = 'bg-gradient-to-br from-purple-700 to-indigo-900 border-purple-400';
           } else if (['ev6', 'ev7', 'ev8', 'ev9', 'cs1', 'cs2', 'cs3', 'cs4', 'cs5', 'cs6', 'cs7'].includes(cardToDisplay.id) || cardToDisplay.effect) {
             cardColor = 'bg-gradient-to-br from-rose-700 to-red-950 border-rose-500';
           } else if (['ev10', 'ev11'].includes(cardToDisplay.id)) {
             cardColor = 'bg-gradient-to-br from-orange-600 to-amber-900 border-orange-500';
           } else {
             cardColor = 'bg-gradient-to-br from-emerald-600 to-teal-900 border-emerald-400';
           }

           return (
             <div className="flex flex-col gap-10 h-full justify-center px-4">
                <div className="flex flex-col items-center gap-8 animate-bounce-in">
                   <div className={`w-full min-h-80 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] border-4 flex flex-col p-6 text-center justify-between ${cardColor} relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
                     <div className="bg-black/60 rounded-xl p-4 border border-white/20 relative z-10">
                       <h3 className="font-black text-2xl text-white uppercase tracking-widest drop-shadow-lg leading-tight">{cardToDisplay?.name || 'Đang tải dữ liệu...'}</h3>
                     </div>
                     <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-2 mt-4 gap-4">
                       <p className="font-bold text-lg text-slate-100 italic drop-shadow-md">"{cardToDisplay?.description || 'Vui lòng chờ trong giây lát...'}"</p>
                       <div className="flex gap-2 flex-wrap justify-center">
                         {getCardBadges(cardToDisplay).map((badge, i) => (
                           <span key={i} className="bg-amber-500 text-amber-950 font-black px-3 py-1 rounded-full text-xs shadow-[0_0_10px_rgba(245,158,11,0.5)]">{badge}</span>
                         ))}
                       </div>
                     </div>
                   </div>
                   <button onClick={() => moves.confirmEvent()} className="w-full py-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-[2rem] shadow-[0_15px_30px_rgba(16,185,129,0.4)] border-b-8 border-teal-900 active:border-b-0 active:translate-y-2 transition-all group">
                     <span className="font-black text-3xl uppercase tracking-[0.2em] text-shadow group-hover:scale-105 inline-block transition-transform">XÁC NHẬN HIỆU ỨNG</span>
                   </button>
                </div>
             </div>
           );
        }

        const btnText = isAnimatingDraw ? 'Đang chọn bài...' : 'Rút Thẻ Sự Kiện';

        return (
          <div className="flex flex-col gap-10 h-full justify-center px-4 animate-fade-in">
              <div className="flex flex-col gap-4">
                {/* Hàng 1: Cơ Hội, Rủi Ro, Tương Tác */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Card 0: Cơ Hội */}
                  <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${animatingCardIndex === 0 ? 'scale-110 drop-shadow-[0_0_20px_gold] z-10' : ''}`}>
                    <div className={`w-full aspect-[2/3] bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl shadow-lg border-2 ${animatingCardIndex === 0 ? 'border-yellow-300' : 'border-emerald-300'} flex items-center justify-center transform -rotate-3`}>
                      <span className="text-4xl drop-shadow-md">🌟</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest text-center">Cơ Hội</span>
                  </div>
                  {/* Card 1: Rủi Ro */}
                  <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${animatingCardIndex === 1 ? 'scale-110 drop-shadow-[0_0_20px_gold] z-10' : ''}`}>
                    <div className={`w-full aspect-[2/3] bg-gradient-to-br from-rose-500 to-red-700 rounded-xl shadow-lg border-2 ${animatingCardIndex === 1 ? 'border-yellow-300' : 'border-rose-300'} flex items-center justify-center transform translate-y-2`}>
                      <span className="text-4xl drop-shadow-md">⚠️</span>
                    </div>
                    <span className="text-[10px] font-black text-rose-200 uppercase tracking-widest text-center">Rủi Ro</span>
                  </div>
                  {/* Card 2: Tương Tác */}
                  <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${animatingCardIndex === 2 ? 'scale-110 drop-shadow-[0_0_20px_gold] z-10' : ''}`}>
                    <div className={`w-full aspect-[2/3] bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-lg border-2 ${animatingCardIndex === 2 ? 'border-yellow-300' : 'border-blue-300'} flex items-center justify-center transform rotate-3`}>
                      <span className="text-4xl drop-shadow-md">🤝</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest text-center">Tương Tác</span>
                  </div>
                </div>

                {/* Hàng 2: Đấu Tranh, Boss */}
                <div className="grid grid-cols-2 gap-6 px-6 mt-2">
                  {/* Card 3: Đấu Tranh */}
                  <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${!G.isExploiting ? 'opacity-30 grayscale' : 'opacity-100'} ${animatingCardIndex === 3 ? 'scale-110 drop-shadow-[0_0_20px_gold] z-10' : ''}`}>
                    <div className={`w-full aspect-[2/3] bg-gradient-to-br from-amber-500 to-orange-700 rounded-xl shadow-lg border-2 ${animatingCardIndex === 3 ? 'border-yellow-300' : 'border-amber-300'} flex items-center justify-center transform -rotate-6`}>
                      <span className="text-5xl drop-shadow-md">✊</span>
                    </div>
                    <span className="text-[10px] font-black text-amber-200 uppercase tracking-widest text-center">Đấu Tranh</span>
                  </div>
                  {/* Card 4: Boss */}
                  <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${!isRing3 ? 'opacity-30 grayscale' : 'opacity-100'} ${animatingCardIndex === 4 ? 'scale-110 drop-shadow-[0_0_20px_gold] z-10' : ''}`}>
                    <div className={`w-full aspect-[2/3] bg-gradient-to-br from-purple-600 to-purple-900 rounded-xl shadow-lg border-2 ${animatingCardIndex === 4 ? 'border-yellow-300' : 'border-purple-400'} flex items-center justify-center transform rotate-6`}>
                      <span className="text-5xl drop-shadow-md">💀</span>
                    </div>
                    <span className="text-[10px] font-black text-purple-200 uppercase tracking-widest text-center">Boss Độc Quyền</span>
                  </div>
                </div>
              </div>

              <button disabled={isAnimatingDraw} onClick={handleDrawCard} className="w-full py-8 bg-gradient-to-b from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 active:from-orange-600 active:to-orange-800 disabled:opacity-50 text-white rounded-[2rem] shadow-[0_15px_30px_rgba(249,115,22,0.4)] border-b-8 border-orange-950 active:border-b-0 active:translate-y-2 transition-all">
                <span className="font-black text-2xl uppercase tracking-[0.2em] text-shadow">{btnText}</span>
              </button>
          </div>
        );

      case 'interactiveTrade':
        const tradeEvent = G.pendingTradeEvent;
        const isMyTurnForTrade = ctx.currentPlayer === currentPlayerViewId;
        
        if (!isMyTurnForTrade) {
          return (
             <div className="flex-1 flex items-center justify-center bg-slate-800/80 rounded-3xl border border-slate-600 p-4">
               <span className="text-lg font-bold text-slate-400 uppercase tracking-widest animate-pulse text-center leading-loose">⏳ Đang chờ P{parseInt(ctx.currentPlayer)+1} quyết định...</span>
             </div>
          );
        }

        if (tradeEvent === 'trade_sell_tokens') {
           const tokensOfferred = {};
           if (tradeState.offer !== 'none') tokensOfferred[tradeState.offer] = (tokensOfferred[tradeState.offer] || 0) + 1;
           if (tradeState.request !== 'none') tokensOfferred[tradeState.request] = (tokensOfferred[tradeState.request] || 0) + 1;
           let isB2BShortage = false;
           for (let t of Object.keys(tokensOfferred)) {
             if (p.resources[t] < tokensOfferred[t]) isB2BShortage = true;
           }

           return (
             <div className="flex flex-col gap-4 h-full justify-start mt-6">
               <div className="bg-slate-800 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-amber-500/50 flex flex-col gap-4">
                 <div className="text-center border-b border-slate-700 pb-4">
                   <p className="text-amber-400 font-black uppercase tracking-widest text-sm">Bán Tối Đa 2 Token</p>
                   <p className="text-[10px] text-slate-400 mt-1">Phần thưởng: Cả 2 nhận +1 Điểm XH</p>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Đối Tác Nhận:</label>
                     <select value={tradeState.partnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl p-3 text-white text-sm outline-none focus:border-amber-500 transition-colors font-bold">
                        {Object.keys(G.players).filter(id => id !== ctx.currentPlayer).map(id => (
                          <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                        ))}
                     </select>
                   </div>
                   
                     <div className="flex gap-3 relative">
                       <div className="flex-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Gói 1:</label>
                         <select value={tradeState.offer} onChange={e => setTradeState({...tradeState, offer: e.target.value})} className={`w-full bg-slate-700 border ${isB2BShortage ? 'border-red-500' : 'border-slate-600'} rounded-xl p-3 text-white text-sm outline-none focus:border-amber-500 transition-colors font-bold`}>
                           <option value="none">Trống</option>
                           <option value="capital">Vốn 💰</option>
                           <option value="labor">Lao động 👷</option>
                           <option value="tech">Công nghệ 💻</option>
                           <option value="policy">Chính sách 📜</option>
                         </select>
                       </div>
                       <div className="flex-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Gói 2:</label>
                         <select value={tradeState.request} onChange={e => setTradeState({...tradeState, request: e.target.value})} className={`w-full bg-slate-700 border ${isB2BShortage ? 'border-red-500' : 'border-slate-600'} rounded-xl p-3 text-white text-sm outline-none focus:border-amber-500 transition-colors font-bold`}>
                           <option value="none">Trống</option>
                           <option value="capital">Vốn 💰</option>
                           <option value="labor">Lao động 👷</option>
                           <option value="tech">Công nghệ 💻</option>
                           <option value="policy">Chính sách 📜</option>
                         </select>
                       </div>
                     </div>
                     {isB2BShortage && <p className="text-red-400 text-xs font-bold text-center mt-1 animate-pulse">⚠️ Không đủ tài nguyên!</p>}
                   
                   <div className="mt-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block text-center">Yêu Cầu (Điểm Tư Bản):</label>
                     <input type="number" min="0" value={tradeState.price} onChange={e => setTradeState({...tradeState, price: parseInt(e.target.value) || 0})} className="w-full bg-slate-700 border border-slate-600 rounded-xl p-4 text-amber-400 font-black text-2xl text-center outline-none focus:border-amber-500 transition-colors" />
                   </div>
                 </div>

                 <div className="flex flex-row gap-3 mt-6">
                   <button onClick={() => moves.skipTrade()} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-black uppercase tracking-widest text-xs rounded-xl border border-rose-500/50 hover:border-rose-500 transition-colors">Hủy Bỏ</button>
                   <button disabled={isB2BShortage} onClick={() => {
                      const tokens = {};
                      if(tradeState.offer !== 'none') tokens[tradeState.offer] = (tokens[tradeState.offer] || 0) + 1;
                      if(tradeState.request !== 'none') tokens[tradeState.request] = (tokens[tradeState.request] || 0) + 1;
                      setPendingConfirmation({
                        type: 'executeTrade',
                        payload: { partnerId: tradeState.partnerId, tokens, price: tradeState.price }
                      });
                   }} className="flex-[2] py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_10px_20px_rgba(16,185,129,0.4)] disabled:shadow-none border-b-4 border-teal-900 disabled:border-slate-800 active:border-b-0 active:translate-y-1 transition-all">KÝ KẾT</button>
                 </div>
               </div>
             </div>
           );
        } else if (tradeEvent === 'trade_buy_service') {
           return (
             <div className="flex flex-col gap-4 h-full justify-start mt-6">
               <div className="bg-slate-800 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-teal-500/50 flex flex-col gap-4">
                 <div className="text-center border-b border-slate-700 pb-4">
                   <p className="text-teal-400 font-black uppercase tracking-widest text-sm">Trả 2 Tư Bản Nhận 2 Token</p>
                   <p className="text-[10px] text-slate-400 mt-1">Phần thưởng: Cả 2 nhận +1 Điểm XH</p>
                 </div>
                 
                 <div className="flex flex-col gap-6">
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Đối Tác Nhận 2 TB:</label>
                     <select value={tradeState.partnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="w-full bg-slate-700 border border-slate-600 rounded-xl p-3 text-white text-sm outline-none focus:border-teal-500 transition-colors font-bold">
                        {Object.keys(G.players).filter(id => id !== ctx.currentPlayer).map(id => (
                          <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                        ))}
                     </select>
                   </div>
                   
                   <div>
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block text-center">Gói Nhận Về:</label>
                     <div className="flex gap-3">
                        <label className={`flex-1 border-2 p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${tradeState.rewardToken === 'tech' ? 'bg-teal-900/50 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-slate-700 border-slate-600 hover:border-slate-500'}`}>
                          <input type="radio" name="reward" checked={tradeState.rewardToken === 'tech'} onChange={() => setTradeState({...tradeState, rewardToken: 'tech'})} className="hidden" />
                          <span className="text-3xl drop-shadow-sm">💻</span> <span className="font-black text-[10px] text-white uppercase tracking-widest text-center mt-1">2 Công Nghệ</span>
                        </label>
                        <label className={`flex-1 border-2 p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${tradeState.rewardToken === 'policy' ? 'bg-teal-900/50 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-slate-700 border-slate-600 hover:border-slate-500'}`}>
                          <input type="radio" name="reward" checked={tradeState.rewardToken === 'policy'} onChange={() => setTradeState({...tradeState, rewardToken: 'policy'})} className="hidden" />
                          <span className="text-3xl drop-shadow-sm">📜</span> <span className="font-black text-[10px] text-white uppercase tracking-widest text-center mt-1">2 Chính Sách</span>
                        </label>
                     </div>
                   </div>
                 </div>

                 <div className="flex flex-row gap-3 mt-8">
                   <button onClick={() => moves.skipTrade()} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-black uppercase tracking-widest text-xs rounded-xl border border-rose-500/50 hover:border-rose-500 transition-colors">Hủy Bỏ</button>
                   <button onClick={() => {
                      setPendingConfirmation({
                        type: 'executeTrade',
                        payload: { partnerId: tradeState.partnerId, rewardToken: tradeState.rewardToken }
                      });
                   }} className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_10px_20px_rgba(59,130,246,0.4)] border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1 transition-all">KÝ KẾT</button>
                 </div>
               </div>
             </div>
           );
        }
        return null;

      case 'actions':
        const canUpgradeV2 = p.ring === 1 && p.capitalPoints >= 5 && p.resources.policy >= 2;
        const canUpgradeV3 = p.ring === 2 && p.capitalPoints >= 10 && p.resources.policy >= 3;
        const isBanned = G.upgradeBan[myPlayerId] > 0;
        
        const availablePartners = Object.keys(G.players).filter(id => id !== ctx.currentPlayer);
        const currentPartnerId = availablePartners.includes(tradeState.partnerId) ? tradeState.partnerId : (availablePartners[0] || '0');
        const currentOffer = tradeState.offer === 'none' ? 'capital' : tradeState.offer;
        const isGenericShortage = !p || !p.resources || (p.resources[currentOffer] || 0) < 1;

        return (
          <div className="flex flex-col gap-4 h-full justify-center">
            {p.ring === 1 && (
              <button 
                disabled={!canUpgradeV2 || isBanned}
                onClick={() => { 
                  moves.upgradeRing(); 
                  showAlert('Nâng Cấp Vòng thành công! Bạn đã tiến sâu hơn vào thị trường.'); 
                }} 
                className="w-full p-5 bg-gradient-to-r from-cyan-800 to-cyan-900 hover:from-cyan-700 hover:to-cyan-800 disabled:from-slate-800 disabled:to-slate-900 text-cyan-100 disabled:text-slate-500 rounded-2xl shadow-xl border border-cyan-700/50 hover:border-cyan-400 disabled:border-slate-800 transition-all text-left group"
              >
                 <div className="flex items-center gap-4">
                   <div className="bg-cyan-950/80 p-3 rounded-xl border border-cyan-800 group-hover:scale-110 transition-transform"><span className="text-2xl">🚀</span></div>
                   <div className="flex-1">
                     <h3 className="font-black uppercase tracking-widest text-lg">HỘI NHẬP LÊN VÒNG 2 (ASEAN)</h3>
                     <p className="text-[10px] text-cyan-400/80 font-bold uppercase mt-1">Chi phí: 5 Điểm Tư bản 📈 + 2 Token Chính sách 📜</p>
                     {isBanned && <p className="text-xs font-black text-red-400 uppercase mt-1 animate-pulse">Đang bị cấm nâng cấp</p>}
                     {!canUpgradeV2 && !isBanned && <p className="text-xs font-black text-rose-400 uppercase mt-1">Thiếu điều kiện hội nhập</p>}
                   </div>
                 </div>
              </button>
            )}

            {p.ring === 2 && (
              <button 
                disabled={!canUpgradeV3 || isBanned}
                onClick={() => { 
                  moves.upgradeRing(); 
                  showAlert('Nâng Cấp Vòng thành công! Bạn đã tiến sâu hơn vào thị trường.'); 
                }} 
                className="w-full p-5 bg-gradient-to-r from-cyan-800 to-cyan-900 hover:from-cyan-700 hover:to-cyan-800 disabled:from-slate-800 disabled:to-slate-900 text-cyan-100 disabled:text-slate-500 rounded-2xl shadow-xl border border-cyan-700/50 hover:border-cyan-400 disabled:border-slate-800 transition-all text-left group"
              >
                 <div className="flex items-center gap-4">
                   <div className="bg-cyan-950/80 p-3 rounded-xl border border-cyan-800 group-hover:scale-110 transition-transform"><span className="text-2xl">🚀</span></div>
                   <div className="flex-1">
                     <h3 className="font-black uppercase tracking-widest text-lg">HỘI NHẬP LÊN VÒNG 3 (TOÀN CẦU)</h3>
                     <p className="text-[10px] text-cyan-400/80 font-bold uppercase mt-1">Chi phí: 10 Điểm Tư bản 📈 + 3 Token Chính sách 📜</p>
                     {isBanned && <p className="text-xs font-black text-red-400 uppercase mt-1 animate-pulse">Đang bị cấm nâng cấp</p>}
                     {!canUpgradeV3 && !isBanned && <p className="text-xs font-black text-rose-400 uppercase mt-1">Thiếu điều kiện hội nhập</p>}
                   </div>
                 </div>
              </button>
            )}

            {p.ring === 3 && (
              <div className="w-full p-5 bg-slate-800 rounded-2xl shadow-xl border border-amber-500/50 text-center flex items-center justify-center gap-3">
                 <span className="text-2xl animate-pulse">🌟</span>
                 <h3 className="font-black uppercase tracking-widest text-amber-400">BẠN ĐANG Ở THỊ TRƯỜNG TOÀN CẦU</h3>
                 <span className="text-2xl animate-pulse">🌟</span>
              </div>
            )}
            
            <button 
              disabled={p.capitalPoints < (p.faction === 'Khối FDI' ? 4 : 3)}
              onClick={() => { 
                moves.buySocialPoints(); 
                showAlert('Mua Điểm Xã Hội thành công! Uy tín của bạn đã tăng lên.'); 
              }} 
              className="w-full p-5 bg-gradient-to-r from-pink-800 to-pink-900 hover:from-pink-700 hover:to-pink-800 disabled:from-slate-800 disabled:to-slate-900 text-pink-100 disabled:text-slate-500 rounded-2xl shadow-xl border border-pink-700/50 hover:border-pink-400 disabled:border-slate-800 transition-all text-left group"
            >
               <div className="flex items-center gap-4">
                 <div className="bg-pink-950/80 p-3 rounded-xl border border-pink-800 group-hover:scale-110 transition-transform"><span className="text-2xl">❤️</span></div>
                 <div>
                   <h3 className="font-black uppercase tracking-widest text-lg">Mua Điểm Xã Hội</h3>
                   <p className="text-[10px] text-pink-400/80 font-bold uppercase mt-1">Chi phí: {p.faction === 'Khối FDI' ? '4' : '3'} Điểm Tư bản 📈</p>
                   {p.capitalPoints < (p.faction === 'Khối FDI' ? 4 : 3) && <p className="text-xs font-black text-slate-400 uppercase mt-1">Thiếu Điểm Tư Bản</p>}
                 </div>
               </div>
            </button>

            {!tradeForm ? (
               <button onClick={() => setTradeForm(true)} className="w-full p-6 bg-slate-800 hover:bg-slate-700 text-white rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.4)] border-2 border-amber-600/50 hover:border-amber-500 transition-all flex flex-col items-center gap-2 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <span className="text-4xl group-hover:scale-110 transition-transform">🤝</span>
                 <span className="font-black text-xl uppercase tracking-widest text-amber-500">Liên Doanh</span>
               </button>
            ) : (
               <div className="w-full p-5 bg-slate-900/90 rounded-2xl shadow-xl border border-amber-500/50 flex flex-col gap-4 animate-fade-in">
                 <div className="text-center border-b border-slate-700 pb-2">
                   <h3 className="font-black uppercase tracking-widest text-amber-400">Liên Doanh Giao Dịch</h3>
                   <p className="text-[10px] text-slate-400 mt-1">Đổi 1 Token lấy 1 Token. HTX có quyền lợi thêm.</p>
                 </div>
                 
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Đối Tác:</label>
                   <select value={currentPartnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="w-full bg-slate-950 border border-slate-600 rounded p-2 text-white text-sm outline-none focus:border-amber-500">
                     {availablePartners.map(id => (
                       <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                     ))}
                   </select>
                 </div>
                 
                 <div className="flex gap-2">
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Đưa ra:</label>
                     <select value={tradeState.offer} onChange={e => setTradeState({...tradeState, offer: e.target.value})} className={`w-full bg-slate-950 border ${isGenericShortage ? 'border-red-500' : 'border-slate-600'} rounded p-2 text-white text-sm outline-none focus:border-amber-500`}>
                       <option value="capital">1 Vốn</option>
                       <option value="labor">1 Lao động</option>
                       <option value="tech">1 Công nghệ</option>
                       <option value="policy">1 Chính sách</option>
                     </select>
                   </div>
                   <div className="flex-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Yêu cầu:</label>
                     <select value={tradeState.request} onChange={e => setTradeState({...tradeState, request: e.target.value})} className="w-full bg-slate-950 border border-slate-600 rounded p-2 text-white text-sm outline-none focus:border-amber-500">
                       <option value="capital">1 Vốn</option>
                       <option value="labor">1 Lao động</option>
                       <option value="tech">1 Công nghệ</option>
                       <option value="policy">1 Chính sách</option>
                     </select>
                   </div>
                 </div>
                 
                 {isGenericShortage && <p className="text-red-400 text-xs font-bold text-center animate-pulse">⚠️ Không đủ tài nguyên!</p>}

                 <div className="flex gap-2 mt-2">
                   <button onClick={() => setTradeForm(false)} className="flex-1 py-3 bg-slate-700 text-slate-300 font-black uppercase text-xs rounded-xl hover:bg-slate-600 transition-colors">Hủy</button>
                   <button disabled={isGenericShortage} onClick={() => {
                      setPendingConfirmation({
                        type: 'trade',
                        payload: { partnerId: currentPartnerId, offer: { [currentOffer]: 1 }, request: { [tradeState.request]: 1 } }
                      });
                      setTradeForm(false);
                   }} className="flex-1 py-3 bg-amber-600 text-white font-black uppercase text-xs rounded-xl shadow-lg border-b-4 border-amber-900 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:border-slate-700 disabled:shadow-none hover:bg-amber-500 transition-all">Thỏa Thuận</button>
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
    <div className="w-[25vw] min-w-[320px] max-w-[400px] flex-shrink-0 h-full bg-slate-900/90 backdrop-blur-3xl border-l border-slate-700/50 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col relative z-20">
      <div className="p-8 bg-gradient-to-b from-black/60 to-transparent border-b border-slate-700/50 text-center">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
          {getHeader()}
        </h2>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto relative">
        {renderBody()}

        {/* Custom Alert Modal */}
        {customAlert && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-slate-800 border-2 border-indigo-500 p-8 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] text-center max-w-sm w-full">
              <span className="text-5xl block mb-4">🔔</span>
              <p className="text-white font-black uppercase tracking-wider mb-8">{customAlert}</p>
              <button 
                onClick={() => setCustomAlert(null)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg font-black uppercase tracking-widest border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1 transition-all"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Trade Confirmation Popup fixed to the left near Sidebar */}
      </div>

      {pendingConfirmation && (
        <div className="absolute top-1/2 right-[100%] mr-6 transform -translate-y-1/2 z-[9999] w-[320px] bg-slate-800 border-4 border-amber-500 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.6)] p-6 flex flex-col gap-5 animate-fade-in">
          {/* The pointer triangle to the right */}
          <div className="absolute -right-[14px] top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 border-r-4 border-t-4 border-amber-500 transform rotate-45 rounded-sm"></div>
          
          <h3 className="font-black text-amber-400 uppercase tracking-widest text-center border-b-2 border-slate-700 pb-3 text-lg">
            Yêu Cầu Xác Nhận
          </h3>
          
          <div className="text-center">
            <p className="text-white text-sm font-bold leading-relaxed mb-3">
              <span className="text-amber-400 text-base">P{parseInt(currentPlayerViewId) + 1}</span> đề nghị giao dịch với <span className="text-teal-400 text-base">P{parseInt(pendingConfirmation.payload.partnerId) + 1}</span>
            </p>
            
            <div className="text-xs text-slate-200 font-bold bg-slate-900 p-4 rounded-xl border border-slate-600 shadow-inner flex flex-col gap-2">
               {pendingConfirmation.type === 'trade' && <span>Trao đổi tài nguyên (1 đổi 1)</span>}
               {pendingConfirmation.type === 'executeTrade' && G.pendingTradeEvent === 'trade_sell_tokens' && <span>Bán Token nhận <span className="text-amber-400 text-base">{pendingConfirmation.payload.price} Tư Bản</span></span>}
               {pendingConfirmation.type === 'executeTrade' && G.pendingTradeEvent === 'trade_buy_service' && <span>Nhận <span className="text-teal-400 text-base">2 {pendingConfirmation.payload.rewardToken}</span> với giá 2 Tư Bản</span>}
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-4 animate-pulse">P{parseInt(pendingConfirmation.payload.partnerId) + 1} cần ấn Đồng ý để chốt kèo!</p>
          </div>
          
          <div className="flex gap-3 mt-2">
            <button onClick={() => setPendingConfirmation(null)} className="flex-1 py-4 bg-slate-700 text-slate-300 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-600 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all">
              Từ Chối
            </button>
            <button onClick={() => {
               if (pendingConfirmation.type === 'trade') {
                 moves.trade(pendingConfirmation.payload.partnerId, pendingConfirmation.payload.offer, pendingConfirmation.payload.request);
                 showAlert('Đã hoàn tất Liên Doanh!');
               } else if (pendingConfirmation.type === 'executeTrade') {
                 moves.executeTrade(pendingConfirmation.payload);
                 showAlert('Đã hoàn tất Hợp Đồng B2B!');
               }
               setPendingConfirmation(null);
            }} className="flex-[2] py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_10px_20px_rgba(245,158,11,0.4)] border-b-4 border-orange-900 active:border-b-0 active:translate-y-1 transition-all">
              Đồng Ý
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
