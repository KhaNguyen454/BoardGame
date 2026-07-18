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
import { toggleAudio, isAudioEnabled, playTurnChange, playSuccess } from './utils/audio';
import confetti from 'canvas-confetti';
import { TradeModal } from './components/TradeModal';

const BoardWrapper = (props) => {
  const { G, ctx } = props;
  const myPlayerId = ctx.currentPlayer; // Auto-focus active player
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [audioEnabledState, setAudioEnabledState] = useState(isAudioEnabled);

  useEffect(() => {
    // Play sound on turn change
    if (audioEnabledState && !ctx.gameover) {
      playTurnChange();
    }
  }, [ctx.currentPlayer, audioEnabledState, ctx.gameover]);

  useEffect(() => {
    if (ctx.gameover) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444']
      });
      if (audioEnabledState) {
        setTimeout(() => playSuccess(), 100);
        setTimeout(() => playSuccess(), 500);
      }
    }
  }, [ctx.gameover, audioEnabledState]);

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
    <div className="w-screen h-screen bg-neutral-950 font-sans text-slate-100 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-neutral-950 to-black flex flex-col lg:flex-row border-[8px] lg:border-[12px] border-amber-900 rounded-lg shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] box-border">
      
      {/* Toast Notifications */}
      <ToastAlert G={props.G} />

      {/* Cột trái: Sidebar (Bảng theo dõi) */}
      <div className="w-full lg:w-[15vw] h-auto lg:h-full flex-shrink-0 flex lg:flex-col border-b-4 lg:border-b-0 lg:border-r-4 border-amber-700 shadow-2xl bg-neutral-900/90 z-10 overflow-hidden">
         <div className="flex-1 lg:min-h-0 overflow-x-auto lg:overflow-y-auto custom-scrollbar p-2 flex flex-row lg:flex-col gap-2">
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
             <div className="relative inline-flex items-center justify-center mt-1 bg-gradient-to-r from-red-900 via-red-800 to-red-900 px-4 h-6 shadow-md border-y border-red-500/50">
                 <div className="absolute -left-[11px] top-0 w-0 h-0 border-y-[11px] border-y-transparent border-r-[12px] border-r-red-900"></div>
                 <div className="absolute -right-[11px] top-0 w-0 h-0 border-y-[11px] border-y-transparent border-l-[12px] border-l-red-900"></div>
                 <span className="text-[10px] lg:text-xs font-black text-amber-200 uppercase tracking-[0.2em] relative z-10 drop-shadow-md whitespace-nowrap">Phiên Bản Định Hướng XHCN</span>
             </div>
         </div>
         
         <button 
           onClick={() => setShowConfirmExit(true)}
           title="Quay Lại Menu"
           className="absolute top-2 left-2 lg:top-4 lg:left-4 z-50 flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-slate-800/80 hover:bg-rose-900/80 text-slate-300 hover:text-white rounded-full border border-slate-600 hover:border-rose-500 backdrop-blur-md shadow-lg transition-all group"
         >
           <span className="text-lg lg:text-xl group-hover:-translate-x-0.5 transition-transform">←</span>
         </button>

         <button 
           onClick={() => {
              const newState = !audioEnabledState;
              setAudioEnabledState(newState);
              toggleAudio(newState);
           }}
           className={`absolute top-2 right-2 lg:top-4 lg:right-4 z-50 flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border shadow-lg transition-all ${audioEnabledState ? 'bg-amber-500/80 border-amber-300 text-white' : 'bg-slate-800/80 border-slate-600 text-slate-400'}`}
         >
           {audioEnabledState ? '🔊' : '🔇'}
         </button>

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
      <div className="w-full lg:w-[25vw] lg:min-w-[300px] lg:max-w-[380px] h-[35vh] lg:h-full flex-shrink-0 flex flex-col border-t-4 lg:border-t-0 lg:border-l-4 border-amber-700 shadow-2xl bg-neutral-900/90 z-10 overflow-hidden">
         <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 relative bg-black/20">
            <ActionPanel {...props} myPlayerId={myPlayerId} />
         </div>
      </div>

      {/* Modals */}
      <BossModal {...props} />
      <TradeModal {...props} />

      {/* Game Over Modal */}
      {ctx.gameover && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-4 border-amber-500 rounded-3xl p-8 lg:p-12 max-w-2xl w-full shadow-[0_0_100px_rgba(245,158,11,0.6)] relative text-center">
            <h2 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 uppercase tracking-widest mb-4 drop-shadow-lg">
              TRÒ CHƠI KẾT THÚC
            </h2>
            <div className="text-2xl lg:text-3xl font-bold text-white mb-8">
              Người chiến thắng: <span className="text-amber-400">P{parseInt(ctx.gameover.winner) + 1}</span>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new Event('RETURN_TO_MENU'))}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-black text-xl uppercase tracking-widest rounded-xl shadow-[0_10px_20px_rgba(245,158,11,0.4)] border-b-4 border-yellow-900 active:border-b-0 active:translate-y-1 transition-all"
            >
              Quay Về Menu
            </button>
          </div>
        </div>
      )}

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
  debug: false,
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
