import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@redux/actions/user_action";
import "../styles/globals.css";
import "../styles/App.css";
import "../styles/scss-common.css";
import wrapper from "@redux/store/configureStore";
import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { app, auth } from "src/firebase";
import Layout from "@component/Layout";
import Login from "@component/Login";

function App({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const path = router.pathname;
  const [authCheck, setAuthCheck] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  const publicPath = ["/login", "/join"];
  const isPublicPath = publicPath.includes(path);

  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch(setUser(user));
      setAuthCheck(true);
    } else {
      dispatch(clearUser());
      setAuthCheck(false);
    }
    setisLoading(false);
  });
  console.log(Component);
  const getLayout =
    Component.getLayout ||
    ((page) => {
      return <Layout>{page}</Layout>;
    });

  return (
    <>
      <ChakraProvider>
        {authCheck ? (
          <>{getLayout(<Component {...pageProps} />)}</>
        ) : (
          <>
            {isPublicPath ? getLayout(<Component {...pageProps} />) : <Login />}
          </>
        )}
      </ChakraProvider>
    </>
  );
}

export default wrapper.withRedux(App);
