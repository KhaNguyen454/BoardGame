export const BOSS_DECK = [
  { 
    id: 'boss1', name: 'Vụ kiện Chống bán phá giá', 
    cost: { policy: 2, capital: 2, labor: 0, tech: 0 }, 
    reward: { type: 'social_and_capital', socialAmount: 2, capitalAmount: 3 }, 
    penalty: { type: 'downgrade_and_minus_capital', capAmount: 3 } 
  },
  { 
    id: 'boss2', name: 'Tiêu chuẩn Môi trường', 
    cost: { policy: 2, capital: 0, labor: 0, tech: 2 }, 
    reward: { type: 'social_and_tech', socialAmount: 3, techAmount: 1 }, 
    penalty: { type: 'ban_upgrade_2_turns' } 
  },
  { 
    id: 'boss3', name: 'Thao túng Chuỗi cung ứng', 
    cost: { policy: 0, capital: 3, labor: 2, tech: 0 }, 
    reward: { type: 'split_8_capital' }, 
    penalty: { type: 'minus_capital_only', capAmount: 5 } 
  }
];
