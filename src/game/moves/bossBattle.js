import { INVALID_MOVE } from 'boardgame.io/core';

export const contributeTokens = ({ G, ctx, events, random }, contribution) => {
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
    
    // Lọc ra danh sách những người có đóng góp thực sự
    let contributors = [];
    for (let i = 0; i < 4; i++) {
       let totalContrib = 0;
       for (let k of Object.keys(G.bossContributions[i])) {
          totalContrib += G.bossContributions[i][k];
       }
       if (totalContrib > 0) contributors.push(i);
    }
    
    // --- XỬ LÝ KẾT QUẢ BOSS THEO LOGIC ĐỘNG (REWARD/PENALTY) ---
    if (isSuccess) {
       const rw = G.activeBoss.reward;
       switch(rw.type) {
         case 'social_and_capital':
           for (let i of contributors) {
             G.players[i].socialPoints += rw.socialAmount;
             G.players[i].capitalPoints += rw.capitalAmount;
           }
           break;
         case 'social_and_tech':
           for (let i of contributors) {
             G.players[i].socialPoints += rw.socialAmount;
             G.players[i].resources.tech += rw.techAmount;
           }
           break;
         case 'split_8_capital':
           if (contributors.length > 0) {
             const pointsEach = Math.floor(8 / contributors.length);
             for (let i of contributors) {
               G.players[i].capitalPoints += pointsEach;
             }
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
    
    // Thưởng đặc quyền HTX (nếu tham gia góp token)
    if (contributors.length > 0) {
      const hasHTX = contributors.some(id => G.players[id].faction === 'Kinh tế Tập thể / HTX');
      if (hasHTX) {
        const rTypes = ['policy', 'capital', 'labor', 'tech'];
        for (let i of contributors) {
          G.players[i].resources[rTypes[Math.floor(random.Number() * 4)]]++;
        }
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
