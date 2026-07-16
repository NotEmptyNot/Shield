import React from 'react';
import { useGame } from '../context/GameContext';
import { Award, ShieldAlert, ShieldCheck, RefreshCw, Star, ArrowRight, Check, AlertTriangle } from 'lucide-react';

export const Outro: React.FC = () => {
  const { state, resetGame } = useGame();
  const { safety, feedbackLog } = state;

  const getEvaluation = () => {
    if (safety >= 100) {
      return {
        title: 'Кибер-Защитник',
        description: 'Твой карманный щит непробиваем! Ты настоящий эксперт по кибербезу. Ни одна мошенническая уловка не увенчалась успехом.',
        icon: <ShieldCheck className="w-12 h-12 text-emerald-400" />,
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        starCount: 3,
      };
    } else if (safety > 0) {
      return {
        title: 'Уцелевший',
        description: 'Ты выжил, но понес потери. Будь внимательнее к ссылкам, файлам и наклейкам в общественных местах!',
        icon: <Star className="w-12 h-12 text-amber-400" />,
        badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        starCount: 2,
      };
    } else {
      return {
        title: 'Устройство Взломано',
        description: 'Твой телефон взломан, конфиденциальные данные украдены, а деньги списаны. Попробуй еще раз, обращая внимание на адреса сайтов, расширения файлов и поддельные наклейки.',
        icon: <ShieldAlert className="w-12 h-12 text-red-500" />,
        badgeBg: 'bg-red-500/10 border-red-500/30 text-red-500',
        starCount: 0,
      };
    }
  };

  const evalData = getEvaluation();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090d16] text-white p-5 select-none justify-between overflow-y-auto no-scrollbar">
      
      {/* Top Victory/Loss banner */}
      <div className="space-y-4 text-center mt-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800 shadow-2xl">
            {evalData.icon}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < evalData.starCount ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'}`} 
              />
            ))}
          </div>
          <h2 className="text-base font-black uppercase tracking-wider text-neutral-100 font-display mt-1">{evalData.title}</h2>
          <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${evalData.badgeBg}`}>
            Безопасность: {safety}%
          </div>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto">
          {evalData.description}
        </p>
      </div>

      {/* Decision breakdown */}
      <div className="my-4 space-y-2 flex-1">
        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">Анализ Ваших решений</h3>
        
        <div className="space-y-2 max-h-[240px] overflow-y-auto no-scrollbar pr-0.5">
          {feedbackLog.length === 0 ? (
            <p className="text-center text-[10px] text-neutral-500 py-4">История решений пуста.</p>
          ) : (
            feedbackLog.map((log, index) => (
              <div 
                key={index}
                className={`p-3 rounded-xl border flex gap-2.5 items-start text-xs ${
                  log.type === 'success' ? 'bg-emerald-950/20 border-emerald-900/20 text-emerald-300' :
                  log.type === 'danger' ? 'bg-red-950/20 border-red-900/20 text-red-300' :
                  'bg-neutral-900/50 border-neutral-800/60 text-neutral-300'
                }`}
              >
                <div className="mt-0.5">
                  {log.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex justify-between font-bold text-[10px]">
                    <span>{log.title}</span>
                    <span className={log.scoreChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {log.scoreChange >= 0 ? `+${log.scoreChange}` : log.scoreChange}%
                    </span>
                  </div>
                  <p className="text-[9px] text-neutral-400 leading-relaxed">{log.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 mb-4 shrink-0">
        <button 
          onClick={resetGame}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Сыграть заново</span>
        </button>
        <p className="text-[9px] text-center text-neutral-500">
          Игра-симулятор подготовлена в образовательных целях. Будьте бдительны!
        </p>
      </div>

    </div>
  );
};
