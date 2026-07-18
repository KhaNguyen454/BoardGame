import React, { useState, useEffect } from 'react';
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
  const [showConfirmExit, setShowConfirmExit] = useState(false);

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
         
         <button 
           onClick={() => setShowConfirmExit(true)}
           className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-slate-800/80 hover:bg-rose-900/80 text-slate-300 hover:text-white px-4 py-2 rounded-full border border-slate-600 hover:border-rose-500 backdrop-blur-md shadow-lg transition-all group"
         >
           <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
           <span className="font-bold text-sm uppercase tracking-wider">Quay Lại</span>
         </button>

         <div className="w-full flex-1 flex items-center justify-center min-h-0 mt-8">
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

      {/* Confirm Exit Modal */}
      {showConfirmExit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-center">
            <h2 className="text-2xl font-black text-rose-500 uppercase tracking-widest mb-4">THOÁT TRẬN ĐẤU?</h2>
            <p className="text-slate-300 mb-8 font-bold">Trận đấu hiện tại sẽ không được lưu. Bạn có chắc chắn muốn quay về Menu chính?</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setShowConfirmExit(false)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-wider rounded-xl border border-slate-600 transition-colors flex-1"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  setShowConfirmExit(false);
                  window.dispatchEvent(new Event('RETURN_TO_MENU'));
                }}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-colors flex-1"
              >
                Đồng Ý
              </button>
            </div>
          </div>
        </div>
      )}
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
  
  useEffect(() => {
    const handleReturnToMenu = () => {
      setCurrentScreen('MENU');
    };
    window.addEventListener('RETURN_TO_MENU', handleReturnToMenu);
    return () => window.removeEventListener('RETURN_TO_MENU', handleReturnToMenu);
  }, []);

  if (currentScreen === 'MENU') {
    return <MainMenu onStart={() => setCurrentScreen('SETUP')} />;
  }

  if (currentScreen === 'SETUP') {
    return (
      <SetupScreen 
        onBack={() => setCurrentScreen('MENU')}
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
