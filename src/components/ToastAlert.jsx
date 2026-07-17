import React, { useState, useEffect, useRef } from 'react';

export const ToastAlert = ({ G }) => {
  const [toasts, setToasts] = useState([]);
  const [bankruptAlerts, setBankruptAlerts] = useState([]);
  const prevG = useRef(G);

  useEffect(() => {
    // 1. Kiểm tra lùi vòng thông thường (Toast nhỏ)
    const newToasts = [];
    if (prevG.current && G.players) {
      for(let i = 0; i < Object.keys(G.players).length; i++) {
         const oldP = prevG.current.players[i];
         const newP = G.players[i];
         
         if (oldP && newP && oldP.ring > newP.ring && G.skipActionStage && G.skipActionStage[i]) {
            newToasts.push(`💸 Người chơi ${i+1} gặp khủng hoảng dòng tiền và bị lùi vòng!`);
         }
      }
    }
    
    if (newToasts.length > 0) {
       setToasts(prev => [...prev, ...newToasts]);
       setTimeout(() => setToasts(prev => prev.slice(newToasts.length)), 5000);
    }

    // 2. Kiểm tra Phá Sản Khẩn Cấp (Modal to)
    if (G.bankruptcies && G.bankruptcies.length > 0) {
       const latestBankruptcies = G.bankruptcies.filter(b => b.time > (prevG.current.lastBankruptTime || 0));
       if (latestBankruptcies.length > 0) {
          setBankruptAlerts(latestBankruptcies);
          setTimeout(() => setBankruptAlerts([]), 6000);
          G.lastBankruptTime = Date.now();
       }
    }

    prevG.current = G;
  }, [G]);

  return (
    <>
      {/* Toast Nhỏ */}
      <div className="absolute top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((msg, idx) => (
          <div key={idx} className="bg-red-600/95 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-bounce border border-red-400 pointer-events-auto">
            {msg}
          </div>
        ))}
      </div>

      {/* Cảnh Báo Phá Sản Khẩn Cấp */}
      {bankruptAlerts.length > 0 && (
         <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-red-950/90 backdrop-blur-md animate-fade-in pointer-events-none">
            <div className="bg-red-700 p-12 rounded-3xl border-8 border-red-500 shadow-[0_0_100px_rgba(220,38,38,1)] text-center animate-pulse flex flex-col items-center gap-6">
              <span className="text-8xl drop-shadow-lg">🚨</span>
              <h1 className="text-7xl font-black text-white uppercase tracking-[0.2em] drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">PHÁ SẢN</h1>
              <p className="text-3xl font-black text-red-200 mt-2 uppercase tracking-widest drop-shadow-md">
                Người chơi {bankruptAlerts.map(b => parseInt(b.playerId) + 1).join(', ')} đã vỡ nợ!
              </p>
              <p className="text-xl text-white font-bold bg-black/40 px-6 py-3 rounded-xl mt-4 border border-red-400/50">
                Toàn bộ Tài nguyên & Tư bản bị tịch thu. Bắt đầu lại từ Vòng 1.
              </p>
            </div>
         </div>
      )}
    </>
  );
};
