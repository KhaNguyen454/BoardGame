import React, { useState, useEffect } from 'react';
import { playClick, playSuccess, playError, playDiceRoll } from '../utils/audio';

// --- Hỗ trợ bóc tách thông số Thẻ bài ---
const getCardBadges = (card) => {
  if (!card || typeof card !== 'object') return [];
  const badges = [];
  const cardType = card.type || '';
  const cardEffect = card.effect || '';

  if (card.isBoss || cardType === 'boss') badges.push('💀 BOSS ĐỘC QUYỀN');
  else if (cardType.includes('reward')) badges.push('🌟 CƠ HỘI');
  else if (cardType.includes('penalty')) badges.push('⚠️ RỦI RO');
  else if (cardType.includes('trade')) badges.push('🤝 TƯƠNG TÁC');
  else if (cardType.includes('struggle') || cardEffect) badges.push('✊ ĐẤU TRANH');

  if (card.amount) {
    if (cardType.includes('capital') || cardEffect.includes('capital')) badges.push(`📈 C.Points ${card.amount}`);
    if (cardType.includes('social') || cardEffect.includes('social')) badges.push(`🌱 S.Points ${card.amount}`);
    if (cardType.includes('tech') || cardEffect.includes('tech')) badges.push(`💻 Tech ${card.amount}`);
    if (cardEffect.includes('minus_labor') || cardEffect.includes('labor')) badges.push(`👷 Labor -${card.amount}`);
  }
  if (card.capitalAmount) badges.push(`📈 C.Points ${card.capitalAmount}`);
  if (card.laborAmount) badges.push(`👷 Labor ${card.laborAmount}`);
  if (cardEffect.includes('lose_turn') || cardType.includes('ban') || cardEffect.includes('ban')) badges.push('⛔ Bỏ Lượt / Cấm');
  
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
    playDiceRoll();
    setIsRolling(true);
    setTimeout(() => {
      setIsRolling(false);
      playSuccess();
      moves.roll(['capital', 'labor', 'tech']);
    }, 1000);
  };

  const handleDrawCard = () => {
    playClick();
    setIsAnimatingDraw(true);
    setAnimatingCardIndex(-1);

    const isRing3 = Object.values(G.players).some(pl => pl.ring === 3);
    const activeIndices = [0, 1, 2]; // Cơ hội, Rủi ro, Tương tác luôn có
    if (G.isExploiting) activeIndices.push(3); // Nếu bóc lột, có Đấu tranh
    if (isRing3) activeIndices.push(4); // Boss nếu có người vòng 3

    let tick = 0;
    const interval = setInterval(() => {
       playClick();
       setAnimatingCardIndex(activeIndices[tick % activeIndices.length]);
       tick++;
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsAnimatingDraw(false);
      setAnimatingCardIndex(-1);
      playSuccess();
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
                  <button onClick={() => moves.confirmRoll()} className="w-full py-3 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-md border border-teal-500/50 active:translate-y-1 transition-all mt-4 backdrop-blur-sm">
                    <span className="font-bold text-lg uppercase tracking-[0.1em]">TIẾP TỤC</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-6 h-full justify-center">
                <div className="flex justify-center gap-4 drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                   <div className={`text-8xl ${isRolling ? 'animate-spin' : 'animate-bounce'}`} style={{animationDelay: '0s'}}>🎲</div>
                   <div className={`text-8xl ${isRolling ? 'animate-spin' : 'animate-bounce'}`} style={{animationDelay: '0.2s'}}>🎲</div>
                </div>
                <button disabled={isRolling} onClick={handleRoll} className="w-full py-3 bg-gradient-to-r from-indigo-600/90 to-indigo-800/90 hover:from-indigo-500 hover:to-indigo-700 active:from-indigo-700 active:to-indigo-900 disabled:opacity-50 text-white rounded-xl shadow-md border border-indigo-500/50 active:translate-y-1 transition-all group backdrop-blur-sm">
                  <span className="font-bold text-base uppercase tracking-widest text-shadow">{isRolling ? 'Đang Lắc...' : 'Đổ Xúc Xắc'}</span>
                </button>
                <div className="text-center">
                  <p className="text-indigo-300/80 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Nhận Vốn, Lao Động, Công Nghệ hoặc Chính Sách</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'produce':
        return (
          <div className="flex flex-col gap-4 h-full justify-center">
            <div className="text-center px-2">
              <p className="text-slate-300 font-bold uppercase tracking-wider text-xs mb-2">Quyết định phương thức sản xuất:</p>
            </div>
            
            <button 
              disabled={!(p.resources.capital >= 1 && p.resources.labor >= 1 && p.resources.tech >= 1)}
              onClick={() => moves.produceResources(1)} 
              className="w-full p-4 bg-gradient-to-r from-emerald-900/80 to-slate-900 hover:from-emerald-800 hover:to-slate-800 disabled:from-slate-900 disabled:to-slate-950 disabled:cursor-not-allowed text-emerald-100 rounded-xl shadow-md border border-emerald-600/30 hover:border-emerald-500/50 disabled:border-slate-800 active:translate-y-1 transition-all flex flex-col gap-2 relative overflow-hidden group backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="flex items-center gap-4 relative z-10 w-full">
                <span className="text-3xl flex-shrink-0 bg-emerald-950 p-3 rounded-lg border border-emerald-800/50">🌱</span>
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold text-base uppercase tracking-wider text-shadow">Sản Xuất Bền Vững</span>
                  <span className="text-xs text-emerald-200/80 font-semibold tracking-wide mt-1">Tốn 1💰 1👷 1💻 ➡️ <strong className="text-emerald-400">Nhận 3 Tư Bản</strong></span>
                </div>
              </div>
            </button>

            <button 
              disabled={!(p.resources.capital >= 1 && p.resources.labor >= 1)}
              onClick={() => moves.produceResources(2)} 
              className="w-full p-4 bg-gradient-to-r from-rose-900/80 to-slate-900 hover:from-rose-800 hover:to-slate-800 disabled:from-slate-900 disabled:to-slate-950 disabled:cursor-not-allowed text-rose-100 rounded-xl shadow-md border border-rose-600/30 hover:border-rose-500/50 disabled:border-slate-800 active:translate-y-1 transition-all flex flex-col gap-2 relative overflow-hidden group backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="flex items-center gap-4 relative z-10 w-full">
                <span className="text-3xl flex-shrink-0 bg-rose-950 p-3 rounded-lg border border-rose-800/50">🔥</span>
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold text-base uppercase tracking-wider text-shadow">Sản Xuất Bóc Lột</span>
                  <span className="text-xs text-rose-200/80 font-semibold tracking-wide mt-1">Tốn 1💰 1👷 ➡️ <strong className="text-rose-400">Nhận 3 Tư Bản + Rút Thẻ Phạt</strong></span>
                </div>
              </div>
            </button>

            <div className="mt-1 text-center">
              <button onClick={() => moves.produceResources(3)} className="px-6 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-bold text-[10px] uppercase tracking-wider rounded-full transition-colors border border-slate-700">
                Bỏ qua bước này
              </button>
            </div>
          </div>
        );

      case 'marketEvent':
        const isRing3 = Object.values(G.players).some(pl => pl.ring === 3);
        const cardToDisplay = G.lastEvent;

        if (cardToDisplay && typeof cardToDisplay === 'object' && !isAnimatingDraw) {
           if (!cardToDisplay.name) {
             return (
               <div className="flex flex-col gap-10 h-full justify-center px-4">
                 <div className="flex flex-col items-center gap-8 animate-bounce-in">
                   <div className="w-full min-h-80 rounded-2xl shadow-xl border-4 flex flex-col p-6 text-center justify-center bg-slate-900 border-red-500 text-white">
                     <h3 className="font-black text-xl text-red-400 uppercase mb-4">Lỗi Dữ Liệu Thẻ Bài</h3>
                     <p>Đang tải hoặc thẻ bài bị lỗi dữ liệu (thiếu name/title).</p>
                   </div>
                   <button onClick={() => moves.confirmEvent()} className="w-full py-8 bg-slate-700 hover:bg-slate-600 text-white rounded-[2rem] border-b-8 border-slate-900 active:border-b-0 active:translate-y-2 transition-all">
                     <span className="font-black text-xl uppercase tracking-widest">Bỏ qua lỗi</span>
                   </button>
                 </div>
               </div>
             );
           }

           let cardColor = 'bg-gradient-to-br from-slate-700 to-slate-900 border-slate-500';
           const cardId = cardToDisplay.id || '';
           if (cardToDisplay.isBoss || (cardToDisplay.type && cardToDisplay.type === 'boss')) {
             cardColor = 'bg-gradient-to-br from-purple-700 to-indigo-900 border-purple-400';
           } else if (['ev6', 'ev7', 'ev8', 'ev9', 'cs1', 'cs2', 'cs3', 'cs4', 'cs5', 'cs6', 'cs7'].includes(cardId) || cardToDisplay.effect) {
             cardColor = 'bg-gradient-to-br from-rose-700 to-red-950 border-rose-500';
           } else if (['ev10', 'ev11'].includes(cardId)) {
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
                   <button onClick={() => moves.confirmEvent()} className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-md border border-emerald-500/50 active:translate-y-1 transition-all group backdrop-blur-sm">
                     <span className="font-bold text-lg uppercase tracking-[0.1em] text-shadow group-hover:scale-105 inline-block transition-transform">XÁC NHẬN HIỆU ỨNG</span>
                   </button>
                </div>
             </div>
           );
        }

        const btnText = isAnimatingDraw ? 'Đang chọn bài...' : 'Rút Thẻ Sự Kiện';

        return (
          <div className="flex flex-col gap-4 h-full justify-center px-2 animate-fade-in">
              <div className="flex flex-col gap-2">
                {/* Cards Container */}
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { id: 0, title: 'CƠ HỘI', subtitle: 'Đầu Tư', emoji: '📈', colors: 'from-emerald-800/90 to-emerald-950/90 border-emerald-500/50', text: 'text-emerald-300', glow: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]', delay: '0ms' },
                    { id: 1, title: 'RỦI RO', subtitle: 'Thị Trường', emoji: '📉', colors: 'from-rose-800/90 to-rose-950/90 border-rose-500/50', text: 'text-rose-300', glow: 'drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]', delay: '100ms' },
                    { id: 2, title: 'ĐỐI NGOẠI', subtitle: 'FDI & Hợp Tác', emoji: '🤝', colors: 'from-blue-800/90 to-blue-950/90 border-blue-500/50', text: 'text-blue-300', glow: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]', delay: '200ms' },
                    { id: 3, title: 'CẠNH TRANH', subtitle: 'Thương Mại', emoji: '⚖️', colors: 'from-amber-800/90 to-amber-950/90 border-amber-500/50', text: 'text-amber-300', glow: 'drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]', delay: '300ms', isExploit: true },
                    { id: 4, title: 'KHỦNG HOẢNG', subtitle: 'Cấu Trúc', emoji: '🏛️', colors: 'from-purple-800/90 to-purple-950/90 border-purple-500/50', text: 'text-purple-300', glow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]', delay: '400ms', isBoss: true }
                  ].map(card => {
                    const isActive = animatingCardIndex === card.id;
                    const isDimmed = (card.isExploit && !G.isExploiting) || (card.isBoss && !isRing3);
                    return (
                      <div key={card.id} className={`flex flex-col items-center gap-2 transition-all duration-500 ${isDimmed ? 'opacity-30 grayscale' : 'opacity-100'} ${isActive ? `scale-110 ${card.glow} z-10` : 'scale-95 hover:scale-100'}`} style={{ transitionDelay: isActive ? '0ms' : card.delay }}>
                        <div className={`relative w-[100px] h-[140px] bg-gradient-to-br ${card.colors} rounded-xl shadow-lg border flex flex-col items-center justify-between p-2.5 overflow-hidden backdrop-blur-md ${isActive ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]' : ''}`}>
                          {/* Inner subtle border */}
                          <div className="absolute inset-1 border border-white/10 rounded-lg pointer-events-none"></div>
                          {/* Top accent line */}
                          <div className="w-12 h-1 bg-white/20 rounded-full mt-0.5"></div>
                          
                          {/* Icon */}
                          <div className="flex-1 flex items-center justify-center">
                            <span className="text-4xl drop-shadow-md opacity-90">{card.emoji}</span>
                          </div>
                          
                          {/* Text Area */}
                          <div className="w-full bg-black/40 rounded px-1.5 py-2 text-center border-t border-white/10 mt-1">
                            <p className={`text-[10px] font-black uppercase tracking-widest ${card.text} leading-tight mb-0.5`}>{card.title}</p>
                            <p className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">{card.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button disabled={isAnimatingDraw} onClick={handleDrawCard} className="w-full py-3 mt-4 bg-gradient-to-r from-orange-600/90 to-amber-600/90 hover:from-orange-500 hover:to-amber-500 active:from-orange-700 active:to-amber-700 disabled:opacity-50 text-white rounded-xl shadow-md border border-orange-500/50 active:translate-y-1 transition-all backdrop-blur-sm">
                <span className="font-bold text-base uppercase tracking-widest text-shadow">{btnText}</span>
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
             <div className="flex flex-col gap-2 h-full justify-center">
               <div className="bg-slate-900/90 p-4 rounded-xl shadow-md border border-amber-500/30 flex flex-col gap-3 backdrop-blur-sm">
                 <div className="text-center border-b border-slate-700/50 pb-2">
                   <p className="text-amber-400 font-bold uppercase tracking-wider text-xs">Kêu Gọi Giao Dịch</p>
                   <p className="text-[9px] text-slate-400 mt-0.5">Phần thưởng: Cả 2 nhận +1 Điểm XH</p>
                 </div>
                 
                 <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2">
                     <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Đối Tác:</label>
                     <select value={tradeState.partnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="flex-1 bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200 text-xs outline-none focus:border-amber-500 transition-colors">
                        {Object.keys(G.players).filter(id => id !== ctx.currentPlayer).map(id => (
                          <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                        ))}
                     </select>
                   </div>
                   
                   <div className="flex gap-2 relative">
                     <div className="flex-1 flex flex-col gap-0.5">
                       <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Đưa ra (Gói 1):</label>
                       <select value={tradeState.offer} onChange={e => setTradeState({...tradeState, offer: e.target.value})} className={`w-full bg-slate-950 border ${isB2BShortage ? 'border-red-500/50' : 'border-slate-700'} rounded p-1.5 text-slate-200 text-xs outline-none focus:border-amber-500 transition-colors`}>
                         <option value="none">Trống</option>
                         <option value="capital">Vốn 💰</option>
                         <option value="labor">Lao động 👷</option>
                         <option value="tech">Công nghệ 💻</option>
                         <option value="policy">Chính sách 📜</option>
                       </select>
                     </div>
                     <div className="flex-1 flex flex-col gap-0.5">
                       <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Đưa ra (Gói 2):</label>
                       <select value={tradeState.request} onChange={e => setTradeState({...tradeState, request: e.target.value})} className={`w-full bg-slate-950 border ${isB2BShortage ? 'border-red-500/50' : 'border-slate-700'} rounded p-1.5 text-slate-200 text-xs outline-none focus:border-amber-500 transition-colors`}>
                         <option value="none">Trống</option>
                         <option value="capital">Vốn 💰</option>
                         <option value="labor">Lao động 👷</option>
                         <option value="tech">Công nghệ 💻</option>
                         <option value="policy">Chính sách 📜</option>
                       </select>
                     </div>
                   </div>
                   {isB2BShortage && <p className="text-red-400 text-[10px] font-bold text-center mt-0.5 animate-pulse">⚠️ Không đủ tài nguyên!</p>}
                   
                   <div className="mt-1 flex flex-col items-center">
                     <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1 text-center">Yêu Cầu (Tư Bản):</label>
                     <div className="flex items-center gap-2">
                       <button onClick={() => setTradeState({...tradeState, price: Math.max(0, tradeState.price - 1)})} className="w-6 h-6 rounded bg-slate-800 text-white hover:bg-slate-700">-</button>
                       <span className="w-10 text-center font-bold text-amber-400 text-lg">{tradeState.price}</span>
                       <button onClick={() => setTradeState({...tradeState, price: tradeState.price + 1})} className="w-6 h-6 rounded bg-slate-800 text-white hover:bg-slate-700">+</button>
                     </div>
                   </div>
                 </div>

                 <div className="flex flex-row gap-2 mt-2">
                   <button onClick={() => moves.skipTrade()} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold uppercase text-[10px] rounded transition-colors border border-slate-700">Bỏ Qua</button>
                   <button disabled={isB2BShortage} onClick={() => {
                      const tokens = {};
                      if(tradeState.offer !== 'none') tokens[tradeState.offer] = (tokens[tradeState.offer] || 0) + 1;
                      if(tradeState.request !== 'none') tokens[tradeState.request] = (tokens[tradeState.request] || 0) + 1;
                      setPendingConfirmation({
                        type: 'executeTrade',
                        payload: { partnerId: tradeState.partnerId, tokens, price: tradeState.price }
                      });
                   }} className="flex-[2] py-2 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold uppercase text-[10px] rounded shadow-sm border border-emerald-500/50 disabled:border-slate-700 transition-all">Gửi Đề Nghị</button>
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
                className="w-full p-3 bg-gradient-to-r from-cyan-900/80 to-slate-900 hover:from-cyan-800 hover:to-slate-800 disabled:from-slate-900 disabled:to-slate-950 text-cyan-100 disabled:text-slate-500 rounded-xl shadow-md border border-cyan-700/30 hover:border-cyan-500/50 disabled:border-slate-800 transition-all text-left group backdrop-blur-sm"
              >
                 <div className="flex items-center gap-3">
                   <div className="bg-cyan-950 p-2 rounded-lg border border-cyan-800/50 group-hover:scale-110 transition-transform"><span className="text-xl">🚀</span></div>
                   <div className="flex-1">
                     <h3 className="font-bold uppercase tracking-wider text-sm">Hội Nhập Lên Vòng 2 (ASEAN)</h3>
                     <p className="text-[9px] text-cyan-400/80 font-semibold uppercase mt-0.5">Chi phí: 5 Tư bản 📈 + 2 Chính sách 📜</p>
                     {isBanned && <p className="text-[10px] font-bold text-red-400 uppercase mt-0.5 animate-pulse">Đang bị cấm nâng cấp</p>}
                     {!canUpgradeV2 && !isBanned && <p className="text-[10px] font-bold text-rose-400 uppercase mt-0.5">Thiếu điều kiện hội nhập</p>}
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
                className="w-full p-3 bg-gradient-to-r from-cyan-900/80 to-slate-900 hover:from-cyan-800 hover:to-slate-800 disabled:from-slate-900 disabled:to-slate-950 text-cyan-100 disabled:text-slate-500 rounded-xl shadow-md border border-cyan-700/30 hover:border-cyan-500/50 disabled:border-slate-800 transition-all text-left group backdrop-blur-sm"
              >
                 <div className="flex items-center gap-3">
                   <div className="bg-cyan-950 p-2 rounded-lg border border-cyan-800/50 group-hover:scale-110 transition-transform"><span className="text-xl">🚀</span></div>
                   <div className="flex-1">
                     <h3 className="font-bold uppercase tracking-wider text-sm">Hội Nhập Lên Vòng 3 (Toàn Cầu)</h3>
                     <p className="text-[9px] text-cyan-400/80 font-semibold uppercase mt-0.5">Chi phí: 10 Tư bản 📈 + 3 Chính sách 📜</p>
                     {isBanned && <p className="text-[10px] font-bold text-red-400 uppercase mt-0.5 animate-pulse">Đang bị cấm nâng cấp</p>}
                     {!canUpgradeV3 && !isBanned && <p className="text-[10px] font-bold text-rose-400 uppercase mt-0.5">Thiếu điều kiện hội nhập</p>}
                   </div>
                 </div>
              </button>
            )}

            {p.ring === 3 && (
              <div className="w-full p-3 bg-slate-900/80 rounded-xl shadow-md border border-amber-500/30 text-center flex items-center justify-center gap-2 backdrop-blur-sm">
                 <span className="text-lg animate-pulse">🌟</span>
                 <h3 className="font-bold uppercase tracking-wider text-amber-400 text-sm">Đã vào Thị Trường Toàn Cầu</h3>
                 <span className="text-lg animate-pulse">🌟</span>
              </div>
            )}
            
            <button 
              disabled={p.capitalPoints < (p.faction === 'Khối FDI' ? 4 : 3)}
              onClick={() => { 
                moves.buySocialPoints(); 
                showAlert('Mua Điểm Xã Hội thành công! Uy tín của bạn đã tăng lên.'); 
              }} 
              className="w-full p-3 bg-gradient-to-r from-pink-900/80 to-slate-900 hover:from-pink-800 hover:to-slate-800 disabled:from-slate-900 disabled:to-slate-950 text-pink-100 disabled:text-slate-500 rounded-xl shadow-md border border-pink-700/30 hover:border-pink-500/50 disabled:border-slate-800 transition-all text-left group backdrop-blur-sm"
            >
               <div className="flex items-center gap-3">
                 <div className="bg-pink-950 p-2 rounded-lg border border-pink-800/50 group-hover:scale-110 transition-transform"><span className="text-xl">❤️</span></div>
                 <div>
                   <h3 className="font-bold uppercase tracking-wider text-sm">Mua Điểm Xã Hội</h3>
                   <p className="text-[9px] text-pink-400/80 font-semibold uppercase mt-0.5">Chi phí: {p.faction === 'Khối FDI' ? '4' : '3'} Tư bản 📈</p>
                   {p.capitalPoints < (p.faction === 'Khối FDI' ? 4 : 3) && <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Thiếu Điểm Tư Bản</p>}
                 </div>
               </div>
            </button>

            {!tradeForm ? (
               <button onClick={() => setTradeForm(true)} className="w-full p-3 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl shadow-md border border-amber-600/30 hover:border-amber-500/60 transition-all flex items-center justify-center gap-2 group relative overflow-hidden backdrop-blur-sm">
                 <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <span className="text-xl group-hover:scale-110 transition-transform">🤝</span>
                 <span className="font-bold text-sm uppercase tracking-wider text-amber-500">Liên Doanh / Giao Dịch</span>
               </button>
            ) : (
               <div className="w-full p-3 bg-slate-900/90 rounded-xl shadow-md border border-amber-500/30 flex flex-col gap-2 animate-fade-in backdrop-blur-sm">
                 <div className="text-center border-b border-slate-700/50 pb-1">
                   <h3 className="font-bold uppercase tracking-wider text-amber-400 text-xs">Liên Doanh Giao Dịch</h3>
                   <p className="text-[9px] text-slate-400 mt-0.5">Đổi 1 Token lấy 1 Token. HTX có quyền lợi thêm.</p>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <label className="text-[9px] font-semibold text-slate-400 uppercase whitespace-nowrap">Đối Tác:</label>
                   <select value={currentPartnerId} onChange={e => setTradeState({...tradeState, partnerId: e.target.value})} className="flex-1 bg-slate-950 border border-slate-700 rounded p-1 text-slate-200 text-xs outline-none focus:border-amber-500">
                     {availablePartners.map(id => (
                       <option key={id} value={id}>P{parseInt(id)+1}: {G.players[id].faction}</option>
                     ))}
                   </select>
                 </div>
                 
                 <div className="flex gap-2">
                   <div className="flex-1 flex flex-col gap-0.5">
                     <label className="text-[9px] font-semibold text-slate-400 uppercase">Đưa ra:</label>
                     <select value={tradeState.offer} onChange={e => setTradeState({...tradeState, offer: e.target.value})} className={`w-full bg-slate-950 border ${isGenericShortage ? 'border-red-500/50' : 'border-slate-700'} rounded p-1 text-slate-200 text-xs outline-none focus:border-amber-500`}>
                       <option value="capital">1 Vốn</option>
                       <option value="labor">1 Lao động</option>
                       <option value="tech">1 Công nghệ</option>
                       <option value="policy">1 Chính sách</option>
                     </select>
                   </div>
                   <div className="flex-1 flex flex-col gap-0.5">
                     <label className="text-[9px] font-semibold text-slate-400 uppercase">Yêu cầu:</label>
                     <select value={tradeState.request} onChange={e => setTradeState({...tradeState, request: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-slate-200 text-xs outline-none focus:border-amber-500">
                       <option value="capital">1 Vốn</option>
                       <option value="labor">1 Lao động</option>
                       <option value="tech">1 Công nghệ</option>
                       <option value="policy">1 Chính sách</option>
                     </select>
                   </div>
                 </div>
                 
                 {isGenericShortage && <p className="text-red-400 text-[10px] font-bold text-center mt-0.5 animate-pulse">⚠️ Không đủ tài nguyên!</p>}

                 <div className="flex gap-2 mt-1">
                   <button onClick={() => setTradeForm(false)} className="flex-1 py-1.5 bg-slate-800 text-slate-400 font-semibold uppercase text-[10px] rounded hover:bg-slate-700 transition-colors">Hủy</button>
                   <button disabled={isGenericShortage} onClick={() => {
                      setPendingConfirmation({
                        type: 'trade',
                        payload: { partnerId: currentPartnerId, offer: { [currentOffer]: 1 }, request: { [tradeState.request]: 1 } }
                      });
                      setTradeForm(false);
                   }} className="flex-1 py-1.5 bg-amber-600/90 text-white font-semibold uppercase text-[10px] rounded shadow-sm disabled:opacity-50 disabled:bg-slate-700 hover:bg-amber-500 transition-colors">Gửi Lời Mời</button>
                 </div>
               </div>
            )}

            <div className="mt-1">
               <button onClick={() => moves.endTurn()} className="w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-300 rounded-xl shadow-md border border-slate-700 hover:border-slate-500 transition-all font-bold text-sm uppercase tracking-widest text-center">
                 🛑 KẾT THÚC LƯỢT
               </button>
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative z-20">
      <div className="text-center py-1 mb-2 bg-amber-900/50 rounded-lg border border-amber-700/50">
        <h2 className="text-sm font-black text-amber-200 tracking-widest uppercase drop-shadow-sm">
          {getHeader()}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto relative">
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-slate-800 border-4 border-amber-500 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.6)] p-6 flex flex-col gap-5 relative">
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
        </div>
      )}
    </div>
  );
};
