import {
  isNetworkOffline,
  setNetworkStatus,
} from '../services/network';

type RequestOptions<T> = RequestInit & {
  fallback: T;
  label?: string;
  parse?: (data: any) => T;
};

function logRequestError(
  label: string | undefined,
  error: unknown
) {

  const prefix =
    label
      ? `[CineBluish API] ${label}`
      : '[CineBluish API] Request failed';

  console.log(prefix, error);
}

export function safeArray<T>(
  value: unknown
): T[] {

  return Array.isArray(value)
    ? value
    : [];
}

export async function safeRequest<T>(
  url: string,
  {
    fallback,
    label,
    parse,
    ...init
  }: RequestOptions<T>
): Promise<T> {

  if (isNetworkOffline()) {
    return fallback;
  }

  try {

    const response =
      await fetch(
        url,
        init
      );

    if (!response.ok) {
      setNetworkStatus('online');

      logRequestError(
        label,
        `HTTP ${response.status}`
      );

      return fallback;
    }

    setNetworkStatus('online');

    const data =
      await response.json();

    return parse
      ? parse(data)
      : data;

  } catch (error) {

    if ((error as any)?.name !==
      'AbortError') {
      setNetworkStatus('offline');

      logRequestError(
        label,
        error
      );
    }

    return fallback;
  }
}

export function resultsFromResponse<T>(
  data: any
): T[] {

  return safeArray<T>(
    data?.results
  );
}
