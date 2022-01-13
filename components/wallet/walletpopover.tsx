import makeBlockie from 'ethereum-blockies-base64';
import { FaAngleLeft } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { IconContext } from 'react-icons';
import getErrorMessage from './errors';
import { getExplorerAddressLink, shortenAddress, getChainName, useEthers } from '@usedapp/core';
import Image from 'next/image';
import { ReactNode, useState } from 'react';

import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { InjectedConnector } from '@web3-react/injected-connector';

type IConnector = InjectedConnector | WalletConnectConnector;

interface Wallet {
  name: string;
  connector: IConnector;
  image: { w: number; h: number; src: string };
}

interface WalletPopoverProps {
  wallets: Wallet[];
  error: Error | undefined;
  connectedWallet: Wallet | undefined;
  connect: (c: IConnector) => void;
}

interface LinkProps {
  href: string | undefined;
  children: ReactNode;
}

function ExternalLink({ href, children }: LinkProps): JSX.Element {
  return (
    <a href={href} target="_blank" className="text-blue-500 hover:text-blue-400 w-full" rel="noreferrer">
      {children}
    </a>
  );
}

export default function WalletPopover({ wallets, connect, error, connectedWallet }: WalletPopoverProps): JSX.Element {
  const { deactivate, account, chainId } = useEthers();
  const [viewTxs, setViewTxs] = useState<boolean>();

  if (error) {
    return <div className="w-full text-center">{getErrorMessage(error)}</div>;
  }
  if (account && chainId && connectedWallet) {
    return (
      <div className="w-full">
        <div className="w-full p-2 mb-2">
          <div className="flex w-30 float-left pr-14">
            <div className="float-right w-8 h-8 align-middle">
              <Image
                src={connectedWallet.image.src}
                alt={connectedWallet.name}
                width={connectedWallet.image.w}
                height={connectedWallet.image.h}
                layout="responsive"
              />
            </div>
            <div className="w-full text-center">{connectedWallet.name}</div>
          </div>
          <ExternalLink href={getExplorerAddressLink(account, chainId)}>
            <div className="flex w-auto text-sm">
              <img className="h-6 w-6" src={makeBlockie(account)} />
              <div className="float-left ml-2 text-lg">{shortenAddress(account)}</div>
              <IconContext.Provider value={{ className: 'text-xl ml-2 text-gray-800 cursor-pointer' }}>
                <HiOutlineExternalLink />
              </IconContext.Provider>
            </div>
          </ExternalLink>
        </div>
        <div className="w-full text-center pb-4 text-green-700">
          Connected to Ethereum {getChainName(chainId)} Network
        </div>
        <div className="border-t pt-3">
          <div
            onClick={deactivate}
            className=" py-2 px-4 border border-gray-300 rounded-md cursor-pointer text-center hover:bg-gray-200"
          >
            Disconnect
          </div>
        </div>
      </div>
    );
  }
  return <WalletList connect={connect} wallets={wallets} />;
}

interface WalletListProps {
  wallets: Wallet[];
  connect: (c: IConnector) => void;
}

function WalletList({ wallets, connect }: WalletListProps) {
  return (
    <div className="w-full">
      {wallets.map((w) => (
        <div
          key={w.name}
          onClick={() => connect(w.connector)}
          className="flex rounded-md m-3 shadow-sm hover:bg-gray-100 border border-gray-200 cursor-pointer"
        >
          <div className="w-full p-4">{w.name}</div>
          <div className="float-right w-10 h-10 py-3 mr-4 align-middle">
            <Image src={w.image.src} alt={w.name} width={w.image.w} height={w.image.h} layout="responsive" />
          </div>
        </div>
      ))}
    </div>
  );
}
