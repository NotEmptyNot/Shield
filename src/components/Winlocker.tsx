import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ShieldAlert, ShieldOff, AlertOctagon, RefreshCw, Lock } from 'lucide-react';

export const Winlocker: React.FC = () => {
  const { state, resetGame } = useGame();
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-black text-red-500 font-mono p-6 justify-between items-center text-center select-none relative">
      
      {/* Glitch Overlay effects */}
      <div className="absolute inset-0 bg-red-950/10 pointer-events-none mix-blend-overlay"></div>
      
      <div className="space-y-4 mt-8">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-red-500/10 border-2 border-red-500 animate-bounce">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-sm font-black tracking-widest text-red-600 uppercase border border-red-500/30 p-2 rounded bg-red-950/20">
          ATTENTION! DEVICE LOCKED
        </h1>
        
        <p className="text-[10px] text-red-400 font-bold leading-relaxed uppercase">
          УСТРОЙСТВО ЗАБЛОКИРОВАНО.<br/>
          ДЛЯ ДЕШИФРОВАНИЯ ВАШИХ СЧЕТОВ И ФАЙЛОВ ПЕРЕВЕДИТЕ 0.5 BITCOIN (BTC).
        </p>
      </div>

      {/* Skull ascii art or stylized lock details */}
      <div className="p-3 bg-red-950/35 border border-red-900/60 rounded-xl space-y-2 max-w-xs">
        <div className="text-[7px] text-red-500 font-bold leading-none select-none">
          {`      .---.       .---. \n     /     \\     /     \\ \n     |   o_o |     | o_o   | \n     \\     /     \\     / \n      \`---'       \`---' `}
        </div>
        <p className="text-[9px] text-red-400 leading-normal">
          Все ваши контакты, фотографии и банковские ключи зашифрованы алгоритмом AES-256. В случае попытки удаления или переустановки — данные будут утеряны.
        </p>
      </div>

      {/* Ransom Countdown and Action */}
      <div className="w-full space-y-4 mb-6">
        <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-3">
          <span className="text-[8px] uppercase tracking-wider text-red-500 block mb-1">Удаление файлов начнется через</span>
          <span className="text-xl font-bold tracking-widest text-red-500 font-mono animate-pulse">{formatTime(timeLeft)}</span>
        </div>

        {/* Educational Lesson Explainer pop-up embedded */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl text-left">
          <h4 className="text-[10px] font-bold text-white flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Урок кибербезопасности:</span>
          </h4>
          <p className="text-[9px] text-neutral-400 leading-normal mt-1">
            Вы установили троян-вымогатель через сомнительное SMS/Сообщение. **Запомните:** Настоящие банки никогда не присылают обновления в виде `.apk` файлов в мессенджерах. Все официальные банковские клиенты устанавливаются и обновляются исключительно через официальные магазины приложений.
          </p>
        </div>

        <button 
          onClick={resetGame}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Попробовать заново</span>
        </button>
      </div>

    </div>
  );
};
