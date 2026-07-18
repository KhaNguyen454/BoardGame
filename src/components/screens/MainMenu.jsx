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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <button onClick={() => { playClick(); setSelectedDeck('REWARD'); }} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-emerald-500/50 hover:bg-emerald-900/20 hover:border-emerald-400 transition-all shadow-[0_5px_15px_rgba(16,185,129,0.15)] flex flex-col items-center text-center group cursor-pointer hover:-translate-y-1">
                <h3 className="text-xl font-black text-emerald-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform drop-shadow-sm">🌟 Cơ Hội</h3>
                <p className="text-sm text-slate-300">Thưởng tài nguyên, buff lợi thế, hỗ trợ nâng cấp miễn phí.</p>
                <span className="mt-4 text-[10px] font-bold text-emerald-300 bg-emerald-900/50 px-3 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-widest">Xem Danh Sách</span>
              </button>
              <button onClick={() => { playClick(); setSelectedDeck('PENALTY'); }} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-rose-500/50 hover:bg-rose-900/20 hover:border-rose-400 transition-all shadow-[0_5px_15px_rgba(225,29,72,0.15)] flex flex-col items-center text-center group cursor-pointer hover:-translate-y-1">
                <h3 className="text-xl font-black text-rose-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform drop-shadow-sm">⚠️ Rủi Ro</h3>
                <p className="text-sm text-slate-300">Phạt tài nguyên, trừ điểm Tư bản/Xã hội (thuộc bộ Hội nhập).</p>
                <span className="mt-4 text-[10px] font-bold text-rose-300 bg-rose-900/50 px-3 py-1.5 rounded-full border border-rose-500/30 uppercase tracking-widest">Xem Danh Sách</span>
              </button>
              <button onClick={() => { playClick(); setSelectedDeck('TRADE'); }} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-blue-500/50 hover:bg-blue-900/20 hover:border-blue-400 transition-all shadow-[0_5px_15px_rgba(59,130,246,0.15)] flex flex-col items-center text-center group cursor-pointer hover:-translate-y-1">
                <h3 className="text-xl font-black text-blue-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform drop-shadow-sm">🤝 Tương Tác</h3>
                <p className="text-sm text-slate-300">Các lá bài bắt buộc giao dịch hoặc cướp đoạt giữa các người chơi.</p>
                <span className="mt-4 text-[10px] font-bold text-blue-300 bg-blue-900/50 px-3 py-1.5 rounded-full border border-blue-500/30 uppercase tracking-widest">Xem Danh Sách</span>
              </button>
              <button onClick={() => { playClick(); setSelectedDeck('STRUGGLE'); }} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-orange-500/50 hover:bg-orange-900/20 hover:border-orange-400 transition-all shadow-[0_5px_15px_rgba(249,115,22,0.15)] flex flex-col items-center text-center group cursor-pointer hover:-translate-y-1 md:col-start-1 md:col-end-3 lg:col-auto lg:col-span-1">
                <h3 className="text-xl font-black text-orange-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform drop-shadow-sm">✊ Đấu Tranh</h3>
                <p className="text-sm text-slate-300">Thẻ phạt cực nặng áp dụng riêng khi bạn chọn 'Sản xuất Bóc lột'.</p>
                <span className="mt-4 text-[10px] font-bold text-orange-300 bg-orange-900/50 px-3 py-1.5 rounded-full border border-orange-500/30 uppercase tracking-widest">Xem Danh Sách</span>
              </button>
              <button onClick={() => { playClick(); setSelectedDeck('BOSS'); }} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-purple-500/50 hover:bg-purple-900/20 hover:border-purple-400 transition-all shadow-[0_5px_20px_rgba(168,85,247,0.2)] flex flex-col items-center text-center group cursor-pointer hover:-translate-y-1 md:col-span-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent"></div>
                <h3 className="text-xl font-black text-purple-400 mb-3 uppercase tracking-wider group-hover:scale-110 transition-transform drop-shadow-sm relative z-10">💀 Boss Độc Quyền</h3>
                <p className="text-sm text-slate-300 relative z-10">Thử thách cực đại ở Vòng 3. Yêu cầu toàn máy chủ hợp tác hoặc cạnh tranh để không bị vỡ nợ hàng loạt.</p>
                <span className="mt-4 text-[10px] font-bold text-purple-300 bg-purple-900/50 px-3 py-1.5 rounded-full border border-purple-500/30 uppercase tracking-widest relative z-10">Xem Danh Sách</span>
              </button>
            </div>
          </div>
        );
      case 'ROLES':
        return (
          <div className="flex flex-col gap-4 text-slate-200 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            <h2 className="text-3xl font-black text-amber-400 uppercase tracking-widest text-center mb-6 sticky top-0 bg-slate-900/80 backdrop-blur-md py-4 z-10 rounded-t-2xl border-b border-amber-900/30 drop-shadow-md">Vai Trò Người Chơi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-l-4 border-l-red-500 shadow-xl transition-all hover:translate-x-1">
                <h3 className="text-xl font-black text-red-400 mb-2 uppercase tracking-wide drop-shadow-sm">Doanh Nghiệp Nhà Nước</h3>
                <p className="text-sm mb-4 text-slate-300">Nhận được sự bảo hộ của Chính phủ, thuận lợi trong việc áp đặt luật lệ.</p>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 text-center text-sm font-bold text-amber-300 shadow-inner">
                  Khởi điểm: 1 💰 | 1 👷 | 0 💻 | 3 📜
                </div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-l-4 border-l-blue-500 shadow-xl transition-all hover:translate-x-1">
                <h3 className="text-xl font-black text-blue-400 mb-2 uppercase tracking-wide drop-shadow-sm">Kinh Tế Tư Nhân</h3>
                <p className="text-sm mb-4 text-slate-300">Nhanh nhẹn và linh hoạt, có khả năng sinh lời Tư bản vượt trội.</p>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 text-center text-sm font-bold text-amber-300 shadow-inner">
                  Khởi điểm: 3 💰 | 2 👷 | 0 💻 | 0 📜
                </div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-l-4 border-l-amber-500 shadow-xl transition-all hover:translate-x-1">
                <h3 className="text-xl font-black text-amber-400 mb-2 uppercase tracking-wide drop-shadow-sm">Khối FDI</h3>
                <p className="text-sm mb-4 text-slate-300">Dồi dào sức mạnh Công nghệ, dễ dàng vươn ra thị trường quốc tế.</p>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 text-center text-sm font-bold text-amber-300 shadow-inner">
                  Khởi điểm: 2 💰 | 0 👷 | 3 💻 | 0 📜
                </div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-l-4 border-l-emerald-500 shadow-xl transition-all hover:translate-x-1">
                <h3 className="text-xl font-black text-emerald-400 mb-2 uppercase tracking-wide drop-shadow-sm">Kinh Tế Tập Thể / HTX</h3>
                <p className="text-sm mb-4 text-slate-300">Lợi thế Điểm Xã hội khổng lồ, luôn được cộng đồng ủng hộ.</p>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 text-center text-sm font-bold text-amber-300 shadow-inner">
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
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black uppercase tracking-[0.2em] text-xl md:text-2xl rounded-2xl shadow-[0_15px_40px_rgba(245,158,11,0.4)] border-b-4 border-orange-900 active:border-b-0 active:translate-y-1 transition-all group relative overflow-hidden mt-4"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative z-10 drop-shadow-md">BẮT ĐẦU</span>
        </button>

        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={() => { playClick(); setShowModal('TUTORIAL'); }}
            className="w-full py-3 bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 font-bold uppercase tracking-widest text-xs md:text-sm rounded-xl border border-slate-500/30 hover:border-amber-400/50 backdrop-blur-md shadow-lg transition-all"
          >
            Hướng Dẫn Cách Chơi
          </button>

          <button 
            onClick={() => { playClick(); setShowModal('DECKS'); }}
            className="w-full py-3 bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 font-bold uppercase tracking-widest text-xs md:text-sm rounded-xl border border-slate-500/30 hover:border-amber-400/50 backdrop-blur-md shadow-lg transition-all"
          >
            Bộ Bài Trong Game
          </button>

          <button 
            onClick={() => { playClick(); setShowModal('ROLES'); }}
            className="w-full py-3 bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 font-bold uppercase tracking-widest text-xs md:text-sm rounded-xl border border-slate-500/30 hover:border-amber-400/50 backdrop-blur-md shadow-lg transition-all"
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
