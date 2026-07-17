export const roll = ({ G, ctx, events, random }, wildcardPreferences = ['capital', 'labor', 'tech']) => {
  const p = G.players[ctx.currentPlayer];
  const d1 = random.D6();
  const d2 = random.D6();
  const sum = d1 + d2;
  
  if (sum === 3 || sum === 4) p.resources.labor++;
  else if (sum === 5 || sum === 6) p.resources.capital++;
  else if (sum === 8 || sum === 9) p.resources.tech++;
  else if (sum === 10 || sum === 11) p.resources.policy++;
  
  let wildcards = 0;
  if (sum === 7 || d1 === d2) wildcards += 2;
  if (p.ring === 2) wildcards += 1;
  else if (p.ring === 3) wildcards += 2;
  
  for(let i = 0; i < wildcards; i++) {
     const res = wildcardPreferences[i % wildcardPreferences.length] || 'capital';
     p.resources[res] = (p.resources[res] || 0) + 1;
  }
  
  events.setStage('produce');
};
