import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/globals.css";
import "../styles/App.css";
import "../styles/scss-common.css";
import "nprogress/nprogress.css";
import wrapper from "@redux/store/configureStore";
import { Button, ChakraProvider, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Layout from "@component/Layout";
import Loading from "@component/Loading";
import styled from "styled-components";

function App({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const userInfo = useSelector((state) => state.user.currentUser);

  const path = router.pathname;
  const [isLoading, setisLoading] = useState(true);

  const setVh = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  };

  useEffect(() => {
    const handleStart = (url) => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);
    setisLoading(false);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  useEffect(() => {
    window.addEventListener("resize", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, []);

  const getLayout =
    Component.getLayout ||
    ((page) => {
      return <Layout>{page}</Layout>;
    });

  return (
    <>
      <ChakraProvider>
        {isLoading ? (
          <>
            <Flex minHeight="100vh" justifyContent="center" alignItems="center">
              <Loading size={`xl`} />
            </Flex>
          </>
        ) : (
          <>{getLayout(<Component {...pageProps} />)}</>
        )}
      </ChakraProvider>
    </>
  );
}

export default wrapper.withRedux(App);
