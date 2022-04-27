import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from 'next-auth/react';
import { ChartProvider } from '../context/ChatContext';
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <CSSReset />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <SessionProvider>
        <ChartProvider session={pageProps.session}>
          <Component {...pageProps} />
        </ChartProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
