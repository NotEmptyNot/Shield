import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Download, 
  UserMinus, 
  MoreVertical, 
  Send,
  Lock,
  CheckCheck,
  AlertTriangle
} from 'lucide-react';

export const MessengerApp: React.FC = () => {
  const { state, handleMessengerAction, setScreen } = useGame();
  const { messengerState, notifications } = state;
  const [activeChat, setActiveChat] = useState<'support' | null>(null);

  const messengerNotification = notifications.find(n => n.id === 'sec_update');

  // Other static chats for realism
  const staticChats = [
    {
      id: 'work',
      name: 'Рабочий Чат (Коллеги)',
      lastMsg: 'Антон: Отчет по продажам за полугодие готов, посмотрите в закрепе.',
      time: '12:01',
      unread: 0,
      avatarInitials: 'РЧ',
      avatarBg: 'bg-indigo-600',
    },
    {
      id: 'pavel',
      name: 'Павел Котов',
      lastMsg: 'Привет! Завтра в силе сходить в кино на вечерний сеанс?',
      time: '10:45',
      unread: 0,
      avatarInitials: 'ПК',
      avatarBg: 'bg-cyan-500',
    }
  ];

  if (activeChat === 'support' && messengerNotification) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#17212b] text-white">
        
        {/* Messenger Chat Header */}
        <div className="px-4 py-3 bg-[#1e2c3a] border-b border-[#131d26] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveChat(null)}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            {/* Fake Bank Logo Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center font-bold text-xs text-white shadow-inner relative">
              <span className="text-[10px]">Bank</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#1e2c3a] flex items-center justify-center" title="Верифицировано">
                <span className="text-[6px] text-white font-bold">✓</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold flex items-center gap-1">
                {messengerNotification.sender}
                <span className="text-[8px] px-1 py-0.2 bg-emerald-500/10 text-emerald-400 rounded">Официально</span>
              </h3>
              <p className="text-[9px] text-[#5288c1]">онлайн</p>
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-neutral-400" />
        </div>

        {/* Advisory safety warning */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[9px] text-amber-300 leading-normal">
            Безопасность: Контакт «Служба Поддержки» просит вас запустить установочный APK-файл. Настоящие банки никогда не распространяют ПО таким способом.
          </p>
        </div>

        {/* Chat message bubbles */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar bg-[#0e1621] relative">
          <div className="text-center my-1">
            <span className="text-[9px] bg-[#1e2c3a]/50 text-neutral-400 px-3 py-1 rounded-full">
              Сегодня
            </span>
          </div>

          {/* Sender message (Initial Threat) */}
          <div className="flex items-end gap-2 max-w-[85%]">
            <div className="bg-[#182533] border border-[#233140] rounded-2xl rounded-bl-none p-3 shadow-md">
              <p className="text-xs text-neutral-200 leading-relaxed">
                Зафиксирована попытка входа в ваш аккаунт из г. Самара. Если это не вы, срочно установите обновление безопасности, чтобы мы могли отменить операцию: 
                <span className="block font-bold text-amber-400 mt-1 font-mono text-[11px]">SecureUpdate.apk</span>
              </p>

              {/* APK file element container */}
              <div className="mt-3 p-2.5 rounded-xl bg-[#101921] border border-[#202d3a] flex items-center justify-between gap-3 hover:bg-[#131d27] transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 border border-emerald-500/10">
                    APK
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-neutral-200">SecureUpdate.apk</h4>
                    <p className="text-[9px] text-neutral-500">4.8 МБ • Приложение</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleMessengerAction('download')}
                  className="p-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow"
                  title="Скачать и открыть"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <span className="block text-[8px] text-[#708499] text-right mt-1.5">{messengerNotification.time}</span>
            </div>
          </div>

          {/* User replies block */}
          {messengerState === 'asked_who' && (
            <div className="space-y-3">
              {/* User: "Кто это?" */}
              <div className="flex flex-col items-end w-full">
                <div className="bg-[#2b5278] rounded-2xl rounded-tr-none p-2.5 max-w-[85%] text-xs shadow-md">
                  Кто это? Как я могу удостовериться в вашей личности?
                  <div className="flex justify-end items-center gap-0.5 mt-1">
                    <span className="text-[8px] text-[#a4c6e9]">11:46</span>
                    <CheckCheck className="w-3 h-3 text-[#a4c6e9]" />
                  </div>
                </div>
              </div>

              {/* Bot response: High pressure reply */}
              <div className="flex items-end gap-2 max-w-[85%]">
                <div className="bg-[#182533] border border-[#233140] rounded-2xl rounded-bl-none p-3 shadow-md">
                  <p className="text-xs text-red-400 leading-relaxed font-bold animate-pulse">
                    ⚠️ Срочно скачайте и установите файл, иначе ваши счета будут обнулены в течение 5 минут! Мы действуем в интересах вашей финансовой безопасности!
                  </p>
                  <span className="block text-[8px] text-[#708499] text-right mt-1.5">11:46</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="p-4 bg-[#182533] border-t border-[#131d26] flex flex-col gap-2 shrink-0">
          <p className="text-[10px] text-center text-neutral-400 font-bold mb-1">🛡️ Как поступить с контактом?</p>
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={() => handleMessengerAction('download')}
              className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4.5 h-4.5" />
              <span>Запустить SecureUpdate.apk</span>
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              {messengerState === 'pending' && (
                <button 
                  onClick={() => handleMessengerAction('ask')}
                  className="py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-colors"
                >
                  Спросить "Кто это?"
                </button>
              )}
              <button 
                onClick={() => handleMessengerAction('block')}
                className="py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                style={{ gridColumn: messengerState === 'asked_who' ? 'span 2' : 'auto' }}
              >
                <UserMinus className="w-3.5 h-3.5" />
                <span>Заблокировать</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#182533] text-white select-none">
      
      {/* Messenger List Header */}
      <div className="px-4 py-4 bg-[#1e2c3a] border-b border-[#131d26] flex justify-between items-center shrink-0 shadow">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-wide">Мессенджер</span>
          <span className="text-[10px] font-semibold bg-emerald-500 text-neutral-950 px-1.5 py-0.2 rounded-full">Secure</span>
        </div>
      </div>

      {/* Chats Lists */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0e1621]">
        
        {/* Support Chat row if active */}
        {messengerNotification ? (
          <div 
            onClick={() => setActiveChat('support')}
            className="px-4 py-3.5 border-b border-neutral-900/60 hover:bg-[#182533]/80 flex justify-between items-start cursor-pointer transition-colors"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center font-bold text-xs text-white shrink-0 relative">
                Bank
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-[#0e1621]"></span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-neutral-100">{messengerNotification.sender}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                </div>
                <p className="text-[10px] text-neutral-400 line-clamp-1 font-semibold text-amber-400">
                  Зафиксирована попытка входа... SecureUpdate.apk
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[9px] text-[#5288c1] font-semibold">{messengerNotification.time}</span>
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-[8px] font-bold text-neutral-950 flex items-center justify-center">1</span>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 border-b border-neutral-900 text-center text-neutral-500 text-[10px]">
            {messengerState === 'blocked' 
              ? '✅ Подозрительный аккаунт Службы Поддержки заблокирован.' 
              : 'Чат обработан.'}
          </div>
        )}

        {/* Other Decorative Chats */}
        {staticChats.map(chat => (
          <div 
            key={chat.id}
            className="px-4 py-3.5 border-b border-neutral-900/40 opacity-70 hover:bg-neutral-800/10 flex justify-between items-start cursor-pointer transition-colors"
          >
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-full ${chat.avatarBg} flex items-center justify-center font-bold text-xs text-white shrink-0`}>
                {chat.avatarInitials}
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-neutral-300">{chat.name}</span>
                <p className="text-[10px] text-neutral-500 line-clamp-1">{chat.lastMsg}</p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-[9px] text-neutral-500">{chat.time}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
