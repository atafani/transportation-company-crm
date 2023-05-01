import "../../styles/globals.css";
import type {AppProps} from "next/app";
import {ToastContainer} from "react-toastify";
import {Provider} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {store} from "main/store";
import {ChakraProvider, theme} from "@chakra-ui/react";
import {AuthGuard, Layout} from "main/components";
import Head from "next/head";
import {NextPageWithLayout} from "main/configs/page.config";
import {defaultACLObj} from "main/configs/acl.config";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";

type ExtendedAppProps = AppProps & {
  Component: NextPageWithLayout;
};
const App = (props: ExtendedAppProps) => {
  const {Component, pageProps} = props;

  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  const authGuard = Component.authGuard ?? true;

  const aclAbilities = Component.acl ?? defaultACLObj;

  return (
    <Provider store={store}>
      <Head>
        <title>{`Transport Booking Manager`}</title>
      </Head>
      <ChakraProvider theme={theme}>
        <AuthGuard authGuard={authGuard} aclAbilities={aclAbilities}>
          {getLayout(<Component {...pageProps} />)}
        </AuthGuard>
        <ToastContainer />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
