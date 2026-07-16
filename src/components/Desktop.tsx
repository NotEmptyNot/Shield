import React from 'react';
import { useGame } from '../context/GameContext';
import { 
  MessageSquare, 
  MessageCircle, 
  Camera, 
  Wallet, 
  ShieldCheck, 
  ShieldAlert, 
  Info,
  Calendar,
  AlertTriangle,
  Award
} from 'lucide-react';

export const Desktop: React.FC = () => {
  const { state, setScreen } = useGame();
  const { safety, notifications, deliveryState, messengerState, cashbackState, qrRestaurantState, qrBusState, feedbackLog, theme } = state;

  // Unread badge counts
  const messagesUnread = notifications.filter(n => n.app === 'messages').length;
  const messengerUnread = notifications.filter(n => n.app === 'messenger').length;
  const bankUnread = notifications.filter(n => n.app === 'bank').length;

  const getSafetyColor = () => {
    if (safety >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (safety >= 40) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  const getSafetyIcon = () => {
    if (safety >= 80) return <ShieldCheck className="w-8 h-8 text-emerald-500" />;
    return <ShieldAlert className="w-8 h-8 text-red-500" />;
  };

  // Get total resolved scenarios
  const resolvedCount = 
    (deliveryState !== 'pending' ? 1 : 0) +
    (messengerState !== 'pending' && messengerState !== 'asked_who' ? 1 : 0) +
    (cashbackState !== 'pending' ? 1 : 0) +
    (qrRestaurantState === 'done' || qrRestaurantState === 'cancelled' ? 1 : 0) +
    (qrBusState === 'done' || qrBusState === 'cancelled' ? 1 : 0);

  return (
    <div className="flex-1 flex flex-col p-4 select-none relative h-full justify-between pb-8">
      
      {/* Upper part: Smart Security Widgets */}
      <div className="space-y-3">
        {/* Date Widget */}
        <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-neutral-400 px-1 mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Четверг, 16 Июля</span>
          </div>
          <span className="text-[10px] bg-neutral-800/60 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700/50">Шаг: {resolvedCount}/5</span>
        </div>

        {/* Security Level Center Widget */}
        <div className={`p-4 rounded-3xl border backdrop-blur-md transition-all ${getSafetyColor()}`}>
          <div className="flex items-center gap-3">
            {getSafetyIcon()}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Уровень Защиты</h3>
              <p className="text-2xl font-black font-display text-neutral-100">{safety}%</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-neutral-800/40 h-2 rounded-full mt-3 overflow-hidden border border-neutral-800">
            <div 
              className={`h-full transition-all duration-500 ${
                safety >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 
                safety >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 
                'bg-gradient-to-r from-red-600 to-rose-400'
              }`}
              style={{ width: `${safety}%` }}
            ></div>
          </div>

          <p className="text-[10px] mt-2.5 leading-relaxed text-neutral-300">
            {safety >= 80 
              ? '🛡️ Система в безопасности. Все службы сканирования активны.' 
              : safety >= 40 
              ? '⚠️ Предупреждение: Есть риски взлома! Изучите входящие сообщения.'
              : '🚨 Тревога! Устройство находится под угрозой заражения!'}
          </p>
        </div>

        {/* Feed of incidents/decisions */}
        <div className="rounded-2xl bg-neutral-950/45 p-3 border border-neutral-900 h-[190px] overflow-y-auto no-scrollbar flex flex-col gap-2">
          <div className="flex items-center gap-1.5 border-b border-neutral-900 pb-1.5 mb-1">
            <Award className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">История решений игрока</span>
          </div>

          {feedbackLog.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-[10px] text-neutral-500 p-2">
              <Info className="w-6 h-6 stroke-1 mb-1" />
              <span>У вас нет завершенных событий. Откройте SMS, Мессенджер или Камеру, чтобы начать день.</span>
            </div>
          ) : (
            feedbackLog.slice().reverse().map((log, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-xl text-[10px] border leading-normal flex items-start gap-1.5 ${
                  log.type === 'success' ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300' :
                  log.type === 'danger' ? 'bg-red-950/20 border-red-900/30 text-red-300' :
                  'bg-neutral-900/40 border-neutral-800/40 text-neutral-300'
                }`}
              >
                <div className="mt-0.5">
                  {log.type === 'success' ? '✅' : log.type === 'danger' ? '❌' : 'ℹ️'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between font-bold text-[10px] mb-0.5">
                    <span>{log.title}</span>
                    <span className={log.scoreChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {log.scoreChange >= 0 ? `+${log.scoreChange}` : log.scoreChange}%
                    </span>
                  </div>
                  <p className="text-[9px] text-neutral-400 leading-tight">{log.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Grid of Interactive Desktop Applications */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-4 px-2 py-4">
        
        {/* App: SMS Messages */}
        <button 
          onClick={() => setScreen('messages')}
          className="flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-600 shadow-md flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
            <MessageSquare className="w-7 h-7 text-white" />
            {messagesUnread > 0 && (
              <div className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-red-500 border-2 border-slate-900 text-[10px] font-black text-white flex items-center justify-center shadow-sm">
                {messagesUnread}
              </div>
            )}
          </div>
          <span className="text-[10px] font-semibold text-center mt-1.5 text-neutral-300 group-hover:text-white truncate w-full">
            Сообщения
          </span>
        </button>

        {/* App: Messenger */}
        <button 
          onClick={() => setScreen('messenger')}
          className="flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-md flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
            <MessageCircle className="w-7 h-7 text-white" />
            {messengerUnread > 0 && (
              <div className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-red-500 border-2 border-slate-900 text-[10px] font-black text-white flex items-center justify-center shadow-sm">
                {messengerUnread}
              </div>
            )}
          </div>
          <span className="text-[10px] font-semibold text-center mt-1.5 text-neutral-300 group-hover:text-white truncate w-full">
            Мессенджер
          </span>
        </button>

        {/* App: Camera / QR scanner */}
        <button 
          onClick={() => setScreen('camera')}
          className="flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-zinc-500 to-zinc-700 shadow-md flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
            <Camera className="w-7 h-7 text-white" />
            {(qrRestaurantState === 'pending' || qrBusState === 'pending') && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900"></div>
            )}
          </div>
          <span className="text-[10px] font-semibold text-center mt-1.5 text-neutral-300 group-hover:text-white truncate w-full">
            Камера
          </span>
        </button>

        {/* App: Online Bank */}
        <button 
          onClick={() => setScreen('bank')}
          className="flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-yellow-500 to-amber-600 shadow-md flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
            <Wallet className="w-7 h-7 text-white" />
            {bankUnread > 0 && (
              <div className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-red-500 border-2 border-slate-900 text-[10px] font-black text-white flex items-center justify-center shadow-sm">
                {bankUnread}
              </div>
            )}
          </div>
          <span className="text-[10px] font-semibold text-center mt-1.5 text-neutral-300 group-hover:text-white truncate w-full">
            Банк
          </span>
        </button>
      </div>

      {/* Dock Area at bottom */}
      <div className="bg-neutral-900/50 backdrop-blur-lg border border-neutral-800/60 p-3 rounded-3xl mx-2 shadow-inner">
        <p className="text-[9px] text-center text-neutral-400 font-medium">
          💡 Совет: открывайте приложения с умом. Опасайтесь подозрительных ссылок и вложений!
        </p>
      </div>

    </div>
  );
};
