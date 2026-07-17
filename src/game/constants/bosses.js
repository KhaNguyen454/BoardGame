export const BOSS_DECK = [
  { 
    id: 'boss1', name: 'Vụ kiện Chống bán phá giá', 
    cost: { policy: 2, capital: 2, labor: 0, tech: 0 }, 
    reward: { type: 'social_and_capital', socialAmount: 2, capitalAmount: 3 }, 
    penalty: { type: 'downgrade_and_minus_capital', capAmount: 3 },
    description: 'Yêu cầu: 2 Chính sách + 2 Tư bản (x Số người chơi). Thắng: +2 Xã hội, +3 Tư bản. Thua: Lùi về Vòng 1, -3 Tư bản.'
  },
  { 
    id: 'boss2', name: 'Tiêu chuẩn Môi trường Khắc nghiệt', 
    cost: { policy: 2, capital: 0, labor: 0, tech: 2 }, 
    reward: { type: 'social_and_tech', socialAmount: 3, techAmount: 1 }, 
    penalty: { type: 'ban_upgrade_2_turns' },
    description: 'Yêu cầu: 2 Công nghệ + 2 Chính sách (x Số người chơi). Thắng: +3 Xã hội, +1 Công nghệ. Thua: Cấm nâng cấp Hội nhập trong 2 lượt tới.'
  },
  { 
    id: 'boss3', name: 'Thao túng Chuỗi cung ứng', 
    cost: { policy: 0, capital: 3, labor: 2, tech: 0 }, 
    reward: { type: 'split_8_capital' }, 
    penalty: { type: 'minus_capital_only', capAmount: 5 },
    description: 'Yêu cầu: 3 Tư bản + 2 Lao động (x Số người chơi). Thắng: Chia đều 8 Điểm Tư bản. Thua: Mọi người mất 5 Điểm Tư bản.'
  }
];
