import { AppNotification } from '../types';
import { delay, nextId } from '../data/mockData';

const mockNotifications: AppNotification[] = [];

export async function createNotification(
  gymId: string,
  userId: string,
  title: string,
  message: string
): Promise<AppNotification> {
  await delay();
  const notification: AppNotification = {
    notificationId: nextId('notif'),
    gymId,
    userId,
    title,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  mockNotifications.unshift(notification);
  return { ...notification };
}

export async function getNotificationsByUser(gymId: string, userId: string): Promise<AppNotification[]> {
  await delay();
  return mockNotifications
    .filter((n) => n.gymId === gymId && n.userId === userId)
    .map((n) => ({ ...n }));
}
