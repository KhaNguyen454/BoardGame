import React, { useState } from 'react';
import { EVENT_DECK } from '../../game/constants/events';
import { CLASS_STRUGGLE_DECK } from '../../game/constants/classStruggle';
import { BOSS_DECK } from '../../game/constants/bosses';
import { playClick, playSuccess } from '../../utils/audio';

export const MainMenu = ({ onStart }) => {
  const [showModal, setShowModal] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);

  const renderDeckCards = () => {
    let cards = [];
    let title = "";
    let colorClass = "";
    
    if (selectedDeck === 'REWARD') {
      cards = EVENT_DECK.filter(c => c.type.includes('reward'));
      title = "🌟 Thẻ Cơ Hội";
      colorClass = "text-emerald-400 border-emerald-500";
    } else if (selectedDeck === 'PENALTY') {
      cards = EVENT_DECK.filter(c => c.type.includes('penalty'));
      title = "⚠️ Thẻ Rủi Ro";
      colorClass = "text-rose-400 border-rose-500";
    } else if (selectedDeck === 'TRADE') {
      cards = EVENT_DECK.filter(c => c.type.includes('trade'));
      title = "🤝 Thẻ Tương Tác";
      colorClass = "text-blue-400 border-blue-500";
    } else if (selectedDeck === 'STRUGGLE') {
      cards = CLASS_STRUGGLE_DECK;
      title = "✊ Thẻ Đấu Tranh";
      colorClass = "text-orange-400 border-orange-500";
    } else if (selectedDeck === 'BOSS') {
      cards = BOSS_DECK;
      title = "💀 Thẻ Boss Độc Quyền";
      colorClass = "text-purple-400 border-purple-500";
    }

    return (
      <div className="flex flex-col gap-4 text-slate-200 overflow-y-auto max-h-[70vh] pr-2">
        <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md py-4 z-10 flex flex-col items-center gap-2 border-b border-slate-700/50 mb-4 rounded-t-2xl">
          <button onClick={() => { playClick(); setSelectedDeck(null); }} className="absolute left-0 top-4 text-slate-300 hover:text-white transition-colors text-sm font-bold flex items-center gap-1 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-600 hover:border-slate-400 shadow-md">
            <span>←</span> TRỞ VỀ
          </button>
          <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-widest drop-shadow-md ${colorClass.split(' ')[0]}`}>{title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, idx) => (
            <div key={card.id || idx} className={`bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 ${colorClass.split(' ')[1]} shadow-xl flex flex-col gap-2 transition-transform hover:-translate-y-1`}>
              <h3 className={`text-lg font-bold drop-shadow-sm ${colorClass.split(' ')[0]}`}>{card.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderModalContent = () => {
    switch (showModal) {
      case 'TUTORIAL':
        return (
          <div className="flex flex-col gap-4 text-slate-200 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            <h2 className="text-3xl font-black text-amber-400 uppercase tracking-widest text-center mb-6 sticky top-0 bg-slate-900/80 backdrop-blur-md py-4 z-10 rounded-t-2xl border-b border-amber-900/30 drop-shadow-md">Hướng Dẫn Cách Chơi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/30 shadow-[0_5px_15px_rgba(79,70,229,0.15)] transition-all hover:border-indigo-500/60">
                <h3 className="text-xl font-bold text-indigo-400 mb-4 uppercase tracking-wider drop-shadow-sm">Các Giai Đoạn Trong Lượt</h3>
                <ul className="list-disc list-inside space-y-3">
                  <li><strong className="text-white">Thu Hút Nguồn Lực:</strong> Đổ xúc xắc để nhận tài nguyên.</li>
                  <li><strong className="text-white">Sản Xuất:</strong> Chọn Bền Vững (an toàn) hoặc Bóc Lột (rủi ro).</li>
                  <li><strong className="text-white">Sự Kiện:</strong> Rút thẻ Sự Kiện hoặc đối mặt với Boss.</li>
                  <li><strong className="text-white">Hành Động:</strong> Trả tài nguyên để nâng cấp vòng tròn Hội nhập.</li>
                </ul>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-emerald-500/30 shadow-[0_5px_15px_rgba(16,185,129,0.15)] transition-all hover:border-emerald-500/60">
                <h3 className="text-xl font-bold text-emerald-400 mb-4 uppercase tracking-wider drop-shadow-sm">Điều Kiện Chiến Thắng</h3>
                <p className="mb-2">Người chiến thắng là người sống sót sau các đợt khủng hoảng, tối đa hóa cả <strong className="text-emerald-300">Điểm Tư Bản</strong> và <strong className="text-emerald-300">Điểm Xã Hội</strong>.</p>
                <p className="mb-4">Tiến vào các vòng trong (ASEAN, Toàn Cầu) sẽ mở khóa thêm nhiều token thưởng và cơ hội đặc quyền.</p>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-rose-950/40 backdrop-blur-md p-6 rounded-2xl border border-rose-500/50 shadow-[0_5px_20px_rgba(225,29,72,0.2)] md:col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="text-xl font-bold text-rose-400 mb-4 uppercase tracking-wider drop-shadow-sm flex items-center gap-2">⚠️ Cơ Chế Phá Sản & Nợ Nần</h3>
                <p className="mb-2">Người chơi sẽ lập tức bị <strong className="text-red-400 font-black">PHÁ SẢN</strong> và loại khỏi trò chơi nếu rơi vào một trong hai trường hợp:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-rose-100">
                  <li><strong className="text-white">Âm tài nguyên quá mức:</strong> Bất kỳ Token nào (Tư bản, Lao động, Công nghệ, Chính sách) giảm xuống dưới <strong className="text-red-400">-5</strong>.</li>
                  <li><strong className="text-white">Khủng hoảng Tư bản:</strong> Điểm Tư Bản (C.Points) giảm xuống dưới <strong className="text-red-400">0</strong>.</li>
                </ul>
                <p className="text-sm text-rose-300/80 italic font-medium">Mẹo: Đừng lạm dụng Sản xuất Bóc lột nếu bạn không có đủ Điểm Xã hội để gánh chịu thẻ Đấu Tranh Giai Cấp.</p>
              </div>
            </div>
          </div>
        );
      case 'DECKS':
        if (selectedDeck) return renderDeckCards();
        return (
          <div className="flex flex-col gap-4 text-slate-200 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            <h2 className="text-3xl font-black text-amber-400 uppercase tracking-widest text-center mb-6 sticky top-0 bg-slate-900/80 backdrop-blur-md py-4 z-10 rounded-t-2xl border-b border-amber-900/30 drop-shadow-md">Bộ Bài Trong Game</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <button onClick={() => { playClick(); setSelectedDeck('REWARD'); }} className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/50 hover:bg-emerald-900/20 hover:border-emerald-400 transition-all shadow-[0_5px_15px_rgba(16,185,129,0.15)] flex gap-4 items-center text-left group cursor-pointer hover:-translate-y-1">
                <div className="relative shrink-0 w-[80px] h-[110px] bg-gradient-to-br from-emerald-800/90 to-emerald-950/90 rounded-lg shadow-lg border border-emerald-500/50 flex flex-col items-center justify-between p-1.5 overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="absolute inset-1 border border-white/10 rounded pointer-events-none"></div>
                  <div className="w-8 h-0.5 bg-white/20 rounded-full mt-0.5"></div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-3xl drop-shadow-md opacity-90">📈</span>
                  </div>
                  <div className="w-full bg-black/40 rounded px-1 py-1 text-center border-t border-white/10 mt-1">
                    <p className="text-[7px] font-black uppercase tracking-widest text-emerald-300 leading-tight mb-0.5">CƠ HỘI</p>
                    <p className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Đầu Tư</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-400 mb-1 uppercase tracking-wider drop-shadow-sm">Cơ Hội Đầu Tư</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">Thưởng tài nguyên, buff lợi thế, hỗ trợ nâng cấp miễn phí.</p>
                  <span className="mt-2 inline-block text-[9px] font-bold text-emerald-300 bg-emerald-900/50 px-2 py-1 rounded border border-emerald-500/30 uppercase tracking-widest">Xem Danh Sách</span>
                </div>
              </button>

              <button onClick={() => { playClick(); setSelectedDeck('PENALTY'); }} className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-rose-500/50 hover:bg-rose-900/20 hover:border-rose-400 transition-all shadow-[0_5px_15px_rgba(225,29,72,0.15)] flex gap-4 items-center text-left group cursor-pointer hover:-translate-y-1">
                <div className="relative shrink-0 w-[80px] h-[110px] bg-gradient-to-br from-rose-800/90 to-rose-950/90 rounded-lg shadow-lg border border-rose-500/50 flex flex-col items-center justify-between p-1.5 overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="absolute inset-1 border border-white/10 rounded pointer-events-none"></div>
                  <div className="w-8 h-0.5 bg-white/20 rounded-full mt-0.5"></div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-3xl drop-shadow-md opacity-90">📉</span>
                  </div>
                  <div className="w-full bg-black/40 rounded px-1 py-1 text-center border-t border-white/10 mt-1">
                    <p className="text-[7px] font-black uppercase tracking-widest text-rose-300 leading-tight mb-0.5">RỦI RO</p>
                    <p className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Thị Trường</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-rose-400 mb-1 uppercase tracking-wider drop-shadow-sm">Rủi Ro Thị Trường</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">Phạt tài nguyên, trừ điểm Tư bản/Xã hội do biến động kinh tế.</p>
                  <span className="mt-2 inline-block text-[9px] font-bold text-rose-300 bg-rose-900/50 px-2 py-1 rounded border border-rose-500/30 uppercase tracking-widest">Xem Danh Sách</span>
                </div>
              </button>

              <button onClick={() => { playClick(); setSelectedDeck('TRADE'); }} className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-blue-500/50 hover:bg-blue-900/20 hover:border-blue-400 transition-all shadow-[0_5px_15px_rgba(59,130,246,0.15)] flex gap-4 items-center text-left group cursor-pointer hover:-translate-y-1">
                <div className="relative shrink-0 w-[80px] h-[110px] bg-gradient-to-br from-blue-800/90 to-blue-950/90 rounded-lg shadow-lg border border-blue-500/50 flex flex-col items-center justify-between p-1.5 overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="absolute inset-1 border border-white/10 rounded pointer-events-none"></div>
                  <div className="w-8 h-0.5 bg-white/20 rounded-full mt-0.5"></div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-3xl drop-shadow-md opacity-90">🤝</span>
                  </div>
                  <div className="w-full bg-black/40 rounded px-1 py-1 text-center border-t border-white/10 mt-1">
                    <p className="text-[7px] font-black uppercase tracking-widest text-blue-300 leading-tight mb-0.5">ĐỐI NGOẠI</p>
                    <p className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">FDI & Hợp Tác</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-blue-400 mb-1 uppercase tracking-wider drop-shadow-sm">ĐỐI NGOẠI & FDI</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">Các lá bài tương tác, giao dịch, hợp tác hoặc cướp đoạt.</p>
                  <span className="mt-2 inline-block text-[9px] font-bold text-blue-300 bg-blue-900/50 px-2 py-1 rounded border border-blue-500/30 uppercase tracking-widest">Xem Danh Sách</span>
                </div>
              </button>

              <button onClick={() => { playClick(); setSelectedDeck('STRUGGLE'); }} className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-amber-500/50 hover:bg-amber-900/20 hover:border-amber-400 transition-all shadow-[0_5px_15px_rgba(245,158,11,0.15)] flex gap-4 items-center text-left group cursor-pointer hover:-translate-y-1">
                <div className="relative shrink-0 w-[80px] h-[110px] bg-gradient-to-br from-amber-800/90 to-amber-950/90 rounded-lg shadow-lg border border-amber-500/50 flex flex-col items-center justify-between p-1.5 overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="absolute inset-1 border border-white/10 rounded pointer-events-none"></div>
                  <div className="w-8 h-0.5 bg-white/20 rounded-full mt-0.5"></div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-3xl drop-shadow-md opacity-90">⚖️</span>
                  </div>
                  <div className="w-full bg-black/40 rounded px-1 py-1 text-center border-t border-white/10 mt-1">
                    <p className="text-[7px] font-black uppercase tracking-widest text-amber-300 leading-tight mb-0.5">CẠNH TRANH</p>
                    <p className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Thương Mại</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-amber-400 mb-1 uppercase tracking-wider drop-shadow-sm">Cạnh Tranh Thương Mại</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">Phạt nặng khi sản xuất bóc lột, gây mất cân bằng nội bộ.</p>
                  <span className="mt-2 inline-block text-[9px] font-bold text-amber-300 bg-amber-900/50 px-2 py-1 rounded border border-amber-500/30 uppercase tracking-widest">Xem Danh Sách</span>
                </div>
              </button>

              <button onClick={() => { playClick(); setSelectedDeck('BOSS'); }} className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-purple-500/50 hover:bg-purple-900/20 hover:border-purple-400 transition-all shadow-[0_5px_20px_rgba(168,85,247,0.2)] flex gap-4 items-center text-left group cursor-pointer hover:-translate-y-1 md:col-span-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent pointer-events-none"></div>
                <div className="relative shrink-0 w-[80px] h-[110px] bg-gradient-to-br from-purple-800/90 to-purple-950/90 rounded-lg shadow-lg border border-purple-500/50 flex flex-col items-center justify-between p-1.5 overflow-hidden group-hover:scale-105 transition-transform z-10">
                  <div className="absolute inset-1 border border-white/10 rounded pointer-events-none"></div>
                  <div className="w-8 h-0.5 bg-white/20 rounded-full mt-0.5"></div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-3xl drop-shadow-md opacity-90">🏛️</span>
                  </div>
                  <div className="w-full bg-black/40 rounded px-1 py-1 text-center border-t border-white/10 mt-1">
                    <p className="text-[7px] font-black uppercase tracking-widest text-purple-300 leading-tight mb-0.5">KHỦNG HOẢNG</p>
                    <p className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">Cấu Trúc</p>
                  </div>
                </div>
                <div className="z-10 flex-1">
                  <h3 className="text-xl font-black text-purple-400 mb-2 uppercase tracking-wider drop-shadow-sm flex items-center gap-2">Khủng Hoảng Cơ Cấu</h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">Thử thách cực đại ở Vòng 3. Yêu cầu toàn bộ doanh nghiệp hợp tác hoặc cạnh tranh sinh tồn.</p>
                  <span className="inline-block text-[10px] font-bold text-purple-300 bg-purple-900/80 px-3 py-1.5 rounded-md border border-purple-500/50 uppercase tracking-widest hover:bg-purple-800 transition-colors">Xem Bộ Bài Khủng Hoảng</span>
                </div>
              </button>

            </div>
          </div>
        );
      case 'ROLES':
        return (
          <div className="flex flex-col gap-4 text-slate-200 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            <h2 className="text-3xl font-black text-amber-400 uppercase tracking-widest text-center mb-2 sticky top-0 bg-slate-900/80 backdrop-blur-md py-4 z-10 rounded-t-2xl border-b border-amber-900/30 drop-shadow-md">Vai Trò Người Chơi</h2>
            <p className="text-center text-sm text-slate-400 mb-4">Chọn phe kinh tế của bạn – mỗi phe có chiến lược và điểm mạnh riêng biệt</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Doanh Nghiệp Nhà Nước */}
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl border border-red-500/30 hover:border-red-400/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(239,68,68,0.25)] cursor-default min-h-[200px]">
                {/* Background image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800')" }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-red-950/80 to-red-900/30"></div>
                {/* Tinted top-left accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-400 to-red-700"></div>
                
                {/* Content */}
                <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-red-800/80 border border-red-500/50 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">🏛️</div>
                      <div>
                        <h3 className="text-lg font-black text-red-300 uppercase tracking-wider leading-tight drop-shadow-lg">Doanh Nghiệp Nhà Nước</h3>
                        <span className="text-[9px] text-red-400/80 font-bold uppercase tracking-widest">State-owned Enterprise</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300/90 leading-relaxed mb-4">Nhận được sự bảo hộ của Chính phủ, thuận lợi trong việc áp đặt luật lệ và chính sách.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[9px] font-bold bg-red-900/60 border border-red-500/40 text-red-300 px-2 py-1 rounded-full backdrop-blur-sm">⚡ Mạnh: Chính Sách</span>
                      <span className="text-[9px] font-bold bg-slate-900/60 border border-slate-600/40 text-slate-400 px-2 py-1 rounded-full backdrop-blur-sm">🛡️ Kháng: Khủng Hoảng</span>
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center text-sm font-black text-amber-300 shadow-inner tracking-wider">
                      Khởi điểm: 1💰 1👷 0💻 3📜
                    </div>
                  </div>
                </div>
              </div>

              {/* Kinh Tế Tư Nhân */}
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)] cursor-default min-h-[200px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-blue-950/80 to-blue-900/30"></div>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-700"></div>
                
                <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-800/80 border border-blue-500/50 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">🏢</div>
                      <div>
                        <h3 className="text-lg font-black text-blue-300 uppercase tracking-wider leading-tight drop-shadow-lg">Kinh Tế Tư Nhân</h3>
                        <span className="text-[9px] text-blue-400/80 font-bold uppercase tracking-widest">Private Sector</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300/90 leading-relaxed mb-4">Nhanh nhẹn và linh hoạt, có khả năng sinh lời Tư bản vượt trội so với các đối thủ.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[9px] font-bold bg-blue-900/60 border border-blue-500/40 text-blue-300 px-2 py-1 rounded-full backdrop-blur-sm">⚡ Mạnh: Tư Bản</span>
                      <span className="text-[9px] font-bold bg-slate-900/60 border border-slate-600/40 text-slate-400 px-2 py-1 rounded-full backdrop-blur-sm">🚀 Cơ động nhất</span>
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center text-sm font-black text-amber-300 shadow-inner tracking-wider">
                      Khởi điểm: 3💰 2👷 0💻 0📜
                    </div>
                  </div>
                </div>
              </div>

              {/* Khối FDI */}
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 hover:border-amber-400/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(245,158,11,0.25)] cursor-default min-h-[200px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-amber-950/80 to-amber-900/30"></div>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-700"></div>
                
                <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-800/80 border border-amber-500/50 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">🌐</div>
                      <div>
                        <h3 className="text-lg font-black text-amber-300 uppercase tracking-wider leading-tight drop-shadow-lg">Khối FDI</h3>
                        <span className="text-[9px] text-amber-400/80 font-bold uppercase tracking-widest">Foreign Direct Investment</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300/90 leading-relaxed mb-4">Dồi dào sức mạnh Công nghệ, dễ dàng vươn ra thị trường quốc tế nhưng điểm Xã hội thấp.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[9px] font-bold bg-amber-900/60 border border-amber-500/40 text-amber-300 px-2 py-1 rounded-full backdrop-blur-sm">⚡ Mạnh: Công Nghệ</span>
                      <span className="text-[9px] font-bold bg-slate-900/60 border border-slate-600/40 text-slate-400 px-2 py-1 rounded-full backdrop-blur-sm">🌏 Quốc Tế</span>
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center text-sm font-black text-amber-300 shadow-inner tracking-wider">
                      Khởi điểm: 2💰 0👷 3💻 0📜
                    </div>
                  </div>
                </div>
              </div>

              {/* Kinh Tế Tập Thể / HTX */}
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(16,185,129,0.25)] cursor-default min-h-[200px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/80 to-emerald-900/30"></div>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-emerald-700"></div>
                
                <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-emerald-500/50 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">🌾</div>
                      <div>
                        <h3 className="text-lg font-black text-emerald-300 uppercase tracking-wider leading-tight drop-shadow-lg">Kinh Tế Tập Thể</h3>
                        <span className="text-[9px] text-emerald-400/80 font-bold uppercase tracking-widest">Cooperative Economy / HTX</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300/90 leading-relaxed mb-4">Lợi thế Điểm Xã hội khổng lồ, luôn được cộng đồng ủng hộ khi hợp tác.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[9px] font-bold bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 px-2 py-1 rounded-full backdrop-blur-sm">⚡ Mạnh: Lao Động</span>
                      <span className="text-[9px] font-bold bg-slate-900/60 border border-slate-600/40 text-slate-400 px-2 py-1 rounded-full backdrop-blur-sm">🤝 Điểm XH cao</span>
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-center text-sm font-black text-amber-300 shadow-inner tracking-wider">
                      Khởi điểm: 1💰 3👷 0💻 1📜
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center font-sans text-slate-100 relative overflow-hidden bg-slate-950">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/30 pointer-events-none z-0"></div>
      
      {/* Khối Nội dung chính */}
      <div className="z-10 flex flex-col items-center gap-6 w-full max-w-lg px-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 drop-shadow-[0_10px_20px_rgba(245,158,11,0.5)] tracking-widest uppercase mb-2 leading-tight py-2" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            Đường Đến<br/>Thị Trường
          </h1>
          <div className="inline-block relative mt-2">
             <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent top-1/2 -z-10"></div>
             <p className="text-base md:text-lg text-blue-200 font-bold uppercase tracking-[0.4em] px-4 bg-slate-950/80 backdrop-blur-sm rounded-full">Bản Sắc & Cạnh Tranh</p>
          </div>
        </div>

        <button 
          onClick={() => { playSuccess(); onStart(); }}
          className="w-full py-4 bg-blue-700 hover:bg-blue-600 text-white font-semibold uppercase tracking-widest text-lg md:text-xl rounded shadow-md transition-all relative overflow-hidden mt-4"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative z-10">BẮT ĐẦU</span>
        </button>

        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={() => { playClick(); setShowModal('TUTORIAL'); }}
            className="w-full py-3 bg-slate-800/60 hover:bg-slate-700 text-slate-200 font-medium uppercase tracking-wider text-xs md:text-sm rounded border border-slate-600 hover:border-blue-400/50 backdrop-blur-sm transition-all"
          >
            Hướng Dẫn Cách Chơi
          </button>

          <button 
            onClick={() => { playClick(); setShowModal('DECKS'); }}
            className="w-full py-3 bg-slate-800/60 hover:bg-slate-700 text-slate-200 font-medium uppercase tracking-wider text-xs md:text-sm rounded border border-slate-600 hover:border-blue-400/50 backdrop-blur-sm transition-all"
          >
            Bộ Bài Trong Game
          </button>

          <button 
            onClick={() => { playClick(); setShowModal('ROLES'); }}
            className="w-full py-3 bg-slate-800/60 hover:bg-slate-700 text-slate-200 font-medium uppercase tracking-wider text-xs md:text-sm rounded border border-slate-600 hover:border-blue-400/50 backdrop-blur-sm transition-all"
          >
            Vai Trò Người Chơi
          </button>
        </div>
      </div>

      {/* Full-screen Overlay Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-slate-900/90 border border-slate-600 rounded-3xl p-6 sm:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_80px_rgba(0,0,0,0.8)] relative">
            
            {renderModalContent()}

            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => {
                  setShowModal(null);
                  setSelectedDeck(null);
                }}
                className="px-10 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold uppercase tracking-wider text-sm md:text-base rounded border border-slate-600 transition-all shadow"
              >
                ĐÓNG LẠI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
