import { FIREBASE_MESSAGING_VAPID_KEY } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import { createFCMToken } from '@services/fcm';
import { getFCMToken, removeFCMToken, setFCMToken } from '@utils/firebase';
import log from '@utils/logger';
import {
  getMessaging,
  getToken,
  MessagePayload,
  Messaging,
  onMessage,
  deleteToken,
} from 'firebase/messaging';
import getFirebaseApp from './base';

const firebaseApp = getFirebaseApp();
const LOG_PREFIX = 'FirebaseMessaging';

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging: Messaging = getMessaging(firebaseApp);

export const getClientToken = async (): Promise<string | null> => {
  try {
    const tokenInStorage = getFCMToken();
    if (tokenInStorage !== null) {
      return tokenInStorage;
    }

    const fcmToken = await getToken(messaging, {
      vapidKey: FIREBASE_MESSAGING_VAPID_KEY,
    });

    if (fcmToken) {
      // Save into localstorage
      setFCMToken(fcmToken);

      // Send to server
      await createFCMToken({
        device_type: 'web',
        registration_token: fcmToken,
      });

      return fcmToken;
    }

    return null;
  } catch (err: unknown) {
    log('failed to get fcm token', LogLevel.ERROR, LOG_PREFIX);
    return null;
  }
};

export const registerNotification = () => {
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.onBackgroundMessage` handler.
  onMessage(messaging, (payload: MessagePayload) => {
    const { data } = payload;
    const { title, body, icon } = data as {
      title: string;
      body: string;
      icon: string;
    };
    // Customize notification here
    const notificationTitle = title;
    const notificationOptions = {
      body,
      icon,
    };
    return new Notification(notificationTitle, notificationOptions);
  });
};

export const disableNotification = async (): Promise<void> => {
  await deleteToken(messaging);
  removeFCMToken();
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      return true;
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return true;
      }
    }
  }

  return false;
};
