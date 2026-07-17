import React, { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { DuongDenThiTruong } from './game/Game';
import { GameBoard } from './components/GameBoard';
import { Sidebar } from './components/Sidebar';
import { ActionPanel } from './components/ActionPanel';
import { BossModal } from './components/BossModal';
import { ToastAlert } from './components/ToastAlert';
import { MainMenu } from './components/screens/MainMenu';
import { SetupScreen } from './components/screens/SetupScreen';

const BoardWrapper = (props) => {
  const { G, ctx } = props;
  const myPlayerId = ctx.currentPlayer; // Auto-focus active player

  // Lấy câu hướng dẫn theo stage
  const getInstruction = () => {
    if (G.activeBoss) return "⚠️ KHỦNG HOẢNG TẬP ĐOÀN ĐỘC QUYỀN - HÃY ĐÓNG GÓP TÀI NGUYÊN HOẶC CHỊU PHẠT!";
    if (G.pendingTradeEvent) return "🤝 GIAO DỊCH LIÊN DOANH - HÃY QUYẾT ĐỊNH KÝ KẾT HAY HỦY BỎ.";
    
    switch (ctx.activePlayers?.[ctx.currentPlayer] || 'rollDice') {
      case 'rollDice': return "🎲 ĐỔ XÚC XẮC ĐỂ THU HÚT TÀI NGUYÊN (NHẬN THƯỞNG KHI CÓ ĐÔI HOẶC 7)";
      case 'produce': return "⚙️ CHỌN PHƯƠNG THỨC SẢN XUẤT: BỀN VỮNG HOẶC ĐI TẮT (CÓ RỦI RO)";
      case 'marketEvent': return "📜 RÚT THẺ SỰ KIỆN THỊ TRƯỜNG VÀ ĐỐI MẶT VỚI BIẾN ĐỘNG";
      case 'actions': return "🚀 GIAI ĐOẠN ĐẦU TƯ: HỘI NHẬP, MUA ĐIỂM XÃ HỘI, HOẶC GIAO DỊCH TỰ DO";
      default: return "ĐANG CHỜ HÀNH ĐỘNG...";
    }
  };
  return (
    <div className="w-screen h-screen bg-slate-950 font-sans text-slate-100 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] flex flex-row">
      
      {/* Toast Notifications */}
      <ToastAlert G={props.G} />

      {/* Cột trái: Sidebar */}
      <Sidebar {...props} />

      {/* Cột giữa: Bàn cờ & Khung Hướng dẫn */}
      <div className="flex-1 min-w-0 relative flex flex-col items-center justify-center p-4">
         <div className="w-full flex-1 flex items-center justify-center min-h-0">
           <GameBoard G={props.G} ctx={ctx} />
         </div>
         
         {/* Khung Hướng Dẫn */}
         <div className="w-[90%] lg:w-[80%] mt-4 flex-shrink-0 bg-slate-800/90 p-4 rounded-xl border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-md relative overflow-hidden z-10">
           <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 animate-pulse"></div>
           <h3 className="text-amber-400 font-black uppercase tracking-widest text-xs mb-1">CHỈ THỊ HIỆN TẠI:</h3>
           <p className="text-white font-bold text-sm lg:text-base animate-fade-in uppercase tracking-wider">{getInstruction()}</p>
         </div>
      </div>

      {/* Cột phải: Action Panel */}
      <ActionPanel {...props} myPlayerId={myPlayerId} />

      {/* Modals */}
      <BossModal {...props} />
    </div>
  );
};

const createGameClient = (setupData, numPlayers) => Client({
  game: {
    ...DuongDenThiTruong,
    setup: (ctx) => DuongDenThiTruong.setup(ctx, setupData)
  },
  board: BoardWrapper,
  numPlayers: numPlayers,
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('MENU');
  const [setupData, setSetupData] = useState(null);
  const [numPlayers, setNumPlayers] = useState(4);
  
  if (currentScreen === 'MENU') {
    return <MainMenu onStart={() => setCurrentScreen('SETUP')} />;
  }

  if (currentScreen === 'SETUP') {
    return (
      <SetupScreen 
        onStartGame={(data, selectedNumPlayers) => {
          setSetupData(data);
          setNumPlayers(selectedNumPlayers);
          setCurrentScreen('GAME');
        }} 
      />
    );
  }

  const GameClient = createGameClient(setupData, numPlayers);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
       <div className="flex-1 relative">
         <GameClient />
       </div>
    </div>
  )
}
