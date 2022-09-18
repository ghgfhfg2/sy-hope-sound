import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@redux/actions/user_action";
import "../styles/globals.css";
import "../styles/App.css";
import "../styles/scss-common.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import wrapper from "@redux/store/configureStore";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { app, auth, db } from "src/firebase";
import { ref, onValue, off, get } from "firebase/database";
import { signOut } from "firebase/auth";
import Layout from "@component/Layout";
import Login from "@component/Login";
import Loading from "@component/Loading";

function App({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const path = router.pathname;
  const [authCheck, setAuthCheck] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  const publicPath = ["/login", "/join"];
  const isPublicPath = publicPath.includes(path);
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

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const isLogin = window.sessionStorage.getItem("isLogin");
        if (!isLogin) {
          signOut(auth)
            .then((res) => {
              dispatch(clearUser());
            })
            .then((res) => router.push("/login"))
            .catch((error) => {
              console.log(error);
            });
        }
        const userRef = ref(db, `user/${user.uid}`);
        onValue(userRef, (data) => {
          if (data.val()) {
            let userData = {
              ...user,
              ...data.val(),
            };
            dispatch(setUser(userData));
          }
        });
        setAuthCheck(true);
      } else {
        window.sessionStorage.setItem("isLogin", false);
        dispatch(clearUser());
        setAuthCheck(false);
        if (isPublicPath) {
          router.push("/login");
        }
      }
      setisLoading(false);
    });
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
          <>
            {authCheck ? (
              <>{getLayout(<Component {...pageProps} />)}</>
            ) : (
              <>
                {isPublicPath ? (
                  getLayout(<Component {...pageProps} />)
                ) : (
                  <Login />
                )}
              </>
            )}
          </>
        )}
      </ChakraProvider>
    </>
  );
}

export default wrapper.withRedux(App);
