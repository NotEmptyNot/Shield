import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  ArrowLeft, 
  RotateCw, 
  Lock, 
  Unlock,
  AlertTriangle, 
  Globe, 
  CreditCard, 
  User, 
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export const BrowserApp: React.FC = () => {
  const { state, handleDeliveryAction, handleQrAction, setScreen } = useGame();
  const { deliveryState, qrRestaurantState, qrBusState, qrLocation } = state;

  // State to track inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Identify which page is currently open based on scenario state
  let currentUrl = '';
  let pageType: 'delivery' | 'restaurant' | 'bus' = 'delivery';

  if (deliveryState === 'clicked_link') {
    currentUrl = 'https://cdek-post-pay.ru/track';
    pageType = 'delivery';
  } else if (qrRestaurantState === 'clicked_link') {
    currentUrl = 'https://telegra.ph/Oplata-v-Restorane-123';
    pageType = 'restaurant';
  } else if (qrBusState === 'clicked_link') {
    currentUrl = 'https://mosmetro.ru-promo-2026.com/auth';
    pageType = 'bus';
  }

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.trim() && cardExpiry.trim() && cardCvv.trim()) {
      handleDeliveryAction('enter_card');
    }
  };

  const handleRestaurantSubmit = () => {
    handleQrAction('restaurant', 'submit_action');
  };

  const handleBusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone.trim() && loginPass.trim()) {
      handleQrAction('bus', 'submit_action');
    }
  };

  const handleBackToApp = () => {
    if (pageType === 'delivery') {
      handleDeliveryAction('back');
    } else if (pageType === 'restaurant') {
      handleQrAction('restaurant', 'cancel');
    } else if (pageType === 'bus') {
      handleQrAction('bus', 'cancel');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-900 text-white select-none">
      
      {/* Browser UI: Address Bar */}
      <div className="px-3 py-2 bg-neutral-950 border-b border-neutral-800 flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBackToApp}
            className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Dynamic Address field */}
          <div className="flex-1 bg-neutral-900 border border-red-500/30 rounded-xl px-3 py-1.5 flex items-center gap-1.5 justify-between">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {/* Highlight lack of HTTPS or untrusted certs with custom red indicator */}
              <Unlock className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-[11px] font-mono text-neutral-200 select-all truncate">
                {currentUrl}
              </span>
            </div>
            <RotateCw className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          </div>
        </div>

        {/* Dynamic warning bar about this domain */}
        <div className="flex items-center gap-1.5 px-1 py-0.5 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
          <p className="text-[8px] text-red-300 leading-none">
            {pageType === 'delivery' 
              ? 'Внимание! Поддельный домен (cdek-post-pay.ru). Правильный домен: cdek.ru' 
              : pageType === 'restaurant' 
              ? 'Ссылка ведет на telegra.ph (сторонний конструктор блогов).' 
              : 'Внимание! Тайпсквоттинг домена mosmetro.ru.'}
          </p>
        </div>
      </div>

      {/* Browser Webpage Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 text-slate-900 p-4 no-scrollbar">
        
        {/* PAGE 1: Fake CDEK Pay */}
        {pageType === 'delivery' && (
          <div className="space-y-4 font-sans max-w-sm mx-auto">
            {/* Header logo */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm tracking-tighter text-emerald-600 bg-emerald-100 px-2 py-1 rounded">СДЭК</span>
                <span className="text-[10px] font-bold text-slate-500">Доставка</span>
              </div>
              <span className="text-[10px] text-slate-400">Трек-номер: CDEK-408994-RU</span>
            </div>

            {/* Delivery Alert details */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <h3 className="text-xs font-bold text-amber-800 flex items-center gap-1">
                ⚠️ Посылка заблокирована
              </h3>
              <p className="text-[10px] text-amber-900 mt-1 leading-relaxed">
                Дорогой клиент, ваша посылка приостановлена на таможенном контроле из-за неоплаченной пошлины в размере **99.00 руб.** Пожалуйста, произведите оплату ниже, чтобы продолжить транспортировку.
              </p>
            </div>

            {/* Payment form */}
            <form onSubmit={handleDeliverySubmit} className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Оплата Банковской Картой</span>
              </h4>

              <div className="space-y-1">
                <label className="text-[9px] font-semibold text-slate-500 uppercase">Номер Карты</label>
                <input 
                  type="text" 
                  required
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-semibold text-slate-500 uppercase">Срок Действия</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ММ/ГГ"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-semibold text-slate-500 uppercase">CVC / CVV</label>
                  <input 
                    type="password" 
                    required
                    placeholder="•••"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-center"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer text-center"
              >
                Оплатить пошлину 99.00 ₽
              </button>
            </form>

            <div className="text-center">
              <span className="text-[9px] text-slate-400">© 2026 СДЭК Услуги Почты и Транспорта.</span>
            </div>
          </div>
        )}

        {/* PAGE 2: Fake Restaurant (Telegra.ph Blog post) */}
        {pageType === 'restaurant' && (
          <div className="space-y-4 font-sans max-w-sm mx-auto">
            <div className="border-b border-slate-200 pb-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Oplata v Restorane 123</h1>
              <p className="text-[10px] text-slate-400 mt-1">Опубликовано: Restorateur • 12 Июля 2026</p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>Уважаемый гость ресторана **«Аллея»**!</p>
              <p>
                Из-за технических сбоев с терминалами безналичной оплаты в нашем заведении, мы временно принимаем платежи за столики через наш криптовалютный шлюз.
              </p>
              <p className="bg-amber-100 p-2 rounded-lg border border-amber-200 text-amber-950 font-semibold">
                Сумма к оплате за столик №5: **2,450.00 руб.**
              </p>
              <p>Отправьте точный рублевый эквивалент на кошелек заведения, нажав кнопку подтверждения транзакции:</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Перевод в Криптосеть</h4>
                <p className="text-[9px] text-slate-500">Адрес: bc1qxy2kgdhg4fjk...9923</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={handleRestaurantSubmit}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                >
                  Оплатить перевод (2,450 ₽)
                </button>
                <button 
                  onClick={handleBackToApp}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Отмена
                </button>
              </div>
            </div>

            <div className="text-center p-2 bg-slate-100 rounded text-[9px] text-slate-400">
              ⚡ Телеграф — это бесплатная издательская платформа. Данный текст может быть написан кем угодно.
            </div>
          </div>
        )}

        {/* PAGE 3: Fake Bus Metro Promo (GosUslugi Phishing) */}
        {pageType === 'bus' && (
          <div className="space-y-4 font-sans max-w-sm mx-auto">
            {/* Fake Gosuslugi Header */}
            <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded bg-indigo-700 flex items-center justify-center font-bold text-sm text-white">
                  ГУ
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-indigo-900 uppercase leading-none tracking-tight">госуслуги</h3>
                  <span className="text-[8px] text-slate-400">Портал государственных услуг</span>
                </div>
              </div>
              <span className="text-[8px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold uppercase">Вход защищен</span>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
              <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                🎫 Промо-билет «МосМетро»
              </h4>
              <p className="text-[9px] text-indigo-950 leading-relaxed">
                Вы перешли по акционной ссылке розыгрыша годовых проездных! Для автоматической привязки проездного к вашему транспортному аккаунту Тройка необходимо авторизоваться через учетную запись ЕСИА (Госуслуги).
              </p>
            </div>

            {/* Fake Login Panel */}
            <form onSubmit={handleBusSubmit} className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-700 text-center">Вход в личный кабинет ЕСИА</h4>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500">Телефон, Email или СНИЛС</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500">Пароль</label>
                <div className="relative">
                  <KeyRound className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Введите ваш пароль"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full text-xs pl-9 pr-9 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer text-center"
                >
                  Войти и получить билет
                </button>
                <button 
                  type="button"
                  onClick={handleBackToApp}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Отмена
                </button>
              </div>
            </form>

            <div className="text-center">
              <span className="text-[8px] text-slate-400">Министерство цифрового развития, связи и массовых коммуникаций РФ.</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
