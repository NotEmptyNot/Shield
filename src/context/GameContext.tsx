import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, Notification, PhoneScreen } from '../types';

interface GameContextProps {
  state: GameState;
  setScreen: (screen: PhoneScreen) => void;
  toggleTheme: () => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  handleDeliveryAction: (action: 'click_link' | 'enter_card' | 'delete' | 'back') => void;
  handleMessengerAction: (action: 'download' | 'ask' | 'block' | 'back') => void;
  handleCashbackAction: (action: 'click' | 'dismiss') => void;
  handleQrAction: (location: 'restaurant' | 'bus', action: 'scan' | 'click_link' | 'submit_action' | 'cancel') => void;
  switchQrLocation: (location: 'restaurant' | 'bus') => void;
  resetGame: () => void;
  addFeedbackLog: (title: string, description: string, type: 'success' | 'warning' | 'danger', scoreChange: number) => void;
}

const initialNotifications: Notification[] = [
  {
    id: 'delivery',
    app: 'messages',
    sender: 'Info_Delivery',
    title: 'SMS от Info_Delivery',
    text: 'Уважаемый клиент! Ваша посылка приостановлена из-за неоплаченной таможенной пошлины (99 руб). Оплатите по ссылке: https://cdek-post-pay.ru/track иначе посылка будет возвращена.',
    time: '10:14',
    unread: true,
    eventKey: 'delivery',
  },
  {
    id: 'sec_update',
    app: 'messenger',
    sender: 'Служба Поддержки',
    title: 'Служба Поддержки',
    text: 'Зафиксирована попытка входа в ваш аккаунт из г. Самара. Если это не вы, срочно установите обновление безопасности, чтобы мы могли отменить операцию: SecureUpdate.apk (файл прикреплен).',
    time: '11:45',
    unread: true,
    eventKey: 'sec_update',
  },
  {
    id: 'cashback',
    app: 'bank',
    sender: 'MyBank',
    title: 'Начисление кэшбэка',
    text: 'Вам начислен кэшбэк 1500 рублей за прошлый месяц. Подробности в приложении.',
    time: '14:20',
    unread: true,
    eventKey: 'cashback',
  }
];

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>({
    safety: 100,
    screen: 'desktop',
    theme: 'dark',
    currentNotification: null,
    notifications: initialNotifications,
    isLocked: false,
    dayFinished: false,
    deliveryState: 'pending',
    messengerState: 'pending',
    cashbackState: 'pending',
    qrLocation: 'restaurant',
    qrRestaurantState: 'pending',
    qrBusState: 'pending',
    feedbackLog: [],
  });

  // Track if all events have been resolved to finish the day
  useEffect(() => {
    const isDeliveryDone = state.deliveryState === 'done' || state.deliveryState === 'deleted';
    const isMessengerDone = state.messengerState === 'done' || state.messengerState === 'blocked';
    const isCashbackDone = state.cashbackState === 'done' || state.cashbackState === 'ignored';
    const isQrRestaurantDone = state.qrRestaurantState === 'done' || state.qrRestaurantState === 'cancelled';
    const isQrBusDone = state.qrBusState === 'done' || state.qrBusState === 'cancelled';

    if (isDeliveryDone && isMessengerDone && isCashbackDone && isQrRestaurantDone && isQrBusDone && !state.dayFinished) {
      setState(prev => ({ ...prev, dayFinished: true, screen: 'outro' }));
    }
  }, [
    state.deliveryState,
    state.messengerState,
    state.cashbackState,
    state.qrRestaurantState,
    state.qrBusState,
    state.dayFinished,
  ]);

  // Handle game over by safety dropping to 0
  useEffect(() => {
    if (state.safety <= 0 && state.screen !== 'winlocker' && state.screen !== 'outro') {
      setState(prev => ({ ...prev, safety: 0, dayFinished: true, screen: 'outro' }));
    }
  }, [state.safety, state.screen]);

  const setScreen = (screen: PhoneScreen) => {
    if (state.isLocked && screen !== 'winlocker') {
      return; // Can't switch screen if locked by ransomware
    }
    setState(prev => ({ ...prev, screen }));
  };

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const markAsRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, unread: false } : n),
    }));
  };

  const dismissNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  };

  const addFeedbackLog = (
    title: string,
    description: string,
    type: 'success' | 'warning' | 'danger',
    scoreChange: number
  ) => {
    setState(prev => {
      const newSafety = Math.max(0, Math.min(100, prev.safety + scoreChange));
      return {
        ...prev,
        safety: newSafety,
        feedbackLog: [
          ...prev.feedbackLog,
          { title, description, type, scoreChange },
        ],
      };
    });
  };

  // --- Scenario Handlers ---

  // Event 1: Smishing
  const handleDeliveryAction = (action: 'click_link' | 'enter_card' | 'delete' | 'back') => {
    if (action === 'click_link') {
      setState(prev => ({
        ...prev,
        deliveryState: 'clicked_link',
        screen: 'browser',
        notifications: prev.notifications.map(n => n.id === 'delivery' ? { ...n, unread: false } : n),
      }));
    } else if (action === 'enter_card') {
      // Penalty: -50% Safety
      addFeedbackLog(
        'Ошибка: Оплата фишинговой пошлины',
        'Вы ввели данные карты на сайте cdek-post-pay.ru. Официальные службы не требуют доплат через сомнительные ссылки с дефисами. Правильный домен — cdek.ru.',
        'danger',
        -50
      );
      // Trigger dynamic bank notification about the card block
      const bankAlert: Notification = {
        id: 'bank_alert_smishing',
        app: 'bank',
        sender: 'MyBank',
        title: 'Блокировка карты',
        text: 'Списание 5000 руб. Карта заблокирована из-за подозрительной транзакции.',
        time: '10:16',
        unread: true,
        eventKey: 'cashback', // generic bank
      };
      setState(prev => ({
        ...prev,
        deliveryState: 'done',
        screen: 'messages',
        notifications: [bankAlert, ...prev.notifications.filter(n => n.id !== 'delivery')],
      }));
    } else if (action === 'delete') {
      // Success: +10% Safety
      addFeedbackLog(
        'Успех: Смишинг заблокирован!',
        'Отлично! Вы распознали фишинг. Службы доставки крайне редко присылают ссылки на оплату таможенных пошлин через SMS.',
        'success',
        10
      );
      setState(prev => ({
        ...prev,
        deliveryState: 'deleted',
        screen: 'desktop',
        notifications: prev.notifications.filter(n => n.id !== 'delivery'),
      }));
    } else if (action === 'back') {
      setState(prev => ({ ...prev, screen: 'messages' }));
    }
  };

  // Event 2: Safe Update Spoof Messenger Chat
  const handleMessengerAction = (action: 'download' | 'ask' | 'block' | 'back') => {
    if (action === 'download') {
      // CRITICAL FAIL: Winlocker Game Over
      addFeedbackLog(
        'Критический провал: Установка трояна',
        'Вы установили вредоносный файл SecureUpdate.apk. Банки никогда не присылают обновления в виде .apk файлов в мессенджерах. Обновления скачиваются только из официальных магазинов приложений (App Store / Google Play).',
        'danger',
        -100
      );
      setState(prev => ({
        ...prev,
        messengerState: 'installed_apk',
        isLocked: true,
        screen: 'winlocker',
      }));
    } else if (action === 'ask') {
      setState(prev => ({
        ...prev,
        messengerState: 'asked_who',
      }));
    } else if (action === 'block') {
      // Success: +20% Safety
      addFeedbackLog(
        'Успех: Мошенники заблокированы!',
        'Блестяще! Настоящие банки звонят или присылают пуш-уведомления в официальном приложении, а не отправляют установочные APK-файлы в Telegram/WhatsApp.',
        'success',
        20
      );
      setState(prev => ({
        ...prev,
        messengerState: 'blocked',
        screen: 'desktop',
        notifications: prev.notifications.filter(n => n.id !== 'sec_update'),
      }));
    } else if (action === 'back') {
      setState(prev => ({ ...prev, screen: 'messenger' }));
    }
  };

  // Event 3: Ordinary cashback push
  const handleCashbackAction = (action: 'click' | 'dismiss') => {
    if (action === 'click') {
      // Success: +10% Safety
      addFeedbackLog(
        'Успех: Проверка уведомления',
        'Правильно! Это было настоящее системное уведомление. В нем не было подозрительных внешних ссылок, и оно безопасно перевело вас в официальное приложение банка.',
        'success',
        10
      );
      setState(prev => ({
        ...prev,
        cashbackState: 'done',
        screen: 'bank',
        notifications: prev.notifications.filter(n => n.id !== 'cashback'),
      }));
    } else if (action === 'dismiss') {
      // Neutral
      addFeedbackLog(
        'Нейтрально: Игнорирование уведомления',
        'Вы смахнули push-уведомление от MyBank. Это безопасно, хотя предложение кэшбэка действительно было настоящим.',
        'warning',
        0
      );
      setState(prev => ({
        ...prev,
        cashbackState: 'ignored',
        screen: 'desktop',
        notifications: prev.notifications.filter(n => n.id !== 'cashback'),
      }));
    }
  };

  // Event 4: QRishing (Restaurant & Bus Stop)
  const handleQrAction = (
    location: 'restaurant' | 'bus',
    action: 'scan' | 'click_link' | 'submit_action' | 'cancel'
  ) => {
    if (location === 'restaurant') {
      if (action === 'scan') {
        setState(prev => ({ ...prev, qrRestaurantState: 'scanned' }));
      } else if (action === 'click_link') {
        setState(prev => ({ ...prev, qrRestaurantState: 'clicked_link' }));
      } else if (action === 'submit_action') {
        // Penalty: -40% Safety
        addFeedbackLog(
          'Ошибка: QRishing в ресторане',
          'Ошибка! Вы совершили платеж на фишинговом сайте (telegra.ph). Вы не обратили внимание на криво наклеенную наклейку поверх оригинального QR-кода на тейбл-тенте. Настоящее меню заведения ведет на официальный сайт ресторана, а не на сторонние блоговые платформы.',
          'danger',
          -40
        );
        setState(prev => ({ ...prev, qrRestaurantState: 'done', screen: 'camera' }));
      } else if (action === 'cancel') {
        // Success: +15% Safety
        addFeedbackLog(
          'Успех: Предотвращен QR-фишинг',
          'Отлично! Вы заметили подозрительную наклейку на тейбл-тенте в ресторане и странный адрес (telegra.ph), отменив переход по ссылке.',
          'success',
          15
        );
        setState(prev => ({ ...prev, qrRestaurantState: 'cancelled', screen: 'camera' }));
      }
    } else if (location === 'bus') {
      if (action === 'scan') {
        setState(prev => ({ ...prev, qrBusState: 'scanned' }));
      } else if (action === 'click_link') {
        setState(prev => ({ ...prev, qrBusState: 'clicked_link' }));
      } else if (action === 'submit_action') {
        // Penalty: -40% Safety
        addFeedbackLog(
          'Ошибка: Фишинг на автобусной остановке',
          'Фишинг! Домен mosmetro.ru-promo-2026.com является поддельным (тайпсквоттинг). Вы ввели логин и пароль от аккаунта Госуслуг. Официальный промо-сайт выглядел бы как promo.mosmetro.ru.',
          'danger',
          -40
        );
        setState(prev => ({ ...prev, qrBusState: 'done', screen: 'camera' }));
      } else if (action === 'cancel') {
        // Success: +15% Safety
        addFeedbackLog(
          'Успех: Распознан тайпсквоттинг',
          'Потрясающе! Вы распознали поддельный домен mosmetro.ru-promo-2026.com и отказались вводить конфиденциальные данные. Бесплатный сыр бывает только в мышеловке!',
          'success',
          15
        );
        setState(prev => ({ ...prev, qrBusState: 'cancelled', screen: 'camera' }));
      }
    }
  };

  const switchQrLocation = (location: 'restaurant' | 'bus') => {
    setState(prev => ({ ...prev, qrLocation: location }));
  };

  const resetGame = () => {
    setState({
      safety: 100,
      screen: 'desktop',
      theme: 'dark',
      currentNotification: null,
      notifications: [
        {
          id: 'delivery',
          app: 'messages',
          sender: 'Info_Delivery',
          title: 'SMS от Info_Delivery',
          text: 'Уважаемый клиент! Ваша посылка приостановлена из-за неоплаченной таможенной пошлины (99 руб). Оплатите по ссылке: https://cdek-post-pay.ru/track иначе посылка будет возвращена.',
          time: '10:14',
          unread: true,
          eventKey: 'delivery',
        },
        {
          id: 'sec_update',
          app: 'messenger',
          sender: 'Служба Поддержки',
          title: 'Служба Поддержки',
          text: 'Зафиксирована попытка входа в ваш аккаунт из г. Самара. Если это не вы, срочно установите обновление безопасности, чтобы мы могли отменить операцию: SecureUpdate.apk (файл прикреплен).',
          time: '11:45',
          unread: true,
          eventKey: 'sec_update',
        },
        {
          id: 'cashback',
          app: 'bank',
          sender: 'MyBank',
          title: 'Начисление кэшбэка',
          text: 'Вам начислен кэшбэк 1500 рублей за прошлый месяц. Подробности в приложении.',
          time: '14:20',
          unread: true,
          eventKey: 'cashback',
        }
      ],
      isLocked: false,
      dayFinished: false,
      deliveryState: 'pending',
      messengerState: 'pending',
      cashbackState: 'pending',
      qrLocation: 'restaurant',
      qrRestaurantState: 'pending',
      qrBusState: 'pending',
      feedbackLog: [],
    });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        setScreen,
        toggleTheme,
        markAsRead,
        dismissNotification,
        handleDeliveryAction,
        handleMessengerAction,
        handleCashbackAction,
        handleQrAction,
        switchQrLocation,
        resetGame,
        addFeedbackLog,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
