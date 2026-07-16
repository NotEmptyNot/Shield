import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  ArrowLeft, 
  Trash2, 
  ShieldAlert, 
  Check, 
  User, 
  MoreVertical,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

export const MessagesApp: React.FC = () => {
  const { state, handleDeliveryAction, setScreen } = useGame();
  const { deliveryState, notifications } = state;
  const [activeThread, setActiveThread] = useState<'delivery' | null>(null);

  const deliveryNotification = notifications.find(n => n.id === 'delivery');

  // Static list of other mock SMS threads for realism
  const staticSMSThreads = [
    {
      id: 'mama',
      sender: 'Мама',
      text: 'Купи хлеба по дороге домой, пожалуйста. И молоко 2.5%',
      time: 'Вчера',
      unread: false,
      avatarBg: 'bg-indigo-500',
    },
    {
      id: 'mts',
      sender: 'MTS_Info',
      text: 'Вам начислено 100 бонусных баллов! Проверить баланс можно в личном кабинете.',
      time: '15 Июля',
      unread: false,
      avatarBg: 'bg-red-500',
    },
    {
      id: 'gosuslugi',
      sender: 'Gosuslugi',
      text: 'Ваше заявление на замену загранпаспорта успешно зарегистрировано.',
      time: '12 Июля',
      unread: false,
      avatarBg: 'bg-blue-600',
    }
  ];

  if (activeThread === 'delivery' && deliveryNotification) {
    return (
      <div className="flex-1 flex flex-col h-full bg-neutral-950 text-white">
        {/* Messages Chat Header */}
        <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveThread(null)}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-300">
              ID
            </div>
            <div>
              <h3 className="text-xs font-bold">{deliveryNotification.sender}</h3>
              <p className="text-[9px] text-neutral-500">Был(а) недавно</p>
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-neutral-400" />
        </div>

        {/* Info Banner about sender */}
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2.5 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-red-300 leading-normal">
            Внимание! Отправитель не находится в вашей телефонной книге. Будьте бдительны с внешними ссылками в сообщении.
          </p>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
          <div className="text-center">
            <span className="text-[9px] px-2.5 py-1 rounded-full bg-neutral-900 text-neutral-500 font-semibold uppercase tracking-wider">
              Сегодня • {deliveryNotification.time}
            </span>
          </div>

          <div className="flex flex-col items-start max-w-[85%]">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl rounded-tl-none p-3 shadow text-xs leading-relaxed text-neutral-200">
              Уважаемый клиент! Ваша посылка приостановлена из-за неоплаченной таможенной пошлины (99 руб). Оплатите по ссылке:{' '}
              <span 
                onClick={() => handleDeliveryAction('click_link')}
                className="text-blue-400 underline font-mono cursor-pointer hover:text-blue-300 break-all"
              >
                https://cdek-post-pay.ru/track
              </span>{' '}
              иначе посылка будет возвращена.
            </div>
            <span className="text-[8px] text-neutral-500 mt-1 ml-1">{deliveryNotification.time}</span>
          </div>
        </div>

        {/* Bottom Safety Action controls */}
        <div className="p-4 bg-neutral-900/60 border-t border-neutral-800 flex flex-col gap-2">
          <p className="text-[10px] text-center text-neutral-400 font-semibold mb-1">🛡️ Ваши действия безопасности:</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleDeliveryAction('delete')}
              className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Заблокировать</span>
            </button>
            <button 
              onClick={() => setActiveThread(null)}
              className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <span>Назад</span>
            </button>
          </div>
          <p className="text-[9px] text-center text-neutral-500 leading-tight mt-1">
            Защита считает, что данный домен cdek-post-pay.ru является фишинговой уловкой.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-900 text-white select-none">
      
      {/* SMS Client header */}
      <div className="px-4 py-4 bg-neutral-900 border-b border-neutral-800 flex justify-between items-center shrink-0">
        <h2 className="text-sm font-bold tracking-wide">SMS Сообщения</h2>
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
      </div>

      {/* SMS Chats list */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Active Scenario SMS Thread */}
        {deliveryNotification ? (
          <div 
            onClick={() => {
              setActiveThread('delivery');
            }}
            className="px-4 py-3.5 border-b border-neutral-800/60 hover:bg-neutral-800/40 flex justify-between items-start cursor-pointer transition-colors"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow">
                ID
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-neutral-200">{deliveryNotification.sender}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                </div>
                <p className="text-[10px] text-neutral-400 line-clamp-1">
                  Уважаемый клиент! Ваша посылка приостановлена...
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[9px] text-neutral-500 font-medium">{deliveryNotification.time}</span>
              <span className="w-4 h-4 rounded-full bg-blue-500 text-[8px] font-bold text-white flex items-center justify-center">1</span>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 border-b border-neutral-800 text-center text-neutral-500 text-[10px]">
            {deliveryState === 'deleted' 
              ? '✅ Смишинг-сообщение от Info_Delivery успешно удалено и заблокировано.' 
              : 'Сообщение обработано.'}
          </div>
        )}

        {/* Decorative Static lists */}
        {staticSMSThreads.map(thread => (
          <div 
            key={thread.id}
            className="px-4 py-3.5 border-b border-neutral-800/40 opacity-70 hover:bg-neutral-800/20 flex justify-between items-start cursor-pointer transition-colors"
          >
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-full ${thread.avatarBg} flex items-center justify-center font-bold text-sm text-white shrink-0`}>
                {thread.sender[0]}
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-neutral-300">{thread.sender}</span>
                <p className="text-[10px] text-neutral-500 line-clamp-1">{thread.text}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[9px] text-neutral-500">{thread.time}</span>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};
