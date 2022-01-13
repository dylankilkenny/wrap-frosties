import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { DAppProvider, Config } from '@usedapp/core';
import { ToastContainer } from 'react-toastify';

let alcRpc = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '';

const config: Config = {
  readOnlyChainId: 1,
  readOnlyUrls: {
    1: alcRpc,
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
      <ToastContainer position="bottom-left" autoClose={5000} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </DAppProvider>
  );
}

export default MyApp;
