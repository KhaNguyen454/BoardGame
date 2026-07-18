import React, { useState } from 'react';

const FACTIONS = [
  'Doanh nghiệp Nhà nước',
  'Kinh tế Tư nhân',
  'Khối FDI',
  'Kinh tế Tập thể / HTX'
];

export const SetupScreen = ({ onStartGame }) => {
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
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-neutral-950 font-sans text-slate-100 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-neutral-950 to-black p-8">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-slate-950/90 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-8">
        <h2 className="text-4xl font-black text-white tracking-widest uppercase mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Thiết Lập Trận Đấu
        </h2>

        <div className="flex items-center gap-4 bg-slate-800/80 p-2 rounded-xl border border-slate-600 backdrop-blur-sm">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest px-4">Số lượng người chơi:</span>
          {[2, 3, 4].map(num => (
            <button
              key={num}
              onClick={() => setNumPlayers(num)}
              className={`px-6 py-2 rounded-lg font-black text-lg transition-all ${numPlayers === num ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {Array.from({ length: numPlayers }).map((_, id) => (
            <div key={id} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-600 shadow-xl backdrop-blur-md flex flex-col gap-4">
              <div className="text-center border-b border-slate-700 pb-3">
                <h3 className="font-black text-xl text-blue-400 uppercase tracking-widest">P{id + 1}</h3>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tên người chơi</label>
                <input 
                  type="text" 
                  value={playersConfig[id].name}
                  onChange={(e) => handleUpdate(id, 'name', e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phe phái</label>
                <select 
                  value={playersConfig[id].faction}
                  onChange={(e) => handleUpdate(id, 'faction', e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg p-3 text-white outline-none focus:border-amber-500 transition-colors"
                >
                  {FACTIONS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => {
             // Lọc ra đúng số lượng config
             const finalConfig = {};
             for(let i = 0; i < numPlayers; i++) finalConfig[i] = playersConfig[i];
             onStartGame(finalConfig, numPlayers);
          }}
          className="mt-8 px-16 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black uppercase tracking-widest text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] border-b-4 border-teal-900 active:border-b-0 active:translate-y-1 transition-all"
        >
          VÀO GAME NÀY
        </button>
      </div>
    </div>
  );
};
