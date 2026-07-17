import { EVENT_DECK } from '../constants/events';
import { BOSS_DECK } from '../constants/bosses';

export const resolveEvent = ({ G, ctx, events, random }) => {
  const p = G.players[ctx.currentPlayer];
  let currentDeck = [...EVENT_DECK];
  
  // Cơ chế ghép Boss: Kiểm tra nếu có người ở Vòng 3
  let isBossActive = Object.values(G.players).some(player => player.ring === 3);
  if (isBossActive) {
    currentDeck.push(
      { ...BOSS_DECK[0], isBoss: true },
      { ...BOSS_DECK[0], isBoss: true },
      { ...BOSS_DECK[1], isBoss: true },
      { ...BOSS_DECK[1], isBoss: true },
      { ...BOSS_DECK[2], isBoss: true }
    );
  }
  
  // Random thẻ từ bộ bài hỗn hợp (Event + Boss)
  const randomIndex = Math.floor(random.Number() * currentDeck.length);
  const drawnCard = currentDeck[randomIndex];
  
  // ======== NẾU LÀ TRÙM CUỐI (BOSS) ========
  if (drawnCard.isBoss) {
    G.activeBoss = drawnCard;
    G.bossContributions = {
      '0': { policy: 0, capital: 0, labor: 0, tech: 0 },
      '1': { policy: 0, capital: 0, labor: 0, tech: 0 },
      '2': { policy: 0, capital: 0, labor: 0, tech: 0 },
      '3': { policy: 0, capital: 0, labor: 0, tech: 0 },
    };
    G.playersContributed = 0;
    events.setActivePlayers({ all: 'bossBattle', minMoves: 1, maxMoves: 1 });
    return;
  }
  
  // ======== NẾU LÀ SỰ KIỆN THÔNG THƯỜNG ========
  let requiresInteractiveStage = false;

  switch(drawnCard.type) {
    // --- Cơ hội ---
    case 'global_reward_ring1':
      for (let i = 0; i < 4; i++) {
        if (G.players[i].ring === 1) G.players[i].resources.capital += drawnCard.amount;
      }
      break;
    case 'reward_tech':
      p.resources.tech += p.faction === 'Khối FDI' ? drawnCard.fdiBonus : drawnCard.amount;
      break;
    case 'global_reward_capital_ring23':
      for (let i = 0; i < 4; i++) {
        if (G.players[i].ring >= 2) G.players[i].resources.capital += drawnCard.amount;
      }
      break;
    case 'reward_highest_social':
      let maxSoc = -1;
      let winners = [];
      for (let i = 0; i < 4; i++) {
        if (G.players[i].socialPoints > maxSoc) { maxSoc = G.players[i].socialPoints; winners = [i]; }
        else if (G.players[i].socialPoints === maxSoc) winners.push(i);
      }
      if (winners.includes(parseInt(ctx.currentPlayer))) {
        p.capitalPoints += 1;
        p.resources.policy += 1; 
      }
      break;
    case 'reward_tech_and_conditional_capital':
      p.resources.tech += 1;
      if (p.resources.labor >= 2) p.resources.capital += 2;
      break;
      
    // --- Rủi ro ---
    case 'global_penalty_capital':
      for (let i = 0; i < 4; i++) {
        if (G.players[i].resources.capital >= 1) G.players[i].resources.capital -= 1;
        else G.players[i].capitalPoints -= 2; 
      }
      break;
    case 'penalty_discard_tokens':
      p.resources.tech = Math.max(0, p.resources.tech - 1);
      p.resources.labor = Math.max(0, p.resources.labor - 1);
      break;
    case 'penalty_policy_or_social':
      if (p.resources.policy >= 1) p.resources.policy -= 1;
      else p.socialPoints = Math.max(0, p.socialPoints - 2);
      break;
    case 'penalty_social_and_capital':
      p.socialPoints = Math.max(0, p.socialPoints - 1);
      p.capitalPoints -= 2;
      break;
      
    // --- Tương tác (Yêu cầu Stage đặc biệt) ---
    case 'trade_sell_tokens':
    case 'trade_buy_service':
      G.pendingTradeEvent = drawnCard.type;
      requiresInteractiveStage = true;
      break;
  }
  
  // Flow Control sau thẻ Sự kiện
  if (requiresInteractiveStage) {
    events.setStage('interactiveTrade');
  } else {
    G.lastEvent = drawnCard;
  }
};

export const confirmEvent = ({ G, ctx, events }) => {
  G.lastEvent = null;
  if (G.skipActionStage[ctx.currentPlayer]) {
    G.skipActionStage[ctx.currentPlayer] = false;
    events.endTurn();
  } else {
    events.setStage('actions');
  }
};
