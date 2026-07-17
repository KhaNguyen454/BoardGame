import React, { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { DuongDenThiTruong } from './game/Game';
import { GameBoard } from './components/GameBoard';
import { Sidebar } from './components/Sidebar';
import { ActionPanel } from './components/ActionPanel';
import { BossModal } from './components/BossModal';
import { TradeModal } from './components/TradeModal';
import { ToastAlert } from './components/ToastAlert';

const BoardWrapper = (props) => {
  return (
    <div className="w-screen h-screen bg-slate-950 font-sans text-slate-100 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] grid grid-cols-[25%_auto_30%]">
      
      {/* Toast Notifications */}
      <ToastAlert G={props.G} />

      {/* Cột trái: Sidebar */}
      <Sidebar {...props} />

      {/* Cột giữa: Bàn cờ */}
      <div className="relative flex items-center justify-center p-4">
         <GameBoard G={props.G} />
      </div>

      {/* Cột phải: Action Panel */}
      <ActionPanel {...props} />

      {/* Modals */}
      <BossModal {...props} />
      <TradeModal {...props} />
    </div>
  );
};

// Khởi tạo Client
const GameClient = Client({
  game: DuongDenThiTruong,
  board: BoardWrapper,
  numPlayers: 4,
});

export default function App() {
  const [playerID, setPlayerID] = useState('0');
  
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
       {/* Hot-seat Bar */}
       <div className="bg-black/90 text-white p-2 flex gap-6 items-center justify-center shadow-xl z-20 relative border-b border-slate-700/50 backdrop-blur-md">
         <span className="font-bold text-gray-400 tracking-wide uppercase text-xs">Test Mode (Hot-seat):</span>
         <div className="flex gap-2">
           {[0,1,2,3].map(id => (
             <button 
               key={id} 
               onClick={() => setPlayerID(id.toString())} 
               className={`px-4 py-1.5 rounded-md font-black text-xs transition-all duration-300 uppercase tracking-wider ${
                 playerID === id.toString() 
                 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.8)] text-white' 
                 : 'bg-slate-800 hover:bg-slate-700 text-gray-500 hover:text-gray-300'
               }`}
             >
               P{id + 1}
             </button>
           ))}
         </div>
       </div>
       
       <div className="flex-1 relative">
         <GameClient playerID={playerID} />
       </div>
    </div>
  )
}
