import React, { useState } from 'react';
import { playClick, playSuccess } from '../../utils/audio';

const FACTIONS = [
  'Doanh nghiệp Nhà nước',
  'Kinh tế Tư nhân',
  'Khối FDI',
  'Kinh tế Tập thể / HTX'
];

const FACTION_COLORS = {
  'Doanh nghiệp Nhà nước': 'from-red-900/60 to-red-950 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] focus-within:border-red-400 focus-within:shadow-[0_0_30px_rgba(239,68,68,0.4)]',
  'Kinh tế Tư nhân': 'from-blue-900/60 to-blue-950 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)] focus-within:border-blue-400 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.4)]',
  'Khối FDI': 'from-amber-900/60 to-amber-950 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] focus-within:border-amber-400 focus-within:shadow-[0_0_30px_rgba(245,158,11,0.4)]',
  'Kinh tế Tập thể / HTX': 'from-emerald-900/60 to-emerald-950 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] focus-within:border-emerald-400 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
};

const FACTION_TEXT = {
  'Doanh nghiệp Nhà nước': 'text-red-400',
  'Kinh tế Tư nhân': 'text-blue-400',
  'Khối FDI': 'text-amber-400',
  'Kinh tế Tập thể / HTX': 'text-emerald-400'
};

export const SetupScreen = ({ onStartGame, onBack }) => {
  const [numPlayers, setNumPlayers] = useState(4);
  const [playersConfig, setPlayersConfig] = useState({
    0: { name: 'Người chơi 1', faction: FACTIONS[0] },
    1: { name: 'Người chơi 2', faction: FACTIONS[1] },
    2: { name: 'Người chơi 3', faction: FACTIONS[2] },
    3: { name: 'Người chơi 4', faction: FACTIONS[3] },
  });

  const handleUpdate = (id, field, value) => {
    setPlayersConfig(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center font-sans text-slate-100 relative overflow-hidden bg-slate-950 p-4 lg:p-8">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 to-slate-950/95 pointer-events-none z-0"></div>
      
      <div className="z-10 w-full max-w-6xl flex flex-col items-center gap-6 animate-fade-in">
        <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] py-2" style={{ fontFamily: '"Montserrat", sans-serif' }}>
          Thiết Lập Trận Đấu
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-600/50 backdrop-blur-md shadow-2xl">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest px-4">Số lượng người chơi:</span>
          <div className="flex gap-2">
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => { playClick(); setNumPlayers(num); }}
                className={`px-6 py-2 rounded-xl font-black text-base transition-all ${numPlayers === num ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.6)] border-b-4 border-orange-700 active:border-b-0 active:translate-y-1' : 'bg-slate-800 text-slate-400 border-b-4 border-slate-900 hover:bg-slate-700 active:border-b-0 active:translate-y-1'}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full mt-2">
          {Array.from({ length: numPlayers }).map((_, id) => {
             const faction = playersConfig[id].faction;
             return (
               <div key={id} className={`bg-gradient-to-br ${FACTION_COLORS[faction]} p-4 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group`}>
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"></div>
                 
                 <div className="text-center border-b border-white/10 pb-3 relative z-10">
                   <h3 className={`font-black text-2xl uppercase tracking-widest drop-shadow-md ${FACTION_TEXT[faction]}`}>P{id + 1}</h3>
                 </div>
                 
                 <div className="flex flex-col gap-2 relative z-10">
                   <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Tên Định Danh</label>
                   <input 
                     type="text" 
                     value={playersConfig[id].name}
                     onChange={(e) => handleUpdate(id, 'name', e.target.value)}
                     className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white font-bold outline-none focus:bg-black/60 transition-colors shadow-inner"
                   />
                 </div>

                 <div className="flex flex-col gap-2 relative z-10">
                   <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Hình Thái Kinh Tế</label>
                   <div className="relative">
                     <select 
                       value={playersConfig[id].faction}
                       onChange={(e) => handleUpdate(id, 'faction', e.target.value)}
                       className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white font-bold outline-none focus:bg-black/60 transition-colors shadow-inner appearance-none cursor-pointer"
                     >
                       {FACTIONS.map(f => (
                         <option key={f} value={f} className="bg-slate-900 text-white">{f}</option>
                       ))}
                     </select>
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                   </div>
                 </div>
               </div>
             );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md mx-auto">
          <button 
            onClick={() => {
               playSuccess();
               const finalConfig = {};
               for(let i = 0; i < numPlayers; i++) finalConfig[i] = playersConfig[i];
               onStartGame(finalConfig, numPlayers);
            }}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black uppercase tracking-widest text-base rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] border-b-4 border-teal-900 active:border-b-0 active:translate-y-1 transition-all"
          >
            BẮT ĐẦU NGAY
          </button>

          <button 
            onClick={() => { playClick(); onBack(); }}
            className="flex-[0.5] py-3 bg-slate-800/80 border-2 border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg active:translate-y-1 transition-all backdrop-blur-md"
          >
            QUAY LẠI
          </button>
        </div>
      </div>
    </div>
  );
};
