import React from 'react';

export const MainMenu = ({ onStart }) => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-neutral-950 font-sans text-slate-100 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-neutral-950 to-black">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-950/90 pointer-events-none"></div>
      
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
          onClick={() => alert('Tính năng đang phát triển')}
          className="w-80 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest text-sm rounded-xl border border-slate-600 transition-colors"
        >
          Hướng Dẫn Cách Chơi
        </button>

        <button 
          onClick={() => alert('Tính năng đang phát triển')}
          className="w-80 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest text-sm rounded-xl border border-slate-600 transition-colors"
        >
          Bộ Bài Trong Game
        </button>
      </div>
    </div>
  );
};
