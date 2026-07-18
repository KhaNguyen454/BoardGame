import React, { useState } from 'react';
import { EVENT_DECK } from '../../game/constants/events';
import { CLASS_STRUGGLE_DECK } from '../../game/constants/classStruggle';
import { BOSS_DECK } from '../../game/constants/bosses';
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
        <div className="sticky top-0 bg-slate-900 py-4 z-10 flex flex-col items-center gap-2 border-b border-slate-700 mb-4">
          <button onClick={() => setSelectedDeck(null)} className="absolute left-0 top-4 text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 hover:border-slate-500">
            <span>←</span> TRỞ VỀ
          </button>
          <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-widest ${colorClass.split(' ')[0]}`}>{title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, idx) => (
            <div key={card.id || idx} className={`bg-slate-800/80 p-5 rounded-xl border ${colorClass.split(' ')[1]} shadow-lg flex flex-col gap-2`}>
              <h3 className={`text-lg font-bold ${colorClass.split(' ')[0]}`}>{card.name}</h3>
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
          <div className="flex flex-col gap-4 text-slate-200 overflow-y-auto max-h-[70vh] pr-2">
            <h2 className="text-3xl font-black text-amber-400 uppercase tracking-widest text-center mb-6 sticky top-0 bg-slate-900 py-2 z-10">Hướng Dẫn Cách Chơi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-600 shadow-lg">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">Các Giai Đoạn Trong Lượt</h3>
                <ul className="list-disc list-inside space-y-3">
                  <li><strong className="text-white">Thu Hút Nguồn Lực:</strong> Đổ xúc xắc để nhận tài nguyên.</li>
                  <li><strong className="text-white">Sản Xuất:</strong> Chọn Bền Vững (an toàn) hoặc Bóc Lột (rủi ro).</li>
                  <li><strong className="text-white">Sự Kiện:</strong> Rút thẻ Sự Kiện hoặc đối mặt với Boss.</li>
                  <li><strong className="text-white">Hành Động:</strong> Trả tài nguyên để nâng cấp vòng tròn Hội nhập.</li>
                </ul>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-600 shadow-lg">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Điều Kiện Chiến Thắng</h3>
                <p className="mb-2">Người chiến thắng là người sống sót sau các đợt khủng hoảng, tối đa hóa cả <strong className="text-white">Điểm Tư Bản</strong> và <strong className="text-white">Điểm Xã Hội</strong>.</p>
                <p className="mb-4">Tiến vào các vòng trong (ASEAN, Toàn Cầu) sẽ mở khóa thêm nhiều token thưởng và cơ hội đặc quyền.</p>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-xl border border-rose-500 shadow-lg md:col-span-2">
                <h3 className="text-xl font-bold text-rose-400 mb-4">Cơ Chế Phá Sản & Nợ Nần</h3>
                <p className="mb-2">Người chơi sẽ lập tức bị <strong className="text-red-400">PHÁ SẢN</strong> và loại khỏi trò chơi nếu rơi vào một trong hai trường hợp:</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong className="text-white">Âm tài nguyên quá mức:</strong> Bất kỳ Token nào (Tư bản, Lao động, Công nghệ, Chính sách) giảm xuống dưới <strong className="text-red-400">-5</strong>.</li>
                  <li><strong className="text-white">Khủng hoảng Tư bản:</strong> Điểm Tư Bản (C.Points) giảm xuống dưới <strong className="text-red-400">0</strong>.</li>
                </ul>
                <p className="text-sm text-slate-400 italic">Mẹo: Đừng lạm dụng Sản xuất Bóc lột nếu bạn không có đủ Điểm Xã hội để gánh chịu thẻ Đấu Tranh Giai Cấp.</p>
              </div>
            </div>
          </div>
        );
      case 'DECKS':
        if (selectedDeck) return renderDeckCards();
        return (
          <div className="flex flex-col gap-4 text-slate-200 overflow-y-auto max-h-[70vh] pr-2">
            <h2 className="text-3xl font-black text-amber-400 uppercase tracking-widest text-center mb-6 sticky top-0 bg-slate-900 py-2 z-10">Bộ Bài Trong Game</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <button onClick={() => setSelectedDeck('REWARD')} className="bg-slate-800/80 p-6 rounded-xl border border-emerald-500 hover:bg-emerald-900/30 transition-colors shadow-lg flex flex-col items-center text-center group cursor-pointer text-left">
                <h3 className="text-xl font-black text-emerald-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform">🌟 Cơ Hội</h3>
                <p className="text-sm text-slate-300">Thưởng tài nguyên, buff lợi thế, hỗ trợ nâng cấp miễn phí.</p>
                <span className="mt-4 text-xs font-bold text-emerald-500 bg-emerald-950 px-2 py-1 rounded-full border border-emerald-900">Bấm để xem lá bài</span>
              </button>
              <button onClick={() => setSelectedDeck('PENALTY')} className="bg-slate-800/80 p-6 rounded-xl border border-rose-500 hover:bg-rose-900/30 transition-colors shadow-lg flex flex-col items-center text-center group cursor-pointer text-left">
                <h3 className="text-xl font-black text-rose-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform">⚠️ Rủi Ro</h3>
                <p className="text-sm text-slate-300">Phạt tài nguyên, trừ điểm Tư bản/Xã hội (thuộc bộ Hội nhập).</p>
                <span className="mt-4 text-xs font-bold text-rose-500 bg-rose-950 px-2 py-1 rounded-full border border-rose-900">Bấm để xem lá bài</span>
              </button>
              <button onClick={() => setSelectedDeck('TRADE')} className="bg-slate-800/80 p-6 rounded-xl border border-blue-500 hover:bg-blue-900/30 transition-colors shadow-lg flex flex-col items-center text-center group cursor-pointer text-left">
                <h3 className="text-xl font-black text-blue-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform">🤝 Tương Tác</h3>
                <p className="text-sm text-slate-300">Các lá bài bắt buộc giao dịch hoặc cướp đoạt giữa các người chơi.</p>
                <span className="mt-4 text-xs font-bold text-blue-500 bg-blue-950 px-2 py-1 rounded-full border border-blue-900">Bấm để xem lá bài</span>
              </button>
              <button onClick={() => setSelectedDeck('STRUGGLE')} className="bg-slate-800/80 p-6 rounded-xl border border-orange-500 hover:bg-orange-900/30 transition-colors shadow-lg flex flex-col items-center text-center group cursor-pointer text-left md:col-start-1 md:col-end-3 lg:col-auto lg:col-span-1">
                <h3 className="text-xl font-black text-orange-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform">✊ Đấu Tranh</h3>
                <p className="text-sm text-slate-300">Thẻ phạt cực nặng áp dụng riêng khi bạn chọn 'Sản xuất Bóc lột'.</p>
                <span className="mt-4 text-xs font-bold text-orange-500 bg-orange-950 px-2 py-1 rounded-full border border-orange-900">Bấm để xem lá bài</span>
              </button>
              <button onClick={() => setSelectedDeck('BOSS')} className="bg-slate-800/80 p-6 rounded-xl border-4 border-purple-600 hover:bg-purple-900/30 transition-colors shadow-[0_0_20px_rgba(147,51,234,0.3)] flex flex-col items-center text-center group cursor-pointer text-left md:col-span-2">
                <h3 className="text-xl font-black text-purple-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform">💀 Boss Độc Quyền</h3>
                <p className="text-sm text-slate-300">Thử thách cực đại ở Vòng 3. Yêu cầu toàn máy chủ hợp tác hoặc cạnh tranh để không bị vỡ nợ hàng loạt.</p>
                <span className="mt-4 text-xs font-bold text-purple-500 bg-purple-950 px-2 py-1 rounded-full border border-purple-900">Bấm để xem lá bài</span>
              </button>
            </div>
          </div>
        );
      case 'ROLES':
        return (
          <div className="flex flex-col gap-4 text-slate-200 overflow-y-auto max-h-[70vh] pr-2">
            <h2 className="text-3xl font-black text-amber-400 uppercase tracking-widest text-center mb-6 sticky top-0 bg-slate-900 py-2 z-10">Vai Trò Người Chơi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/80 p-6 rounded-xl border-l-8 border-red-500 shadow-lg">
                <h3 className="text-xl font-black text-red-400 mb-2 uppercase tracking-wide">Doanh Nghiệp Nhà Nước</h3>
                <p className="text-sm mb-4">Nhận được sự bảo hộ của Chính phủ, thuận lợi trong việc áp đặt luật lệ.</p>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-700 text-center text-sm font-bold text-amber-300">
                  Khởi điểm: 1 💰 | 1 👷 | 0 💻 | 3 📜
                </div>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-xl border-l-8 border-blue-500 shadow-lg">
                <h3 className="text-xl font-black text-blue-400 mb-2 uppercase tracking-wide">Kinh Tế Tư Nhân</h3>
                <p className="text-sm mb-4">Nhanh nhẹn và linh hoạt, có khả năng sinh lời Tư bản vượt trội.</p>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-700 text-center text-sm font-bold text-amber-300">
                  Khởi điểm: 3 💰 | 2 👷 | 0 💻 | 0 📜
                </div>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-xl border-l-8 border-orange-500 shadow-lg">
                <h3 className="text-xl font-black text-orange-400 mb-2 uppercase tracking-wide">Khối FDI</h3>
                <p className="text-sm mb-4">Dồi dào sức mạnh Công nghệ, dễ dàng vươn ra thị trường quốc tế.</p>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-700 text-center text-sm font-bold text-amber-300">
                  Khởi điểm: 2 💰 | 0 👷 | 3 💻 | 0 📜
                </div>
              </div>
              <div className="bg-slate-800/80 p-6 rounded-xl border-l-8 border-emerald-500 shadow-lg">
                <h3 className="text-xl font-black text-emerald-400 mb-2 uppercase tracking-wide">Kinh Tế Tập Thể / HTX</h3>
                <p className="text-sm mb-4">Lợi thế Điểm Xã hội khổng lồ, luôn được cộng đồng ủng hộ.</p>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-700 text-center text-sm font-bold text-amber-300">
                  Khởi điểm: 1 💰 | 3 👷 | 0 💻 | 1 📜
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
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 font-sans text-slate-100 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-950/90 pointer-events-none"></div>
      
      {/* Khối Nội dung chính */}
      <div className="z-10 flex flex-col items-center gap-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)] tracking-widest uppercase mb-4">
            Đường Đến Thị Trường
          </h1>
          <p className="text-xl text-blue-300 font-bold uppercase tracking-[0.3em]">Bản Sắc & Cạnh Tranh</p>
        </div>

        <button 
          onClick={onStart}
          className="w-80 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-xl rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.5)] border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1 transition-all"
        >
          BẮT ĐẦU
        </button>

        <button 
          onClick={() => setShowModal('TUTORIAL')}
          className="w-80 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest text-sm rounded-xl border border-slate-600 transition-colors shadow-lg"
        >
          Hướng Dẫn Cách Chơi
        </button>

        <button 
          onClick={() => setShowModal('DECKS')}
          className="w-80 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest text-sm rounded-xl border border-slate-600 transition-colors shadow-lg"
        >
          Bộ Bài Trong Game
        </button>

        <button 
          onClick={() => setShowModal('ROLES')}
          className="w-80 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest text-sm rounded-xl border border-slate-600 transition-colors shadow-lg"
        >
          Vai Trò Người Chơi
        </button>
      </div>

      {/* Full-screen Overlay Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            
            {renderModalContent()}

            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => {
                  setShowModal(null);
                  setSelectedDeck(null);
                }}
                className="px-12 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-widest text-lg rounded-xl border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
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
