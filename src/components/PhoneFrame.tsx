import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Wifi, 
  Battery, 
  ChevronDown, 
  Settings, 
  Bell, 
  ShieldAlert,
  ChevronUp, 
  RefreshCw,
  Moon,
  Sun,
  X,
  MessageSquare,
  Lock,
  Compass
} from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const { state, toggleTheme, setScreen, dismissNotification } = useGame();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { safety, theme, notifications, screen } = state;

  const currentHour = "14";
  const currentMinute = "20";

  const appIcons: Record<string, React.ReactNode> = {
    messages: <MessageSquare className="w-5 h-5 text-blue-500" />,
    messenger: <Lock className="w-5 h-5 text-green-500" />,
    bank: <ShieldAlert className="w-5 h-5 text-emerald-500" />,
    system: <Settings className="w-5 h-5 text-gray-500" />,
  };

  const appNames: Record<string, string> = {
    messages: 'Сообщения',
    messenger: 'Мессенджер',
    bank: 'MyBank',
    system: 'Система',
  };

  const handleNotificationClick = (n: any) => {
    setDrawerOpen(false);
    if (n.eventKey === 'delivery') {
      setScreen('messages');
    } else if (n.eventKey === 'sec_update') {
      setScreen('messenger');
    } else if (n.eventKey === 'cashback') {
      setScreen('bank');
    }
  };

  // Outer bezel color based on phone theme choice
  const bezelColor = theme === 'dark' ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-300 bg-neutral-100';
  const screenBg = theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-slate-50 text-slate-900';

  return (
    <div className="relative flex flex-col items-center justify-center py-2 px-2">
      {/* Device frame container */}
      <div className={`relative w-[340px] h-[680px] rounded-[48px] border-[10px] ${bezelColor} shadow-2xl transition-all duration-300 flex flex-col overflow-hidden`}>
        
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50"></div>
        </div>

        {/* Home gesture bar / screen bottom bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-neutral-500/60 rounded-full z-40 cursor-pointer hover:bg-neutral-400" onClick={() => setScreen('desktop')}></div>

        {/* Status Bar */}
        <div className={`w-full h-11 px-6 pt-3 flex justify-between items-center z-40 text-xs font-semibold select-none ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
          <div className="flex items-center gap-1">
            <span>{currentHour}:{currentMinute}</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold ml-1">Shield_Net</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Health Shield Indicator */}
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => setDrawerOpen(true)}>
              <div className={`w-2 h-2 rounded-full ${safety > 50 ? 'bg-emerald-500' : safety > 25 ? 'bg-amber-500' : 'bg-red-500'} pulse-circle`}></div>
              <span className={`text-[10px] ${safety > 50 ? 'text-emerald-500' : safety > 25 ? 'text-amber-500' : 'text-red-500'}`}>Щит: {safety}%</span>
            </div>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-medium">84%</span>
              <Battery className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            </div>
          </div>
        </div>

        {/* Main Screen Content Wrapper */}
        <div className={`flex-1 relative overflow-hidden flex flex-col ${screenBg} z-10 no-scrollbar`}>
          {children}

          {/* Interactive Pull-Down Notification shade handler */}
          <div 
            onClick={() => setDrawerOpen(true)}
            className="absolute top-0 left-0 w-full h-2 hover:bg-neutral-500/10 cursor-ns-resize z-40 flex justify-center"
            title="Потяните вниз для просмотра уведомлений"
          >
            <ChevronDown className="w-4 h-4 text-neutral-400 -mt-1 opacity-50" />
          </div>

          {/* Full Notifications Drawer / Shade */}
          <div className={`absolute inset-0 bg-neutral-950/95 backdrop-blur-md z-50 flex flex-col transition-all duration-300 ${drawerOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <div className="px-6 pt-12 pb-4 border-b border-neutral-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-bold text-neutral-200">Центр Уведомлений</span>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Shade Settings Controls */}
            <div className="px-6 py-4 bg-neutral-900/50 border-b border-neutral-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Тема ОС:</span>
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Светлая</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Темная</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Безопасность:</span>
                <div className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${safety > 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {safety}%
                </div>
              </div>
            </div>

            {/* List of Notifications inside the Shade */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-2">
                  <Bell className="w-10 h-10 stroke-1" />
                  <p className="text-xs">Нет новых уведомлений</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className="relative bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800 rounded-2xl p-3 shadow-md transition-all cursor-pointer"
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        {appIcons[n.app]}
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                          {appNames[n.app]} • {n.sender}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-neutral-500">{n.time}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(n.id);
                          }}
                          className="p-0.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300"
                          title="Смахнуть"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {n.unread && (
                      <div className="absolute top-3 right-8 w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                    <h4 className="text-xs font-bold text-neutral-200">{n.title}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">{n.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-neutral-900/20 border-t border-neutral-800 text-center">
              <p className="text-[10px] text-neutral-500">Потяните вверх или нажмите на стрелку, чтобы закрыть шторку</p>
            </div>
          </div>
        </div>
      </div>

      {/* Frame stand reflection/shadow */}
      <div className="w-[300px] h-3 bg-neutral-900/10 rounded-full blur-md mt-2"></div>
    </div>
  );
};
