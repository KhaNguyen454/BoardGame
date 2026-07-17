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

export const executeTrade = ({ G, ctx, events }, ...args) => {
  // Logic tùy theo G.pendingTradeEvent
  G.pendingTradeEvent = null;
  events.setStage('actions');
};

export const skipTrade = ({ G, ctx, events }) => {
  G.pendingTradeEvent = null;
  events.setStage('actions');
};
