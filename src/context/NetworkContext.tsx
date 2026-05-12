import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AppState,
} from 'react-native';

import {
  checkNetworkConnection,
  getNetworkStatus,
  subscribeToNetworkStatus,
  type NetworkStatus,
} from '../services/network';

type NetworkContextValue = {
  isOffline: boolean;
  status: NetworkStatus;
  refreshNetworkStatus: () => Promise<boolean>;
};

const NetworkContext =
  createContext<NetworkContextValue | null>(
    null
  );

export function NetworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [status, setStatus] =
    useState<NetworkStatus>(
      getNetworkStatus()
    );

  useEffect(() => {

    const unsubscribe =
      subscribeToNetworkStatus(
        setStatus
      );

    checkNetworkConnection();

    return unsubscribe;

  }, []);

  useEffect(() => {

    const intervalMs =
      status === 'offline'
        ? 8000
        : 30000;

    const interval =
      setInterval(
        () => {
          checkNetworkConnection();
        },
        intervalMs
      );

    return () =>
      clearInterval(interval);

  }, [status]);

  useEffect(() => {

    const subscription =
      AppState.addEventListener(
        'change',
        (nextState) => {

          if (nextState === 'active') {
            checkNetworkConnection();
          }
        }
      );

    return () =>
      subscription.remove();

  }, []);

  const value =
    useMemo<NetworkContextValue>(
      () => ({
        isOffline:
          status === 'offline',
        refreshNetworkStatus:
          checkNetworkConnection,
        status,
      }),
      [status]
    );

  return (
    <NetworkContext.Provider
      value={value}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {

  const ctx =
    useContext(NetworkContext);

  if (!ctx) {
    throw new Error(
      'useNetwork must be used within NetworkProvider'
    );
  }

  return ctx;
}
