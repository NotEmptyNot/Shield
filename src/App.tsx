import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { PhoneFrame } from './components/PhoneFrame';
import { Desktop } from './components/Desktop';
import { MessagesApp } from './components/MessagesApp';
import { MessengerApp } from './components/MessengerApp';
import { CameraApp } from './components/CameraApp';
import { BankApp } from './components/BankApp';
import { BrowserApp } from './components/BrowserApp';
import { Winlocker } from './components/Winlocker';
import { Outro } from './components/Outro';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  HelpCircle, 
  Star, 
  Sparkles, 
  BookOpen, 
  Terminal, 
  Activity, 
  RotateCcw, 
  Shield, 
  Info, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { state, setScreen, resetGame } = useGame();
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Render sub-apps inside the phone frame depending on screen state
  const renderScreen = () => {
    switch (state.screen) {
      case 'desktop':
        return <Desktop />;
      case 'messages':
        return <MessagesApp />;
      case 'messenger':
        return <MessengerApp />;
      case 'camera':
        return <CameraApp />;
      case 'bank':
        return <BankApp />;
      case 'browser':
        return <BrowserApp />;
      case 'winlocker':
        return <Winlocker />;
      case 'outro':
        return <Outro />;
      default:
        return <Desktop />;
    }
  };

  // Scenario completion checking for stages & steps progress
  const deliveryDone = state.deliveryState === 'done' || state.deliveryState === 'deleted';
  const messengerDone = state.messengerState === 'done' || state.messengerState === 'blocked' || state.messengerState === 'installed_apk';
  const cashbackDone = state.cashbackState === 'done' || state.cashbackState === 'ignored';
  const qrRestaurantDone = state.qrRestaurantState === 'done' || state.qrRestaurantState === 'cancelled';
  const qrBusDone = state.qrBusState === 'done' || state.qrBusState === 'cancelled';

  const completedCount = [deliveryDone, messengerDone, cashbackDone, qrRestaurantDone, qrBusDone].filter(Boolean).length;
  const totalScenarios = 5;
  const currentStep = Math.min(totalScenarios, completedCount + 1);

  // Scenarios data matching the Left Sidebar design
  const scenariosData = [
    {
      id: 'delivery',
      name: 'Посылка (SMS)',
      status: state.deliveryState === 'pending' || state.deliveryState === 'clicked_link' ? 'active' : 
              state.deliveryState === 'deleted' ? 'success' : 'failed',
      desc: 'SMS-оповещение от службы доставки',
      screen: 'messages' as const
    },
    {
      id: 'messenger',
      name: 'Безопасность (Bank)',
      status: state.messengerState === 'pending' || state.messengerState === 'asked_who' ? 'active' :
              state.messengerState === 'blocked' ? 'success' : 'failed',
      desc: 'Сообщение в мессенджере с файлом APK',
      screen: 'messenger' as const
    },
    {
      id: 'cashback',
      name: 'Кэшбэк (Push)',
      status: state.cashbackState === 'pending' ? 'active' :
              state.cashbackState === 'done' ? 'success' : 'neutral',
      desc: 'Push-оповещение от мобильного банка',
      screen: 'desktop' as const
    },
    {
      id: 'restaurant',
      name: 'Ресторан (QR)',
      status: state.qrRestaurantState === 'pending' || state.qrRestaurantState === 'scanned' || state.qrRestaurantState === 'clicked_link' ? 'active' :
              state.qrRestaurantState === 'cancelled' ? 'success' : 'failed',
      desc: 'QR-код для оплаты меню на столе',
      screen: 'camera' as const
    },
    {
      id: 'bus',
      name: 'Розыгрыш (Stop)',
      status: state.qrBusState === 'pending' || state.qrBusState === 'scanned' || state.qrBusState === 'clicked_link' ? 'active' :
              state.qrBusState === 'cancelled' ? 'success' : 'failed',
      desc: 'QR-код с акцией на остановке',
      screen: 'camera' as const
    }
  ];

  // Dynamic educational tips based on the current screen/app open on the phone
  const getDynamicTip = () => {
    switch (state.screen) {
      case 'messages':
        return 'При получении SMS от служб доставки проверяйте адреса сайтов. Мошенники часто используют дефисы (например, cdek-post-pay.ru вместо официального cdek.ru).';
      case 'messenger':
        return 'Банки никогда не отправляют установочные файлы (.apk) в мессенджерах. Официальный софт загружается исключительно из официальных магазинов приложений!';
      case 'camera':
        return 'Злоумышленники могут наклеить поддельный QR-код поверх настоящего на рекламном щите или ресторанном тейбл-тенте. Всегда проверяйте домен перед оплатой.';
      case 'bank':
        return 'Официальные приложения банков никогда не просят вводить полные реквизиты карт или СМС-коды подтверждения для «начисления кэшбэка».';
      case 'browser':
        return 'При переходе по внешним ссылкам всегда изучайте адресную строку в браузере. Мошеннические домены маскируются под известные бренды, меняя пару букв.';
      case 'winlocker':
        return 'Если ваш экран заблокирован баннером-вымогателем, никогда не переводите средства злоумышленникам! Это не гарантирует возврат доступа к вашему устройству.';
      default:
        return 'Внимательно изучайте домены сайтов, расширения скачиваемых файлов и наклейки на QR-кодах, чтобы своевременно распознавать уловки.';
    }
  };

  // Dynamic Threat Analysis data based on current active screen/app
  const getThreatAnalysis = () => {
    switch (state.screen) {
      case 'messages':
        return {
          type: 'Смишинг (SMS-фишинг)',
          level: 'ВЫСОКИЙ',
          levelColor: 'text-rose-400 font-bold',
          badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          desc: 'Мошенники используют чувство срочности и небольшие суммы, чтобы усыпить бдительность. Обратите внимание на лишние слова и тире в домене cdek-post-pay.ru.'
        };
      case 'messenger':
        return {
          type: 'Социальная инженерия',
          level: 'КРИТИЧЕСКИЙ',
          levelColor: 'text-red-500 font-extrabold animate-pulse',
          badgeColor: 'bg-red-500/10 border-red-500/30 text-red-400',
          desc: 'Злоумышленники выдают себя за техподдержку банка, запугивая взломом аккаунта. Они отправляют вредоносный файл SecureUpdate.apk. Установка сторонних APK — главный путь заражения троянами.'
        };
      case 'camera':
        return {
          type: 'Киришинг (QR-фишинг)',
          level: 'СРЕДНИЙ',
          levelColor: 'text-amber-400 font-bold',
          badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          desc: 'Физическая подмена QR-кодов в ресторанах («оплата меню») или на остановках («розыгрыш билетов»). Сканирование ведет на сторонние платформы (например, telegra.ph или поддельные промо-домены).'
        };
      case 'browser':
        return {
          type: 'Фишинговый веб-сайт',
          level: 'ВЫСОКИЙ',
          levelColor: 'text-rose-400 font-bold',
          badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          desc: 'Точная копия легитимной платежной формы или страницы авторизации. Цель мошенников — перехватить реквизиты вашей банковской карты или учетные данные от Госуслуг.'
        };
      case 'bank':
        return {
          type: 'Официальный банкинг',
          level: 'БЕЗОПАСНО',
          levelColor: 'text-emerald-400 font-bold',
          badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          desc: 'Безопасное окружение приложения мобильного банка. Системные уведомления о кэшбэке без сомнительных внешних ссылок абсолютно безопасны для перехода.'
        };
      case 'winlocker':
        return {
          type: 'Троян-Вымогатель',
          level: 'КРИТИЧЕСКИЙ',
          levelColor: 'text-red-500 font-extrabold animate-pulse',
          badgeColor: 'bg-red-500/10 border-red-500/30 text-red-400',
          desc: 'Устройство заражено вирусом-блокировщиком из-за установки стороннего APK-файла. Все системные функции заблокированы. Требуется очистка системы.'
        };
      case 'outro':
        return {
          type: 'Подведение итогов',
          level: 'ЗАВЕРШЕНО',
          levelColor: 'text-indigo-400 font-bold',
          badgeColor: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
          desc: 'Один виртуальный день подошел к концу. Система рассчитала ваш итоговый уровень кибербезопасности и готовность противостоять угрозам.'
        };
      default:
        return {
          type: 'Мониторинг сети',
          level: 'НИЗКИЙ',
          levelColor: 'text-emerald-400 font-bold',
          badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          desc: 'Устройство в режиме ожидания. Все порты зашифрованы, активных угроз в данный момент на экране не обнаружено. Выбирайте приложения на рабочем столе смартфона.'
        };
    }
  };

  const threat = getThreatAnalysis();

  return (
    <div className="w-full min-h-screen lg:h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col overflow-x-hidden lg:overflow-hidden select-none relative">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      {showOnboarding ? (
        /* Welcome Onboarding Screen Styled inside the Professional Polish Theme */
        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-xl bg-slate-900/85 border border-slate-700/50 p-8 md:p-10 rounded-[32px] shadow-2xl relative space-y-6 text-center backdrop-blur-md">
            
            {/* Holographic glowing shield emblem */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="p-5 rounded-full bg-indigo-600/10 border-2 border-indigo-500/80 shadow-lg shadow-indigo-500/20 relative z-10 animate-pulse">
                  <ShieldCheck className="w-12 h-12 text-indigo-400" />
                </div>
                <div className="absolute -inset-2 rounded-full bg-indigo-500/25 blur opacity-50"></div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight font-display text-white">КАРМАННЫЙ ЩИТ</h1>
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold font-mono">Симулятор мобильной кибербезопасности</p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              Каждый день мошенники изобретают сотни способов кражи ваших денег и данных. 
              В этом симуляторе вы примерите на себя роль обычного пользователя смартфона. 
              Вам предстоит прожить один виртуальный день, отбивая атаки злоумышленников и принимая решения безопасности.
            </p>

            {/* Quick instructions checklist */}
            <div className="text-left bg-slate-950/65 rounded-2xl p-5 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Правила игры:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-indigo-400 mt-0.5 font-mono">⚡</span>
                  <span>Начальный уровень вашей <strong>Безопасности — 100%</strong>. Если он упадет до 0% или телефон заблокирует вирус-вымогатель — игра завершится провалом.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-indigo-400 mt-0.5 font-mono">⚡</span>
                  <span>Обрабатывайте входящие SMS в <strong>Сообщениях</strong>, беседы в <strong>Мессенджере</strong> и сканируйте уязвимые QR-коды через <strong>Камеру</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-indigo-400 mt-0.5 font-mono">⚡</span>
                  <span>Внимательно изучайте домены сайтов, расширения файлов (.apk) и наклейки на QR-кодах, чтобы раскрывать обман.</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setShowOnboarding(false)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transform active:scale-[0.98] transition-all text-xs uppercase tracking-wider cursor-pointer font-mono"
            >
              Включить Смартфон & Начать Симуляцию
            </button>
          </div>
        </div>
      ) : (
        /* Actual Game Frame Interface under Professional Polish Theme Layout */
        <>
          {/* Top Navigation / Status Bar */}
          <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 md:px-8 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm md:text-base font-bold tracking-tight uppercase font-display text-white">
                  Карманный Щит <span className="text-indigo-400 font-normal opacity-50 font-mono text-xs">/ v1.0</span>
                </h1>
                <span className="text-[9px] uppercase tracking-widest text-slate-500 hidden md:inline">Панель Анализа Угроз</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 md:gap-12">
              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 font-mono">Уровень Безопасности</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 md:w-64 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full bg-gradient-to-r transition-all duration-500 ${
                        state.safety >= 70 ? 'from-emerald-500 to-teal-400' : 
                        state.safety >= 40 ? 'from-amber-500 to-orange-400' : 
                        'from-red-600 to-rose-500'
                      }`}
                      style={{ width: `${state.safety}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm md:text-base font-mono font-bold ${
                    state.safety >= 70 ? 'text-emerald-400' : 
                    state.safety >= 40 ? 'text-amber-400' : 
                    'text-red-400'
                  }`}>
                    {state.safety}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-mono">Текущий этап</span>
                <span className="text-sm md:text-base font-bold text-indigo-400">{currentStep} / {totalScenarios}</span>
              </div>
            </div>
          </header>

          {/* Main Gameplay Layout */}
          <main className="flex-1 flex flex-col lg:flex-row overflow-x-hidden lg:overflow-hidden p-4 md:p-6 lg:p-8 gap-6 xl:gap-8 z-10">
            
            {/* Left Sidebar: Mission Tracker */}
            <div className="w-full lg:w-64 xl:w-72 flex flex-col gap-4 shrink-0 lg:overflow-y-auto no-scrollbar hidden lg:flex">
              <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Сценарии дня</span>
                </h3>
                
                <ul className="space-y-2.5">
                  {scenariosData.map((item) => (
                    <li 
                      key={item.id} 
                      onClick={() => setScreen(item.screen)}
                      className={`flex flex-col p-2.5 rounded-xl border transition-all cursor-pointer select-none group ${
                        item.status === 'active' 
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-white hover:bg-indigo-500/15' 
                          : item.status === 'success'
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200 hover:bg-emerald-500/10'
                          : item.status === 'failed'
                          ? 'bg-rose-500/5 border-rose-500/20 text-slate-300 hover:bg-rose-500/10'
                          : 'opacity-50 border-transparent hover:opacity-70 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'active' ? 'bg-indigo-400 animate-pulse' :
                          item.status === 'success' ? 'bg-emerald-400' :
                          item.status === 'failed' ? 'bg-rose-500' : 'bg-slate-600'
                        }`} />
                        <span className="text-xs font-bold font-display group-hover:text-indigo-300 transition-colors">
                          {item.name}
                        </span>
                        
                        {item.status === 'success' && (
                          <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.2 rounded-md font-mono ml-auto">Успех</span>
                        )}
                        {item.status === 'failed' && (
                          <span className="text-[9px] bg-rose-500/15 text-rose-400 px-1.5 py-0.2 rounded-md font-mono ml-auto">Урон</span>
                        )}
                        {item.status === 'active' && (
                          <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded-md font-mono ml-auto">В процессе</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 leading-snug group-hover:text-slate-300">
                        {item.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic educational quote */}
              <div className="mt-auto p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Совет Системы</span>
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed font-sans opacity-90">
                  «{getDynamicTip()}»
                </p>
              </div>
            </div>

            {/* Center Area: Phone Simulator */}
            <div className="flex-1 flex flex-col items-center justify-start relative overflow-y-auto no-scrollbar">
              
              {/* Virtual Glowing lines */}
              <div className="absolute -left-12 top-1/4 w-24 h-px bg-gradient-to-r from-transparent to-indigo-500/20 opacity-40 pointer-events-none hidden lg:block"></div>
              <div className="absolute -right-12 bottom-1/3 w-24 h-px bg-gradient-to-l from-transparent to-emerald-500/20 opacity-40 pointer-events-none hidden lg:block"></div>
              
              {/* The Phone Container */}
              <div className="w-full flex justify-center py-2 relative z-10 scale-90 md:scale-95 lg:scale-100 transition-transform my-auto">
                <PhoneFrame>
                  {renderScreen()}
                </PhoneFrame>
              </div>

              {/* Quick info notification below simulator on smaller devices */}
              <div className="text-center mt-1 max-w-sm px-6">
                <p className="text-[11px] text-slate-400 leading-normal">
                  💡 <strong>Подсказка:</strong> Нажмите на шторку вверху экрана телефона, чтобы прочитать новые уведомления!
                </p>
              </div>
            </div>

            {/* Right Sidebar: Threat Analysis */}
            <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-5 shrink-0 lg:overflow-y-auto no-scrollbar hidden lg:flex">
              
              {/* Active Threat Widget */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm flex flex-col gap-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Анализ Угрозы</span>
                </h3>

                <div className="space-y-3.5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Тип экрана:</span>
                      <span className="text-slate-200 font-semibold">{threat.type}</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-slate-400">Уровень угрозы:</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${threat.badgeColor} font-bold tracking-wide font-mono`}>
                        {threat.level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-px bg-slate-800/50"></div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {threat.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Feedback Logs list */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm flex-1 flex flex-col min-h-[220px]">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3.5 font-mono flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Протокол решений</span>
                </h3>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 max-h-[260px]">
                  {state.feedbackLog.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4 space-y-2 my-auto">
                      <Info className="w-8 h-8 stroke-1 text-slate-600" />
                      <p className="text-xs leading-relaxed">
                        Решения не приняты. Взаимодействуйте с приложениями на экране телефона.
                      </p>
                    </div>
                  ) : (
                    state.feedbackLog.slice().reverse().map((log, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 transition-all ${
                          log.type === 'success' 
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                            : log.type === 'danger' 
                            ? 'bg-rose-500/5 border-rose-500/20 text-rose-300' 
                            : 'bg-slate-800/40 border-slate-700/30 text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5">
                          {log.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : log.type === 'danger' ? (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between font-bold text-xs">
                            <span className="text-white">{log.title}</span>
                            <span className={`font-mono text-xs ${log.scoreChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {log.scoreChange >= 0 ? `+${log.scoreChange}` : log.scoreChange}%
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal">{log.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Mobile layout sections listed underneath on small viewports */}
          <div className="lg:hidden p-4 space-y-6 bg-slate-950/60 border-t border-slate-800 select-none">
            {/* Scenarios Checklist Widget */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>Сценарии дня</span>
              </h3>
              
              <ul className="space-y-2.5">
                {scenariosData.map((item) => (
                  <li 
                    key={item.id} 
                    onClick={() => setScreen(item.screen)}
                    className={`flex flex-col p-2.5 rounded-xl border transition-all cursor-pointer ${
                      item.status === 'active' 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-white' 
                        : item.status === 'success'
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200'
                        : item.status === 'failed'
                        ? 'bg-rose-500/5 border-rose-500/20 text-slate-300'
                        : 'opacity-50 border-transparent text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'active' ? 'bg-indigo-400 animate-pulse' :
                        item.status === 'success' ? 'bg-emerald-400' :
                        item.status === 'failed' ? 'bg-rose-500' : 'bg-slate-600'
                      }`} />
                      <span className="text-xs font-bold font-display">
                        {item.name}
                      </span>
                      {item.status === 'success' && (
                        <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.2 rounded-md font-mono ml-auto">Успех</span>
                      )}
                      {item.status === 'failed' && (
                        <span className="text-[9px] bg-rose-500/15 text-rose-400 px-1.5 py-0.2 rounded-md font-mono ml-auto">Урон</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threat analysis widget */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex flex-col gap-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Анализ Угрозы</span>
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-mono">Объект:</span>
                  <span className="text-slate-200 font-semibold">{threat.type}</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-slate-400 font-mono">Уровень:</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${threat.badgeColor} font-bold font-mono`}>
                    {threat.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-2">
                  {threat.desc}
                </p>
              </div>
            </div>

            {/* Decision Log Widget */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3.5 font-mono flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Протокол решений</span>
              </h3>
              <div className="space-y-2">
                {state.feedbackLog.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">Решения не приняты.</p>
                ) : (
                  state.feedbackLog.slice().reverse().map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-2.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                        log.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
                      }`}
                    >
                      <span className="font-bold text-white flex-1">{log.title}</span>
                      <span className={`font-mono font-bold ${log.scoreChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {log.scoreChange >= 0 ? `+${log.scoreChange}` : log.scoreChange}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer / System Console */}
          <footer className="h-12 border-t border-slate-800 bg-slate-950 px-4 md:px-8 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                SYS_LOG: SCREEN_{state.screen.toUpperCase()}_ACTIVE
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                SAFETY_LVL: {state.safety}%
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Reset Game button */}
              <button
                onClick={resetGame}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-white transition-all cursor-pointer font-mono"
                title="Перезапустить симуляцию с начала"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Сбросить симуляцию</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider hidden xs:inline">
                  Шифрование активно
                </span>
              </div>
            </div>
          </footer>
        </>
      )}
      
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}

