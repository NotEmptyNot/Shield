import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Camera, 
  RotateCw, 
  X, 
  Check, 
  MapPin, 
  Compass, 
  Sparkles, 
  Scan,
  AlertTriangle,
  Info
} from 'lucide-react';

export const CameraApp: React.FC = () => {
  const { state, handleQrAction, switchQrLocation, setScreen } = useGame();
  const { qrLocation, qrRestaurantState, qrBusState } = state;

  const currentStatus = qrLocation === 'restaurant' ? qrRestaurantState : qrBusState;

  return (
    <div className="flex-1 flex flex-col h-full bg-black text-white select-none relative">
      
      {/* Top Camera Header bar */}
      <div className="px-4 py-3 bg-black/80 flex justify-between items-center z-20 shrink-0">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-neutral-300" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">QR-Сканер</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800">
          <MapPin className="w-3 h-3 text-red-400" />
          <span>{qrLocation === 'restaurant' ? 'Ресторан «Аллея»' : 'Остановка «Проспект»'}</span>
        </div>
      </div>

      {/* Main Viewfinder Section */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-neutral-950">
        
        {/* Viewfinder Overlay brackets */}
        <div className="absolute inset-0 border-[30px] border-black/40 z-10 pointer-events-none"></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none z-10">
          <div className="border-r border-b border-dashed border-neutral-300"></div>
          <div className="border-r border-b border-dashed border-neutral-300"></div>
          <div className="border-b border-dashed border-neutral-300"></div>
          <div className="border-r border-b border-dashed border-neutral-300"></div>
          <div className="border-r border-b border-dashed border-neutral-300"></div>
          <div className="border-b border-dashed border-neutral-300"></div>
        </div>

        {/* Dynamic Location Scenes */}
        {qrLocation === 'restaurant' ? (
          /* Restaurant Table Scene */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            
            {/* Plates and details */}
            <div className="relative w-64 h-64 bg-neutral-900 rounded-full border border-neutral-800 flex flex-col items-center justify-center p-4 shadow-inner transition-transform duration-300">
              <div className="absolute top-2 w-12 h-1.5 bg-neutral-700 rounded-full"></div>
              
              {/* Menu Card table-tent */}
              <div className="w-40 h-44 bg-zinc-800 border-2 border-zinc-700 rounded-xl p-3 flex flex-col items-center justify-between shadow-2xl relative">
                <span className="text-[10px] font-bold text-amber-400 tracking-wider">RESTAURANT MENU</span>
                <p className="text-[7px] text-zinc-400 leading-tight">Оплата картой по QR-коду со скидкой 10%</p>
                
                {/* QR Code box */}
                <div className="relative w-20 h-20 bg-white p-1 rounded-lg flex items-center justify-center border border-zinc-500 shadow-md">
                  {/* Real-looking abstract QR pattern */}
                  <div className="w-full h-full bg-neutral-900 flex flex-wrap p-0.5 rounded">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1/4 h-1/4 border-[1px] border-white ${
                          (i % 3 === 0 || i === 0 || i === 15 || i === 5 || i === 10) 
                            ? 'bg-black' 
                            : 'bg-white'
                        }`}
                      ></div>
                    ))}
                  </div>

                  {/* Crooked Over-Stuck sticker visual */}
                  <div className="absolute -inset-0.5 bg-amber-50 rounded-lg p-1 flex items-center justify-center border-2 border-red-500 rotate-6 shadow-lg animate-pulse" title="Странная наклейка сверху">
                    <div className="w-full h-full bg-neutral-950 flex flex-wrap p-0.5 rounded relative">
                      {/* Fake QR mini marker */}
                      <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-red-600 rounded-sm"></div>
                      <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-red-600 rounded-sm"></div>
                      
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1/4 h-1/4 border-[0.5px] border-neutral-950 ${
                            (i % 2 === 0 || i === 1 || i === 14) 
                              ? 'bg-neutral-900' 
                              : 'bg-amber-50'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[6px] text-neutral-500 uppercase tracking-widest">Аллея у дома</span>
              </div>
            </div>

            {/* Educational clue box */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 border border-neutral-800 p-2.5 rounded-xl z-20 text-left">
              <div className="flex gap-1.5 items-start">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-neutral-300 leading-normal">
                  🔍 Внимательно присмотритесь: поверх оригинального QR-кода наклеена другая, слегка смещенная и неровная бумажка. Нажмите «Сканировать», чтобы прочесть её.
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* Bus Stop Scene */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            
            {/* Bus Stop Glass Container */}
            <div className="w-72 h-80 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-between shadow-2xl relative">
              <div className="absolute inset-x-0 top-0 h-10 bg-indigo-600 rounded-t-2xl flex items-center justify-center">
                <span className="text-xs font-black tracking-widest text-white">Реклама Города</span>
              </div>

              {/* Contest Poster */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 mt-4 space-y-2">
                <div className="bg-red-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-full transform -rotate-2 shadow">
                  МЕГА-АКЦИЯ 2026!
                </div>
                <h4 className="text-sm font-black text-neutral-100 tracking-tight leading-tight uppercase">
                  Выиграй годовой<br/>проездной бесплатно!
                </h4>
                <p className="text-[9px] text-neutral-400">Каждый 10-й скан выигрывает проездной на все типы транспорта!</p>
                
                {/* QR Code box */}
                <div className="relative w-20 h-20 bg-white p-1.5 rounded-xl flex items-center justify-center border-2 border-dashed border-indigo-500 shadow-lg">
                  <div className="w-full h-full bg-black flex flex-wrap p-0.5 rounded">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1/4 h-1/4 border-[1px] border-white ${
                          (i % 3 === 0 || i === 0 || i === 15) 
                            ? 'bg-black' 
                            : 'bg-white'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                <span className="text-[8px] text-neutral-500">Организатор: МосМетро Промо</span>
              </div>
            </div>

            {/* Clue box */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 border border-neutral-800 p-2.5 rounded-xl z-20 text-left">
              <div className="flex gap-1.5 items-start">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-neutral-300 leading-normal">
                  🎁 Заманчивый плакат обещает халяву прямо на остановке. Мошенники обожают клеить вредоносные QR-коды в людных транзитных зонах. Нажмите «Сканировать».
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Scanner crosshair box */}
        {currentStatus === 'pending' && (
          <button 
            onClick={() => handleQrAction(qrLocation, 'scan')}
            className="absolute inset-0 m-auto w-40 h-40 border-2 border-amber-500/80 rounded-2xl flex flex-col items-center justify-center bg-black/10 hover:bg-black/20 transition-all cursor-pointer z-20 group"
          >
            <Scan className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold tracking-wider uppercase mt-2 text-amber-400 group-hover:text-amber-300">
              Сканировать
            </span>
            
            {/* Viewfinder brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>
          </button>
        )}

        {/* NATIVE SYSTEM TOOLTIP POPUP (QR Link found) */}
        {currentStatus === 'scanned' && (
          <div className="absolute bottom-20 inset-x-4 bg-zinc-900 border-[1.5px] border-amber-500/40 rounded-2xl p-4 shadow-2xl z-40 animate-fade-in text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <Scan className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-neutral-100 flex items-center gap-1">
                  Обнаружена ссылка в QR-коде
                </h4>
                <p className="text-[9px] text-neutral-400">Система безопасности рекомендует проверить домен перед кликом:</p>
                
                {/* Real-looking address block */}
                <div className="mt-2 p-2 rounded-xl bg-black border border-neutral-800 font-mono text-[11px] text-amber-400 break-all select-all">
                  {qrLocation === 'restaurant' 
                    ? 'https://telegra.ph/Oplata-v-Restorane-123' 
                    : 'https://mosmetro.ru-promo-2026.com/auth'}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  if (qrLocation === 'restaurant') {
                    handleQrAction('restaurant', 'click_link');
                  } else {
                    handleQrAction('bus', 'click_link');
                  }
                  setScreen('browser');
                }}
                className="py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs transition-colors"
              >
                Перейти
              </button>
              <button 
                onClick={() => handleQrAction(qrLocation, 'cancel')}
                className="py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Finished State overlay */}
        {(currentStatus === 'done' || currentStatus === 'cancelled') && (
          <div className="absolute inset-0 bg-neutral-950/90 z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              currentStatus === 'cancelled' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {currentStatus === 'cancelled' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </div>
            <h3 className="text-sm font-bold text-neutral-100 mb-1">
              {currentStatus === 'cancelled' ? 'Угроза предотвращена!' : 'Обработка завершена'}
            </h3>
            <p className="text-xs text-neutral-400 leading-normal max-w-xs mb-4">
              {currentStatus === 'cancelled' 
                ? 'Вы успешно отменили сканирование вредоносного QR-кода и защитили свои средства.' 
                : 'QR-код был активирован. Это решение отразилось в вашем журнале безопасности.'}
            </p>
            <button 
              onClick={() => {
                // If there's another pending location, switch to it, otherwise go back to desktop
                const otherLoc = qrLocation === 'restaurant' ? 'bus' : 'restaurant';
                const otherStatus = otherLoc === 'restaurant' ? qrRestaurantState : qrBusState;
                if (otherStatus === 'pending') {
                  switchQrLocation(otherLoc);
                } else {
                  setScreen('desktop');
                }
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl transition-colors font-semibold"
            >
              Дальше
            </button>
          </div>
        )}

      </div>

      {/* Swipe selector for locations at bottom */}
      <div className="bg-black/90 px-4 py-3 border-t border-neutral-900 flex flex-col gap-2 shrink-0 z-20">
        <span className="text-[9px] uppercase tracking-wider text-neutral-500 text-center font-bold">Сменить Локацию Сканирования</span>
        <div className="grid grid-cols-2 gap-2">
          <button 
            disabled={qrRestaurantState !== 'pending' && qrRestaurantState !== 'scanned'}
            onClick={() => switchQrLocation('restaurant')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              qrLocation === 'restaurant' 
                ? 'bg-amber-500 text-neutral-950 shadow' 
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            } disabled:opacity-40`}
          >
            <span>Ресторан</span>
            {qrRestaurantState !== 'pending' && <span className="text-[9px]">({qrRestaurantState === 'cancelled' ? '✅' : '❌'})</span>}
          </button>
          
          <button 
            disabled={qrBusState !== 'pending' && qrBusState !== 'scanned'}
            onClick={() => switchQrLocation('bus')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              qrLocation === 'bus' 
                ? 'bg-amber-500 text-neutral-950 shadow' 
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            } disabled:opacity-40`}
          >
            <span>Остановка</span>
            {qrBusState !== 'pending' && <span className="text-[9px]">({qrBusState === 'cancelled' ? '✅' : '❌'})</span>}
          </button>
        </div>
      </div>

    </div>
  );
};
