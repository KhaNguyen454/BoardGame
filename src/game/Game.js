import { FACTIONS_SETUP } from './constants/factions';
import { roll } from './moves/rollDice';
import { produceResources } from './moves/produce';
import { resolveEvent } from './moves/marketEvent';
import { contributeTokens } from './moves/bossBattle';
import { upgradeRing, buySocialPoints, trade, endTurn, executeTrade, skipTrade } from './moves/actions';
import { confirmRoll } from './moves/rollDice';
import { confirmEvent } from './moves/marketEvent';

export const DuongDenThiTruong = {
  name: 'duong-den-thi-truong',
  
  setup: ({ ctx }) => {
    let players = {};
    for (let i = 0; i < 4; i++) {
      players[i] = {
        faction: FACTIONS_SETUP[i].name,
        ring: 1,
        capitalPoints: 0,
        socialPoints: 0,
        resources: { ...FACTIONS_SETUP[i].resources },
      };
    }

    return {
      players,
      skipActionStage: {},
      upgradeBan: { '0': 0, '1': 0, '2': 0, '3': 0 },
      pendingTradeEvent: null,
      lastRoll: null,
      lastEvent: null,
      
      activeBoss: null,
      bossContributions: {},
      playersContributed: 0,
    };
  },

  turn: {
    activePlayers: { currentPlayer: 'rollDice' },

    stages: {
      rollDice: {
        moves: { roll, confirmRoll }
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
        if (p.capitalPoints < 0) {
          p.capitalPoints = 0;
          p.ring = 1;
          p.resources = { policy: 0, capital: 0, labor: 0, tech: 0 };
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
    for (let i = 0; i < 4; i++) {
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
