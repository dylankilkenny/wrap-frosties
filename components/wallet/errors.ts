import { UserRejectedRequestError as UserRejectedRequestErrorWC } from '@web3-react/walletconnect-connector';
import { NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector';
import { UnsupportedChainIdError } from '@web3-react/core';

export default function getErrorMessage(error: Error): string {
  console.log('Connection Error:', error);
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestError || error instanceof UserRejectedRequestErrorWC) {
    return 'Please authorize this website to access your Ethereum account.';
  }
  return '';
}
