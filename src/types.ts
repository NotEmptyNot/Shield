export type PhoneScreen =
  | 'desktop'
  | 'messages'
  | 'messenger'
  | 'camera'
  | 'bank'
  | 'browser'
  | 'winlocker'
  | 'outro';

export interface Notification {
  id: string;
  app: 'messages' | 'messenger' | 'bank' | 'system';
  sender: string;
  title: string;
  text: string;
  time: string;
  unread: boolean;
  eventKey: 'delivery' | 'sec_update' | 'cashback';
}

export interface GameState {
  safety: number; // 0 - 100
  screen: PhoneScreen;
  theme: 'light' | 'dark';
  currentNotification: Notification | null;
  notifications: Notification[];
  isLocked: boolean; // True if infected by winlocker
  dayFinished: boolean;
  
  // Scenario states
  deliveryState: 'pending' | 'clicked_link' | 'card_entered' | 'deleted' | 'done';
  messengerState: 'pending' | 'asked_who' | 'installed_apk' | 'blocked' | 'done';
  cashbackState: 'pending' | 'clicked' | 'ignored' | 'done';
  
  // QRishing state
  qrLocation: 'restaurant' | 'bus';
  qrRestaurantState: 'pending' | 'scanned' | 'clicked_link' | 'entered_wallet' | 'cancelled' | 'done';
  qrBusState: 'pending' | 'scanned' | 'clicked_link' | 'entered_auth' | 'cancelled' | 'done';
  
  // History of player decisions and feedback
  feedbackLog: {
    title: string;
    description: string;
    type: 'success' | 'warning' | 'danger';
    scoreChange: number;
  }[];
}
