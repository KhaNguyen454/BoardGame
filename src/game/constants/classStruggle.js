export const CLASS_STRUGGLE_DECK = [
  { id: 'cs1', name: 'Đình công đòi quyền lợi', effect: 'lose_turn' },
  { id: 'cs2', name: 'Khủng hoảng truyền thông', effect: 'minus_social', amount: 2 },
  { id: 'cs3', name: 'Sản phẩm lỗi hàng loạt', effect: 'minus_capital', amount: 3 },
  { id: 'cs4', name: 'Chảy máu chất xám', effect: 'minus_labor', amount: 2 },
  { id: 'cs5', name: 'Quá tải quy trình thủ công', effect: 'minus_labor_and_capital', laborAmount: 1, capitalAmount: 1 },
  { id: 'cs6', name: 'Trốn tránh tuân thủ pháp lý', effect: 'minus_policy_or_ban_upgrade', amount: 2 },
  { id: 'cs7', name: 'Công đoàn thương lượng', effect: 'minus_policy_or_lose_turn', amount: 1 }
];
