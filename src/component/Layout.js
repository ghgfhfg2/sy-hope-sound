
import { Flex } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import LeftMenu from "./LeftMenu";
import Loading from "./Loading";

function Layout({ children }) {
  const userInfo = useSelector(state=>state.user.currentUser);
  return (
    <>
      <div className="wrapper">
        <Header />
        <div className="container">
          <LeftMenu userInfo={userInfo} />
          <div className="content_box">
            {children ? 
            <main>{children}</main> : 
            <Flex justifyContent="center" alignItems="center">
              <Loading />
            </Flex>
            }
          </div>
        </div>
        <footer className="footer">footer</footer>
      </div>
    </>
  );
}

export default Layout;
