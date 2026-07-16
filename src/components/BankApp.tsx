import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Award, 
  CheckCircle,
  TrendingUp,
  X,
  ShieldCheck
} from 'lucide-react';

export const BankApp: React.FC = () => {
  const { state, handleCashbackAction, setScreen } = useGame();
  const { cashbackState, notifications } = state;
  const [showNotificationPopup, setShowNotificationPopup] = useState(cashbackState === 'pending');

  const hasCashbackPush = notifications.some(n => n.id === 'cashback');

  const handleClaim = () => {
    handleCashbackAction('click');
    setShowNotificationPopup(false);
  };

  const handleDismiss = () => {
    handleCashbackAction('dismiss');
    setShowNotificationPopup(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0f1d] text-white select-none relative">
      
      {/* Bank App Header */}
      <div className="px-5 py-4 bg-[#0e172a] border-b border-[#1e293b] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-black text-sm text-neutral-950 shadow-md">
            MB
          </div>
          <div>
            <h2 className="text-xs font-black tracking-wide">MyBank</h2>
            <p className="text-[8px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Шифрование SSL-256</span>
            </p>
          </div>
        </div>
        <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">Личный Кабинет</span>
      </div>

      {/* Main Bank Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        
        {/* Active Cashback Banner inside bank if pending */}
        {cashbackState === 'pending' && hasCashbackPush && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/25 to-yellow-500/10 border border-amber-500/40 animate-pulse relative">
            <div className="flex gap-2.5 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-400">Начислен Кэшбэк!</h4>
                <p className="text-[10px] text-neutral-300 mt-0.5 leading-relaxed">
                  Поздравляем! Вам начислен кэшбэк 1500 рублей за покупки в прошлом месяце. Подробности внутри приложения.
                </p>
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={handleClaim}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-[10px] rounded-lg transition-all"
                  >
                    Посмотреть подробности
                  </button>
                  <button 
                    onClick={handleDismiss}
                    className="px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-[10px] rounded-lg transition-all"
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Claimed Cashback Reward success screen */}
        {cashbackState === 'done' && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex gap-2.5 items-start">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-400">Кэшбэк 1,500 ₽ Начислен!</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Баланс пополнен. Это уведомление было безопасным: в нем отсутствовали ссылки, и оно перенаправило вас в официальный личный кабинет.
              </p>
            </div>
          </div>
        )}

        {/* Balance widget with Debit Card */}
        <div className="space-y-2">
          <div className="flex justify-between items-end px-1">
            <div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Общий Баланс</span>
              <p className="text-2xl font-black font-mono tracking-tight text-neutral-100">
                {cashbackState === 'done' ? '25,000.00' : '23,500.00'} <span className="text-lg">₽</span>
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4.2% в мес</span>
            </span>
          </div>

          {/* Holographic Credit Card visual */}
          <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-4 flex flex-col justify-between shadow-lg relative overflow-hidden border border-indigo-500/30">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[8px] text-indigo-200 font-bold uppercase tracking-widest">MyBank Premium</p>
                <h3 className="text-xs font-bold mt-0.5 text-white">УНИВЕРСАЛЬНАЯ КАРТА</h3>
              </div>
              <CreditCard className="w-7 h-7 text-white/80" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold tracking-widest text-white/95 font-mono">
                ••••  ••••  ••••  4890
              </p>
              <div className="flex justify-between items-center text-white/70">
                <div>
                  <p className="text-[6px] uppercase text-indigo-300">Держатель</p>
                  <p className="text-[9px] font-bold">SMART USER</p>
                </div>
                <div>
                  <p className="text-[6px] uppercase text-indigo-300">Срок</p>
                  <p className="text-[9px] font-bold">12 / 29</p>
                </div>
                <span className="text-sm font-black italic text-white/80">MIR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">Последние Транзакции</h3>
          
          <div className="space-y-1.5">
            {cashbackState === 'done' && (
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200">Кэшбэк от MyBank</h4>
                    <p className="text-[9px] text-neutral-500">Начисление по программе лояльности</p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-emerald-400 shrink-0">+1,500.00 ₽</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/40 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-300">Ресторан «Аллея»</h4>
                  <p className="text-[9px] text-neutral-500">Оплата счета за ужин</p>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-red-400 shrink-0">-2,450.00 ₽</span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/40 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-300">Супермаркет Перекресток</h4>
                  <p className="text-[9px] text-neutral-500">Покупка продуктов</p>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-red-400 shrink-0">-1,240.00 ₽</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
