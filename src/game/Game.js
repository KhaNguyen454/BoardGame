import { FACTIONS_SETUP, FACTION_RESOURCES } from './constants/factions';
import { roll } from './moves/rollDice';
import { produceResources } from './moves/produce';
import { resolveEvent } from './moves/marketEvent';
import { contributeTokens } from './moves/bossBattle';
import { upgradeRing, buySocialPoints, trade, endTurn, executeTrade, skipTrade } from './moves/actions';
import { confirmRoll, claimBonusTokens } from './moves/rollDice';
import { confirmEvent } from './moves/marketEvent';

export const DuongDenThiTruong = {
  name: 'duong-den-thi-truong',
  
  setup: ({ ctx }, setupData) => {
    let players = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
      let factionName = FACTIONS_SETUP[i].name;
      let playerName = `Player ${i + 1}`;
      
      if (setupData && setupData[i]) {
        factionName = setupData[i].faction || factionName;
        playerName = setupData[i].name || playerName;
      }
      
      players[i] = {
        name: playerName,
        faction: factionName,
        ring: 1,
        capitalPoints: 0,
        socialPoints: 0,
        resources: { ...(FACTION_RESOURCES[factionName] || FACTION_RESOURCES['Doanh nghiệp Nhà nước']) },
      };
    }

    return {
      players,
      skipActionStage: {},
      upgradeBan: { '0': 0, '1': 0, '2': 0, '3': 0 },
      pendingTradeEvent: null,
      lastRoll: null,
      lastEvent: null,
      lastStruggleCard: null,
      isExploiting: false,
      
      activeBoss: null,
      bossContributions: {},
      playersContributed: 0,
      bankruptcies: [],
    };
  },

  turn: {
    activePlayers: { currentPlayer: 'rollDice' },

    stages: {
      rollDice: {
        moves: { roll, confirmRoll, claimBonusTokens }
      },
      produce: {
        moves: { produceResources }
      },
      marketEvent: {
        moves: { resolveEvent, confirmEvent }
      },
      interactiveTrade: {
        moves: { executeTrade, skipTrade }
      },
      bossBattle: {
        moves: { contributeTokens }
      },
      actions: {
        moves: { upgradeRing, buySocialPoints, trade, endTurn }
      }
    },

    onMove: ({ G, ctx }) => {
      Object.keys(G.players).forEach(playerId => {
        let p = G.players[playerId];
        const isBankrupt = p.capitalPoints < 0 || p.resources.capital < -5 || p.resources.labor < -5 || p.resources.tech < -5 || p.resources.policy < -5;
        if (isBankrupt) {
          p.capitalPoints = 0;
          p.ring = 1;
          p.resources = { policy: 0, capital: 0, labor: 0, tech: 0 };
          G.bankruptcies.push({ playerId, time: Date.now() });
        }
      });
    },

    onTurnEnd: ({ G, ctx }) => {
       Object.keys(G.upgradeBan).forEach(playerId => {
          if (G.upgradeBan[playerId] > 0) {
            G.upgradeBan[playerId] -= 1;
          }
       });
    }
  },

  endIf: ({ G, ctx }) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      const p = G.players[i];
      if (
        p.capitalPoints >= 20 && 
        p.socialPoints === 10 && 
        (p.ring === 2 || p.ring === 3)
      ) {
        return { winner: i, faction: p.faction };
      }
    }
  },
};
