import { FIREBASE_MESSAGING_VAPID_KEY } from '@constants/config';
import { ICreateNotificationOptions } from '@interfaces/firebase/messaging';
import { getFCMToken, setFCMToken } from '@utils/firebase';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';
import getFirebaseApp from './base';

const firebaseApp = getFirebaseApp();

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging: Messaging = getMessaging(firebaseApp);

export const getClientToken = async (): Promise<string | null> => {
  const tokenInStorage = getFCMToken();
  if (tokenInStorage !== null) {
    return tokenInStorage;
  }

  const isApproved = await requestNotificationPermission();
  if (isApproved) {
    const fcmToken = await getToken(messaging, {
      vapidKey: FIREBASE_MESSAGING_VAPID_KEY,
    });
    if (fcmToken) {
      // Save into localstorage
      setFCMToken(fcmToken);
      // Send to server
      return fcmToken;
    }
  }

  return null;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return true;
      }
    }
  }

  return false;
};

export const createNotification = (
  options: ICreateNotificationOptions
): Notification => {
  const { title, body, icon } = options;
  const notiOps = {
    body,
    icon,
  };

  return new Notification(title, notiOps);
};
