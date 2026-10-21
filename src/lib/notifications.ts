export type NotificationActionType =
  | 'owner_approved'
  | 'owner_deleted'
  | 'center_approved'
  | 'center_suspended';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;

  if (window.Notification.permission === 'granted') return true;
  if (window.Notification.permission === 'denied') return false;

  const permission = await window.Notification.requestPermission();
  return permission === 'granted';
}

export async function showNotification(payload: NotificationPayload): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  const allowed = await requestNotificationPermission();
  if (!allowed) return;

  new window.Notification(payload.title, {
    body: payload.body,
    icon: payload.icon ?? '/favicon.ico',
    tag: payload.title.toLowerCase().replace(/\s+/g, '-'),
  });
}

export async function showActionNotification(
  action: NotificationActionType,
  name: string,
): Promise<void> {
  const payloads: Record<NotificationActionType, NotificationPayload> = {
    owner_approved: {
      title: 'Owner approved',
      body: `${name} has been approved successfully.`,
    },
    owner_deleted: {
      title: 'Owner removed',
      body: `${name} has been removed from the platform.`,
    },
    center_approved: {
      title: 'Center approved',
      body: `${name} is now active and visible to customers.`,
    },
    center_suspended: {
      title: 'Center suspended',
      body: `${name} has been suspended.`,
    },
  };

  await showNotification(payloads[action]);
}
