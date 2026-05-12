export type NetworkStatus =
  | 'unknown'
  | 'online'
  | 'offline';

type Listener =
  (status: NetworkStatus) => void;

let currentStatus: NetworkStatus =
  'unknown';

const listeners =
  new Set<Listener>();

export function getNetworkStatus() {

  return currentStatus;
}

export function isNetworkOffline() {

  return currentStatus === 'offline';
}

export function setNetworkStatus(
  status: NetworkStatus
) {

  if (currentStatus === status) {
    return;
  }

  currentStatus = status;

  listeners.forEach(
    (listener) =>
      listener(currentStatus)
  );
}

export function subscribeToNetworkStatus(
  listener: Listener
) {

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export async function checkNetworkConnection(
  timeoutMs = 4500
) {

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      timeoutMs
    );

  try {

    const response =
      await fetch(
        'https://www.google.com/generate_204',
        {
          cache: 'no-store',
          signal: controller.signal,
        }
      );

    const isOnline =
      response.status === 204 ||
      response.ok;

    setNetworkStatus(
      isOnline
        ? 'online'
        : 'offline'
    );

    return isOnline;

  } catch {

    setNetworkStatus('offline');

    return false;

  } finally {

    clearTimeout(timeout);
  }
}
