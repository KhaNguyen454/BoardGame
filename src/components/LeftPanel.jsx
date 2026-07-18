import React from 'react';

export const LeftPanel = () => {
  return (
    <div className="w-[20vw] min-w-[240px] max-w-[280px] flex-shrink-0 h-full bg-neutral-900/90 border-r-4 border-amber-700 shadow-2xl flex flex-col p-3 gap-3 overflow-y-auto custom-scrollbar">
      {/* 4 THÀNH PHẦN KINH TẾ */}
      <div className="border-2 border-amber-600 rounded-xl bg-black/40 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-900 to-amber-700 py-1 border-b border-amber-500 text-center">
          <h2 className="text-[12px] font-black text-amber-100 uppercase tracking-widest drop-shadow-md">
            4 Thành Phần Kinh Tế
          </h2>
        </div>
        <div className="p-2 flex flex-col gap-2">
          {/* Doanh Nghiệp Nhà Nước */}
          <div className="bg-red-950/60 border border-red-800 rounded p-1.5 flex gap-2 items-center">
            <div className="w-8 h-8 flex-shrink-0 bg-red-800 rounded flex items-center justify-center text-xl">🏛️</div>
            <div>
              <h3 className="text-[11px] font-bold text-red-400 uppercase">Doanh Nghiệp NN</h3>
              <p className="text-[9px] text-gray-400 leading-tight mt-0.5">Mạnh về Chính sách, khắc chế khủng hoảng tốt.</p>
            </div>
          </div>
          {/* Kinh Tế Tư Nhân */}
          <div className="bg-blue-950/60 border border-blue-800 rounded p-1.5 flex gap-2 items-center">
            <div className="w-8 h-8 flex-shrink-0 bg-blue-800 rounded flex items-center justify-center text-xl">🏢</div>
            <div>
              <h3 className="text-[11px] font-bold text-blue-400 uppercase">Kinh Tế Tư Nhân</h3>
              <p className="text-[9px] text-gray-400 leading-tight mt-0.5">Chi phí sản xuất rẻ, tích lũy vốn siêu nhanh.</p>
            </div>
          </div>
          {/* Khối Ngoại (FDI) */}
          <div className="bg-orange-950/60 border border-orange-800 rounded p-1.5 flex gap-2 items-center">
            <div className="w-8 h-8 flex-shrink-0 bg-orange-800 rounded flex items-center justify-center text-xl">🌐</div>
            <div>
              <h3 className="text-[11px] font-bold text-orange-400 uppercase">Khối Ngoại (FDI)</h3>
              <p className="text-[9px] text-gray-400 leading-tight mt-0.5">Mạnh về Công nghệ, dễ ra quốc tế nhưng điểm XH thấp.</p>
            </div>
          </div>
          {/* Kinh Tế Tập Thể (HTX) */}
          <div className="bg-emerald-950/60 border border-emerald-800 rounded p-1.5 flex gap-2 items-center">
            <div className="w-8 h-8 flex-shrink-0 bg-emerald-800 rounded flex items-center justify-center text-xl">🌾</div>
            <div>
              <h3 className="text-[11px] font-bold text-emerald-400 uppercase">Kinh Tế Tập Thể</h3>
              <p className="text-[9px] text-gray-400 leading-tight mt-0.5">Mạnh về Sức lao động, nhận thêm quà khi hợp tác.</p>
            </div>
          </div>
        </div>
      </div>

      {/* TÀI NGUYÊN */}
      <div className="border-2 border-amber-600 rounded-xl bg-black/40 overflow-hidden flex-1">
        <div className="bg-gradient-to-r from-amber-900 to-amber-700 py-1 border-b border-amber-500 text-center">
          <h2 className="text-[12px] font-black text-amber-100 uppercase tracking-widest drop-shadow-md">
            Tài Nguyên
          </h2>
        </div>
        <div className="p-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-600 border border-yellow-300 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(234,179,8,0.5)] text-black font-black">💰</div>
            <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Tư Bản (Vốn)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-700 border border-green-400 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(34,197,94,0.5)]">👷</div>
            <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Sức Lao Động</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-700 border border-blue-400 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(59,130,246,0.5)]">📜</div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Chính Sách / Pháp Lý</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-700 border border-purple-400 flex items-center justify-center text-lg shadow-[0_0_10px_rgba(168,85,247,0.5)]">💻</div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Công Nghệ</span>
          </div>
        </div>
      </div>

      {/* MỤC TIÊU CHIẾN THẮNG */}
      <div className="border-2 border-red-700 rounded-xl bg-red-950/40 overflow-hidden mt-auto">
        <div className="bg-gradient-to-r from-red-900 to-red-800 py-1 border-b border-red-500 text-center">
          <h2 className="text-[12px] font-black text-red-200 uppercase tracking-widest drop-shadow-md">
            Mục Tiêu Chiến Thắng
          </h2>
        </div>
        <div className="p-3 text-center">
          <p className="text-[10px] text-red-300 font-bold mb-2">Người đầu tiên đạt đủ:</p>
          <div className="flex justify-center items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-amber-500 bg-amber-900/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                <span className="text-xl font-black text-amber-400">20</span>
              </div>
              <span className="text-[9px] font-black text-amber-500 uppercase mt-1 text-center leading-tight">Điểm<br/>Tư Bản</span>
            </div>
            <div className="text-xl text-red-500 font-bold">+</div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 bg-emerald-900/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                <span className="text-xl font-black text-emerald-400">10</span>
              </div>
              <span className="text-[9px] font-black text-emerald-500 uppercase mt-1 text-center leading-tight">Điểm Trách<br/>Nhiệm Xã Hội</span>
            </div>
          </div>
          <p className="text-[10px] text-amber-200 font-bold mt-2 animate-pulse">đồng thời là người chiến thắng!</p>
        </div>
      </div>
    </div>
  );
};
