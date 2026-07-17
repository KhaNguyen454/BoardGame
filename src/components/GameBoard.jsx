import React from 'react';

// Hàm tiện ích: Chuyển đổi tọa độ cực (polar) sang tọa độ Đề-các (Cartesian)
// Giúp tính toán vị trí x, y trên vòng tròn với tâm, bán kính và góc cho trước.
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  // Trừ 90 độ để góc 0 độ bắt đầu từ đỉnh hướng 12h (chính giữa phía trên)
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export const GameBoard = ({ G }) => {
  // Khai báo tọa độ tâm bàn cờ
  const center = 400;
  
  // Cấu hình 3 Vòng Thị Trường (Vẽ từ lớn đến nhỏ để các layer không đè lên nhau)
  const rings = [
    { level: 3, r: 390, fill: '#E9D5FF', stroke: '#9333EA', name: 'Vòng 3 (Quốc tế)' },   // Tím nhạt
    { level: 2, r: 270, fill: '#BFDBFE', stroke: '#2563EB', name: 'Vòng 2 (Khu vực)' },   // Xanh dương nhạt
    { level: 1, r: 150, fill: '#BBF7D0', stroke: '#16A34A', name: 'Vòng 1 (Nội địa)' },   // Xanh lá nhạt
  ];
  
  // Màu sắc phân biệt 4 phe (Đỏ, Vàng, Xanh dương, Xanh lá)
  const factionColors = {
    '0': '#EF4444', // Doanh nghiệp Nhà nước (Đỏ)
    '1': '#EAB308', // Kinh tế Tư nhân (Vàng)
    '2': '#3B82F6', // Khối FDI (Xanh dương)
    '3': '#22C55E', // Kinh tế Tập thể / HTX (Xanh lá)
  };

  // Góc chênh lệch để 4 quân cờ không đè lên nhau nếu đứng cùng 1 vòng (0, 90, 180, 270)
  const baseAngles = { '0': 0, '1': 90, '2': 180, '3': 270 };
  
  // Hàm tính toán quỹ đạo đứng của quân cờ sao cho nó nằm ngay giữa dải băng của vòng
  const getRadiusForRing = (ringLevel) => {
    if (ringLevel === 1) return 90;   // Tâm ở 0, viền Vòng 1 ở 150 -> Quỹ đạo đẹp là 90
    if (ringLevel === 2) return 210;  // Viền V1 ở 150, viền V2 ở 270 -> Quỹ đạo đẹp là 210
    if (ringLevel === 3) return 330;  // Viền V2 ở 270, viền V3 ở 390 -> Quỹ đạo đẹp là 330
    return 90; // Fallback an toàn
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
      <svg 
        viewBox="0 0 800 800" 
        className="w-full h-full drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lớp nền mờ bên ngoài vòng 3 */}
        <rect width="100%" height="100%" fill="#F9FAFB" rx="40" />

        {/* 1. VẼ 3 VÒNG ĐỒNG TÂM */}
        {rings.map((ring) => (
          <g key={`ring-${ring.level}`}>
            <circle 
              cx={center} 
              cy={center} 
              r={ring.r} 
              fill={ring.fill} 
              stroke={ring.stroke} 
              strokeWidth="6"
            />
            {/* Tên của vòng thị trường được vẽ sát viền phía trên */}
            <text 
              x={center} 
              y={center - ring.r + 35} 
              textAnchor="middle" 
              fill={ring.stroke} 
              className="text-xl font-bold uppercase tracking-widest drop-shadow-sm"
              style={{ fontFamily: 'sans-serif' }}
            >
              {ring.name}
            </text>
          </g>
        ))}

        {/* 2. VẼ TÂM BÀN CỜ (START POINT) */}
        <circle cx={center} cy={center} r="45" fill="#1F2937" stroke="#F3F4F6" strokeWidth="4" />
        <text 
          x={center} 
          y={center + 6} 
          textAnchor="middle" 
          fill="#FFF" 
          className="text-lg font-black tracking-widest"
          style={{ fontFamily: 'sans-serif' }}
        >
          START
        </text>

        {/* 3. VẼ QUÂN CỜ ĐẠI DIỆN 4 PHE */}
        {G && G.players && Object.keys(G.players).map(playerId => {
          const player = G.players[playerId];
          
          // Lấy level vòng hiện tại từ state (biến tên là 'ring' theo Game.js)
          const ringLevel = player.ring || 1; 
          
          // Tính toán tọa độ hiển thị
          const orbitRadius = getRadiusForRing(ringLevel);
          const angle = baseAngles[playerId];
          const position = polarToCartesian(center, center, orbitRadius, angle);
          
          return (
            // Animation chuyển động mượt mà khi đổi vòng
            <g 
              key={`player-${playerId}`} 
              className="transition-all duration-700 ease-in-out" 
              transform={`translate(${position.x}, ${position.y})`}
            >
              {/* Bóng đổ giả 3D dưới đáy quân cờ */}
              <circle r="24" fill="#000000" opacity="0.25" cy="5" />
              
              {/* Thân quân cờ */}
              <circle 
                r="22" 
                fill={factionColors[playerId]} 
                stroke="#FFFFFF" 
                strokeWidth="4" 
              />
              
              {/* Số hiệu Người chơi */}
              <text 
                textAnchor="middle" 
                y="6" 
                fill="#FFFFFF" 
                className="text-base font-bold pointer-events-none"
                style={{ fontFamily: 'sans-serif' }}
              >
                P{parseInt(playerId) + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
