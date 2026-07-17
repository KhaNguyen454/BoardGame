import { INVALID_MOVE } from 'boardgame.io/core';

export const upgradeRing = ({ G, ctx }) => {
  const p = G.players[ctx.currentPlayer];
  // Khóa chốt Nâng cấp Vòng nếu đang dính Ban (Phạt của Boss/Sự kiện)
  if (G.upgradeBan[ctx.currentPlayer] > 0) return INVALID_MOVE;

  if (p.ring === 1 && p.capitalPoints >= 5 && p.resources.policy >= 2) {
    p.capitalPoints -= 5;
    p.resources.policy -= 2;
    p.ring = 2;
  } else if (p.ring === 2 && p.capitalPoints >= 10 && p.resources.policy >= 3) {
    p.capitalPoints -= 10;
    p.resources.policy -= 3;
    p.ring = 3;
  } else return INVALID_MOVE;
};

export const buySocialPoints = ({ G, ctx }) => {
  const p = G.players[ctx.currentPlayer];
  const cost = p.faction === 'Khối FDI' ? 4 : 3;
  if (p.capitalPoints >= cost) {
    p.capitalPoints -= cost;
    p.socialPoints += 1;
  } else return INVALID_MOVE;
};

export const trade = ({ G, ctx, random }, targetPlayerId, offerTokens, requestTokens) => {
  const p1 = G.players[ctx.currentPlayer];
  const p2 = G.players[targetPlayerId];
  
  Object.keys(offerTokens).forEach(k => { 
    p1.resources[k] -= offerTokens[k]; p2.resources[k] += offerTokens[k]; 
  });
  Object.keys(requestTokens).forEach(k => { 
    p2.resources[k] -= requestTokens[k]; p1.resources[k] += requestTokens[k]; 
  });
  
  if (p1.faction === 'Kinh tế Tập thể / HTX' || p2.faction === 'Kinh tế Tập thể / HTX') {
    const rTypes = ['policy', 'capital', 'labor', 'tech'];
    p1.resources[rTypes[Math.floor(random.Number() * 4)]]++;
    p2.resources[rTypes[Math.floor(random.Number() * 4)]]++;
  }
};

export const endTurn = ({ events }) => {
  events.endTurn();
};

export const executeTrade = ({ G, ctx, events }, payload) => {
  const p1 = G.players[ctx.currentPlayer];
  const p2 = G.players[payload.partnerId];

  if (G.pendingTradeEvent === 'trade_sell_tokens') {
    // p1 bán token cho p2 lấy Điểm Tư bản
    if (p2.capitalPoints < payload.price) return INVALID_MOVE;
    for (let k of Object.keys(payload.tokens)) {
      if (p1.resources[k] < payload.tokens[k]) return INVALID_MOVE;
    }
    
    // Thực thi
    for (let k of Object.keys(payload.tokens)) {
      p1.resources[k] -= payload.tokens[k];
      p2.resources[k] += payload.tokens[k];
    }
    p1.capitalPoints += payload.price;
    p2.capitalPoints -= payload.price;
  } 
  else if (G.pendingTradeEvent === 'trade_buy_service') {
    // p1 trả 2 Tư bản cho p2, nhận 2 Token từ ngân hàng
    if (p1.capitalPoints < 2) return INVALID_MOVE;
    
    p1.capitalPoints -= 2;
    p2.capitalPoints += 2;
    
    if (payload.rewardToken === 'tech') p1.resources.tech += 2;
    else if (payload.rewardToken === 'policy') p1.resources.policy += 2;
  }

  G.pendingTradeEvent = null;
  events.setStage('actions');
};

export const skipTrade = ({ G, ctx, events }) => {
  G.pendingTradeEvent = null;
  events.setStage('actions');
};
