import { INVALID_MOVE } from 'boardgame.io/core';
import { CLASS_STRUGGLE_DECK } from '../constants/classStruggle';

export const produceResources = ({ G, ctx, events, random }, option = 1) => {
  const p = G.players[ctx.currentPlayer];
  
  // --- OPTION 1: SẢN XUẤT BỀN VỮNG ---
  if (option === 1) { 
    if (p.resources.capital >= 1 && p.resources.labor >= 1 && p.resources.tech >= 1) {
      p.resources.capital--; p.resources.labor--; p.resources.tech--;
      p.capitalPoints += 3;
    } else return INVALID_MOVE;
  } 
  // --- OPTION 2: SẢN XUẤT BÓC LỘT ---
  else if (option === 2) { 
    if (p.resources.capital >= 1 && p.resources.labor >= 1) {
      p.resources.capital--; p.resources.labor--;
      p.capitalPoints += 3;
      
      // Rút bài từ bộ bài CLASS_STRUGGLE_DECK
      const randomIndex = Math.floor(random.Number() * CLASS_STRUGGLE_DECK.length);
      const card = CLASS_STRUGGLE_DECK[randomIndex];
      
      // Xử lý chuẩn 7 loại Effect
      switch(card.effect) {
        case 'lose_turn':
          G.skipActionStage[ctx.currentPlayer] = true;
          break;
        case 'minus_social':
          p.socialPoints = Math.max(0, p.socialPoints - card.amount);
          break;
        case 'minus_capital':
          p.capitalPoints -= card.amount; // Cờ Phá Sản Chạm Đáy sẽ tự trigger ở onMove
          break;
        case 'minus_labor':
          p.resources.labor = Math.max(0, p.resources.labor - card.amount);
          break;
        case 'minus_labor_and_capital':
          p.resources.labor = Math.max(0, p.resources.labor - card.laborAmount);
          p.resources.capital = Math.max(0, p.resources.capital - card.capitalAmount);
          break;
        case 'minus_policy_or_ban_upgrade':
          if (p.resources.policy >= card.amount) {
            p.resources.policy -= card.amount;
          } else {
            G.upgradeBan[ctx.currentPlayer] += 2; // Cấm 2 lượt
          }
          break;
        case 'minus_policy_or_lose_turn':
          if (p.resources.policy >= card.amount) {
            p.resources.policy -= card.amount;
          } else {
            G.skipActionStage[ctx.currentPlayer] = true;
          }
          break;
      }
    } else return INVALID_MOVE;
  } 
  else return INVALID_MOVE;
  
  // Flow Control
  if (G.skipActionStage[ctx.currentPlayer]) {
    G.skipActionStage[ctx.currentPlayer] = false;
    events.endTurn();
  } else {
    events.setStage('marketEvent');
  }
};
