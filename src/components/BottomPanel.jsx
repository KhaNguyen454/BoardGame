import React from 'react';

export const BottomPanel = () => {
  return (
    <div className="h-[15vh] min-h-[120px] w-full bg-neutral-900/90 border-t-4 border-amber-700 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] flex p-2 gap-3 shrink-0">
      
      {/* LUẬT ĐẶC BIỆT */}
      <div className="flex-[1.5] border-2 border-purple-700 rounded-xl bg-purple-950/40 overflow-hidden flex flex-col relative">
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none w-32 h-32 bg-[url('https://cdn-icons-png.flaticon.com/512/8364/8364656.png')] bg-no-repeat bg-contain bg-right-bottom"></div>
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-1 border-b border-purple-500 text-center z-10">
          <h2 className="text-[11px] font-black text-purple-200 uppercase tracking-widest drop-shadow-md">
            Luật Đặc Biệt - Trùm Cuối
          </h2>
        </div>
        <div className="p-2 z-10 flex flex-col justify-center flex-1">
          <p className="text-[10px] text-purple-300 leading-tight font-bold mb-1">Khi có người lên Vòng 3, các thẻ "Tập đoàn Độc quyền" sẽ xuất hiện. Cả bàn phải hợp lực để vượt qua!</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-green-950/50 border border-green-800 rounded p-1">
              <span className="text-[9px] font-black text-green-400 block">THÀNH CÔNG:</span>
              <span className="text-[8px] text-green-200">Cùng hưởng lợi lớn!</span>
            </div>
            <div className="flex-1 bg-red-950/50 border border-red-800 rounded p-1">
              <span className="text-[9px] font-black text-red-400 block">THẤT BẠI:</span>
              <span className="text-[8px] text-red-200">Suy thoái kinh tế, thu hẹp thị trường!</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHI PHÍ NÂNG CẤP THỊ TRƯỜNG */}
      <div className="flex-[1.2] border-2 border-cyan-700 rounded-xl bg-cyan-950/40 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-cyan-900 to-blue-900 py-1 border-b border-cyan-500 text-center">
          <h2 className="text-[11px] font-black text-cyan-200 uppercase tracking-widest drop-shadow-md">
            Chi Phí Nâng Cấp Thị Trường
          </h2>
        </div>
        <div className="flex flex-1 divide-x divide-cyan-800">
          <div className="flex-1 flex flex-col items-center justify-center p-1">
            <span className="text-[9px] font-bold text-cyan-400 mb-1 text-center">TỪ VÒNG 1 ➔ VÒNG 2</span>
            <div className="flex items-center gap-1">
              <span className="font-black text-sm text-yellow-500">5💰</span>
              <span className="font-bold text-cyan-500 text-xs">+</span>
              <span className="font-black text-sm text-blue-400">2📜</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-1">
            <span className="text-[9px] font-bold text-cyan-400 mb-1 text-center">TỪ VÒNG 2 ➔ VÒNG 3</span>
            <div className="flex items-center gap-1">
              <span className="font-black text-sm text-yellow-500">10💰</span>
              <span className="font-bold text-cyan-500 text-xs">+</span>
              <span className="font-black text-sm text-blue-400">3📜</span>
            </div>
          </div>
        </div>
      </div>

      {/* GIAO DỊCH & LIÊN DOANH */}
      <div className="flex-[1] border-2 border-amber-600 rounded-xl bg-amber-950/40 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-900 to-orange-900 py-1 border-b border-amber-500 text-center">
          <h2 className="text-[11px] font-black text-amber-200 uppercase tracking-widest drop-shadow-md">
            Giao Dịch & Liên Doanh
          </h2>
        </div>
        <div className="p-2 flex-1 flex items-center justify-center text-center">
          <p className="text-[10px] text-amber-300/80 font-bold leading-tight">
            Trao đổi tài nguyên với người chơi khác hoặc góp vốn chung để cùng phát triển.
          </p>
        </div>
      </div>
    </div>
  );
};
