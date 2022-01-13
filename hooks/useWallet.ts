import { useEthers } from '@usedapp/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useEffect, useState } from 'react';

type IConnector = InjectedConnector | WalletConnectConnector;

interface Wallet {
  name: string;
  connector: IConnector;
  image: { w: number; h: number; src: string };
}

let alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '';

const walletconnect = new WalletConnectConnector({
  rpc: { 1: alchemyKey, 4: alchemyKey },
});
const injected = new InjectedConnector({ supportedChainIds: [1, 4] });

const wallets: Wallet[] = [
  {
    name: 'Metamask',
    connector: injected,
    image: {
      w: 377,
      h: 345,
      src: '/logos/metamask.png',
    },
  },
  {
    name: 'WalletConnect',
    connector: walletconnect,
    image: {
      w: 300,
      h: 300,
      src: '/logos/walletconnect.svg',
    },
  },
];

export function useWallet(): {
  wallets: Wallet[];
  connectedWallet: Wallet | undefined;
  connect: (wallet: IConnector) => void;
  error: Error | undefined;
} {
  const { activate, chainId } = useEthers();
  const [error, setError] = useState<Error>();
  const [connectedWallet, setConnectedWallet] = useState<Wallet>();

  useEffect(() => {
    setError(undefined);
  }, [chainId]);

  function onError(e: Error) {
    setError(e);
  }

  useEffect(() => {
    void injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        connect(injected);
      }
    });
  }, []);

  function connect(wallet: IConnector) {
    void activate(wallet, onError);
    const w = wallets.find((w) => w.connector === wallet);
    setConnectedWallet(w);
  }

  return { wallets, connectedWallet, connect, error };
}
