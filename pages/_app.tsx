import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { DAppProvider, Config } from '@usedapp/core';
import { ToastContainer } from 'react-toastify';

const config: Config = {};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
      <ToastContainer position="bottom-left" autoClose={5000} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </DAppProvider>
  );
}

export default MyApp;
