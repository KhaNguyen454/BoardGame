export const EVENT_DECK = [
  // --- Cơ hội ---
  { id: 'ev1', name: 'Gói Kích cầu Nội địa', type: 'global_reward_ring1', amount: 2, description: 'Chính phủ tung gói hỗ trợ. Tất cả người chơi ở Vòng 1 nhận 2 Token Tư bản.' },
  { id: 'ev2', name: 'Chuyển giao Công nghệ', type: 'reward_tech', amount: 2, fdiBonus: 3, description: 'Cơ hội số hóa. Nhận 2 Token Công nghệ (Khối FDI nhận 3 Token).' },
  { id: 'ev3', name: 'Hiệp định EVFTA', type: 'global_reward_capital_ring23', amount: 2, description: 'Mở rộng xuất khẩu. Bất kỳ ai ở Vòng 2 hoặc 3 được cộng +2 Điểm Tư bản.' },
  { id: 'ev4', name: 'Vinh danh Doanh nghiệp Xanh', type: 'reward_highest_social', description: 'Ai đang có Điểm Xã hội cao nhất được thưởng 1 Token tùy chọn và +1 Điểm Tư bản.' },
  { id: 'ev5', name: 'Số hóa quy trình vận hành', type: 'reward_tech_and_conditional_capital', description: 'Nhận ngay 1 Token Công nghệ. Nếu đang có >= 2 Token Sức lao động, cộng thêm +2 Điểm Tư bản.' },
  // --- Rủi ro ---
  { id: 'ev6', name: 'Lạm phát phi mã', type: 'global_penalty_capital', description: 'TẤT CẢ người chơi nộp 1 Token Tư bản. Ai không có bị trừ 2 Điểm Tư bản.' },
  { id: 'ev7', name: 'Khủng hoảng thừa', type: 'penalty_discard_tokens', description: 'Cung vượt quá cầu. Hủy bỏ 1 Token Công nghệ VÀ 1 Token Lao động.' },
  { id: 'ev8', name: 'Thanh tra toàn diện', type: 'penalty_policy_or_social', description: 'Nộp 1 Token Chính sách. Nếu không có, phạt -2 Điểm Xã hội.' },
  { id: 'ev9', name: 'Thất bại Định vị Thương hiệu', type: 'penalty_social_and_capital', description: 'Chiến dịch marketing thua lỗ. Bị trừ 1 Điểm Xã hội và trừ 2 Điểm Tư bản.' },
  // --- Tương tác ---
  { id: 'ev10', name: 'Kêu gọi Vốn đầu tư', type: 'trade_sell_tokens', description: 'Có thể bán tối đa 2 Token cho người chơi khác với giá tự thỏa thuận. Nếu thành công, cả hai +1 Điểm Xã hội.' },
  { id: 'ev11', name: 'Hợp đồng cung ứng B2B', type: 'trade_buy_service', description: 'Trả 2 Điểm Tư bản cho người chơi khác để thuê dịch vụ. Người rút nhận 2 Công nghệ HOẶC 2 Chính sách. Cả hai +1 Điểm Xã hội.' }
];
