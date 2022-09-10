import React, { useEffect, useState } from "react";

export default function useIsLogin() {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    setIsLogin(window.sessionStorage.getItem("isLogin"));
  }, []);

  return isLogin;
}
