import { INVALID_MOVE } from 'boardgame.io/core';

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
      G.isExploiting = true;
    } else return INVALID_MOVE;
  } 
  // --- OPTION 3: BỎ QUA ---
  else if (option === 3) {
    // Không làm gì, chỉ skip qua bước tiếp theo
  }
  else return INVALID_MOVE;
  
  // Flow Control (Cho cả option 1, 2 và 3)
  if (G.skipActionStage[ctx.currentPlayer]) {
    G.skipActionStage[ctx.currentPlayer] = false;
    events.endTurn();
  } else {
    events.setStage('marketEvent');
  }
};
