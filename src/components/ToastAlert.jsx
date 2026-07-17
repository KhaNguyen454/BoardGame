import React, { useState, useEffect, useRef } from 'react';

export const ToastAlert = ({ G }) => {
  const [toasts, setToasts] = useState([]);
  const prevG = useRef(G);

  useEffect(() => {
    const newToasts = [];
    for(let i = 0; i < 4; i++) {
       const oldP = prevG.current.players[i];
       const newP = G.players[i];
       
       if (oldP.capitalPoints > 0 && newP.capitalPoints === 0 && newP.ring === 1 && oldP.ring > 1) {
          newToasts.push(`🚨 Người chơi ${i+1} đã phá sản chạm đáy!`);
       }
       
       if (oldP.ring > newP.ring && G.skipActionStage[i]) {
          newToasts.push(`💸 Người chơi ${i+1} gặp khủng hoảng dòng tiền và bị lùi vòng!`);
       }
    }
    
    if (newToasts.length > 0) {
       setToasts(prev => [...prev, ...newToasts]);
       setTimeout(() => setToasts(prev => prev.slice(newToasts.length)), 5000);
    }
    prevG.current = G;
  }, [G]);

  return (
    <div className="absolute top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((msg, idx) => (
        <div key={idx} className="bg-red-600/95 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-bounce border border-red-400 pointer-events-auto">
          {msg}
        </div>
      ))}
    </div>
  );
};
