import { useState } from 'react';
import Popover from 'react-popover';
import WalletButton from './walletbutton';
import { useWallet, useNotificationToast } from '../../hooks';
import WalletPopover from './walletpopover';
import { ToastContainer, toast } from 'react-toastify';

export default function Wallet(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const { wallets, connectedWallet, connect, error } = useWallet();
  useNotificationToast((msg: string) => {
    toast(msg);
  });
  return (
    <>
      <Popover
        className="wallet mt-5 shadow-sm border border-gray-200 rounded-md"
        isOpen={open}
        body={<WalletPopover wallets={wallets} connect={connect} error={error} connectedWallet={connectedWallet} />}
        onOuterAction={() => setOpen(false)}
        preferPlace="below"
      >
        <WalletButton togglePopover={() => setOpen(!open)} />
      </Popover>
      <ToastContainer position="bottom-left" autoClose={5000} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}
