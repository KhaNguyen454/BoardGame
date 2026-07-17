export const CLASS_STRUGGLE_DECK = [
  { id: 'cs1', name: 'Đình công đòi quyền lợi', effect: 'lose_turn', description: 'Công nhân kiệt sức vì làm việc quá giờ. Dây chuyền sản xuất đình trệ. Bạn bị mất lượt đi tiếp theo.' },
  { id: 'cs2', name: 'Khủng hoảng truyền thông', effect: 'minus_social', amount: 2, description: 'Báo chí phanh phui điều kiện lao động tồi tệ. Bị trừ ngay 2 Điểm Xã hội (Nếu điểm đang là 0, trừ 3 Điểm Tư bản).' },
  { id: 'cs3', name: 'Sản phẩm lỗi hàng loạt', effect: 'minus_capital', amount: 3, description: 'Làm thủ công dẫn đến sai số lớn. Nộp phạt 3 Điểm Tư bản cho Ngân hàng.' },
  { id: 'cs4', name: 'Chảy máu chất xám', effect: 'minus_labor', amount: 2, description: 'Nhân công lành nghề bỏ sang đối thủ. Bỏ đi 2 Token Sức lao động đang có trên tay.' },
  { id: 'cs5', name: 'Quá tải quy trình thủ công', effect: 'minus_labor_and_capital', laborAmount: 1, capitalAmount: 1, description: 'Lỗi vận hành gây thiệt hại kép. Nộp phạt 1 Token Sức lao động và trừ 1 Điểm Tư bản.' },
  { id: 'cs6', name: 'Trốn tránh tuân thủ pháp lý', effect: 'minus_policy_or_ban_upgrade', amount: 2, description: 'Bị cơ quan chức năng "tuýt còi". Nộp phạt 2 Token Chính sách. Nếu không đủ, cấm nâng cấp Hội nhập trong 2 lượt tới.' },
  { id: 'cs7', name: 'Công đoàn thương lượng', effect: 'minus_policy_or_lose_turn', amount: 1, description: 'Nộp ngay 1 Token Chính sách để xoa dịu. Nếu không có, bạn bị mất 1 lượt.' }
];
