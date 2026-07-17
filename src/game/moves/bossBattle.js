import { INVALID_MOVE } from 'boardgame.io/core';

export const contributeTokens = ({ G, ctx, events }, contribution) => {
  const p = G.players[ctx.playerID];
  
  // Validate số lượng
  for (let k of Object.keys(contribution)) {
    if (p.resources[k] < contribution[k]) return INVALID_MOVE;
  }
  // Trừ tài nguyên
  for (let k of Object.keys(contribution)) {
    p.resources[k] -= contribution[k];
    G.bossContributions[ctx.playerID][k] += contribution[k];
  }
  
  G.playersContributed += 1;
  
  // Kiểm tra tổng thu sau khi cả 4 người đã đóng góp
  if (G.playersContributed === 4) {
    let isSuccess = true;
    const req = G.activeBoss.cost;
    let totalGom = { policy: 0, capital: 0, labor: 0, tech: 0 };
    
    for (let i = 0; i < 4; i++) {
       for (let k of Object.keys(totalGom)) {
          totalGom[k] += G.bossContributions[i][k];
       }
    }
    
    // Cân đo đong đếm so với Cost * 4
    for (let k of Object.keys(req)) {
       if (totalGom[k] < req[k] * 4) isSuccess = false;
    }
    
    // --- XỬ LÝ KẾT QUẢ BOSS THEO LOGIC ĐỘNG (REWARD/PENALTY) ---
    if (isSuccess) {
       const rw = G.activeBoss.reward;
       switch(rw.type) {
         case 'social_and_capital':
           for (let i = 0; i < 4; i++) {
             G.players[i].socialPoints += rw.socialAmount;
             G.players[i].capitalPoints += rw.capitalAmount;
           }
           break;
         case 'social_and_tech':
           for (let i = 0; i < 4; i++) {
             G.players[i].socialPoints += rw.socialAmount;
             G.players[i].resources.tech += rw.techAmount;
           }
           break;
         case 'split_8_capital':
           for (let i = 0; i < 4; i++) {
             G.players[i].capitalPoints += 2; // 8/4 = 2 mỗi người
           }
           break;
       }
    } else {
       const pn = G.activeBoss.penalty;
       switch(pn.type) {
         case 'downgrade_and_minus_capital':
           for (let i = 0; i < 4; i++) {
             if (G.players[i].ring >= 2) {
               G.players[i].ring = 1;
               G.players[i].capitalPoints -= pn.capAmount;
             }
           }
           break;
         case 'ban_upgrade_2_turns':
           for (let i = 0; i < 4; i++) {
             G.upgradeBan[i] += 2;
           }
           break;
         case 'minus_capital_only':
           for (let i = 0; i < 4; i++) {
             G.players[i].capitalPoints -= pn.capAmount;
           }
           break;
       }
    }
    
    // Clean up state
    G.activeBoss = null;
    G.bossContributions = {};
    G.playersContributed = 0;
    events.setActivePlayers({ currentPlayer: 'actions' });
  } else {
    events.endStage(); 
  }
};
