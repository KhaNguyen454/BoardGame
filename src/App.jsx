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
    <div className="w-screen h-screen bg-neutral-950 font-sans text-slate-100 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-neutral-950 to-black flex flex-row border-[12px] border-amber-900 rounded-lg shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] box-border">
      
      {/* Toast Notifications */}
      <ToastAlert G={props.G} />

      {/* Cột trái: Sidebar (Bảng theo dõi) */}
      <div className="w-[15vw] min-w-[180px] max-w-[220px] flex-shrink-0 h-full flex flex-col border-r-4 border-amber-700 shadow-2xl bg-neutral-900/90 z-10 overflow-hidden">
         <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2">
            <Sidebar {...props} />
         </div>
      </div>

      {/* Cột giữa: Bàn cờ, Hướng dẫn */}
      <div className="flex-1 min-w-0 relative flex flex-col items-center justify-center px-4">
         {/* Title area */}
         <div className="text-center w-full z-10 shrink-0">
            <h1 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-widest uppercase mt-1" style={{ WebkitTextStroke: '1px #78350f' }}>
              ĐƯỜNG ĐẾN THỊ TRƯỜNG
            </h1>
            <div className="bg-red-800/90 inline-block px-6 py-1 mt-1 rounded-sm border-2 border-red-900 shadow-[0_4px_10px_rgba(0,0,0,0.8)] relative">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 border-y-[12px] border-y-transparent border-r-[16px] border-r-red-900 drop-shadow-md"></div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 border-y-[12px] border-y-transparent border-l-[16px] border-l-red-900 drop-shadow-md"></div>
                <span className="text-[10px] lg:text-xs font-black text-amber-200 uppercase tracking-[0.2em] relative z-10 drop-shadow-md">Phiên Bản Định Hướng XHCN</span>
            </div>
         </div>

         <div className="w-full flex-1 flex flex-col items-center justify-center min-h-0 relative z-0 mt-2 mb-2">
           <GameBoard G={props.G} ctx={ctx} />
           
           {/* Khung Hướng Dẫn overlays GameBoard */}
           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] max-w-lg flex-shrink-0 bg-slate-900/95 p-1.5 rounded-lg border border-amber-500 shadow-[0_5px_15px_rgba(0,0,0,0.8)] backdrop-blur-md z-10 text-center">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse"></div>
             <h3 className="text-amber-400 font-black uppercase tracking-widest text-[8px] mb-0.5">CHỈ THỊ HIỆN TẠI:</h3>
             <p className="text-white font-bold text-[10px] lg:text-xs animate-fade-in uppercase tracking-wide leading-tight">{getInstruction()}</p>
           </div>
         </div>
      </div>

      {/* Cột phải: Action Panel (Quy trình lượt) */}
      <div className="w-[25vw] min-w-[300px] max-w-[380px] flex-shrink-0 h-full flex flex-col border-l-4 border-amber-700 shadow-2xl bg-neutral-900/90 z-10 overflow-hidden">
         <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 relative bg-black/20">
            <ActionPanel {...props} myPlayerId={myPlayerId} />
         </div>
      </div>

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
