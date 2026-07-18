export const roll = ({ G, ctx, events, random }, wildcardPreferences = ['capital', 'labor', 'tech']) => {
  const p = G.players[ctx.currentPlayer];
  const d1 = random.D6();
  const d2 = random.D6();
  const sum = d1 + d2;
  
  const initialResources = { ...p.resources };

  if (sum === 3 || sum === 4) p.resources.labor++;
  else if (sum === 5 || sum === 6) p.resources.capital++;
  else if (sum === 8 || sum === 9) p.resources.tech++;
  else if (sum === 10 || sum === 11) p.resources.policy++;
  
  let wildcards = 0;
  if (sum === 7 || d1 === d2) wildcards += 2;
  if (p.ring === 2) wildcards += 1;
  else if (p.ring === 3) wildcards += 2;
  
  const resourcesAdded = {
    capital: p.resources.capital - initialResources.capital,
    labor: p.resources.labor - initialResources.labor,
    tech: p.resources.tech - initialResources.tech,
    policy: p.resources.policy - initialResources.policy,
  };
  
  G.lastRoll = { d1, d2, sum, resourcesAdded };
  if (wildcards > 0) {
    G.pendingBonusTokens = wildcards;
  }
};

export const claimBonusTokens = ({ G, ctx, events }, chosenTokens) => {
  const p = G.players[ctx.currentPlayer];
  p.resources.capital += (chosenTokens.capital || 0);
  p.resources.labor += (chosenTokens.labor || 0);
  p.resources.tech += (chosenTokens.tech || 0);
  p.resources.policy += (chosenTokens.policy || 0);
  
  G.pendingBonusTokens = 0;
  G.lastRoll = null;
  events.setStage('produce');
};

export const confirmRoll = ({ G, events }) => {
  G.lastRoll = null;
  events.setStage('produce');
};
