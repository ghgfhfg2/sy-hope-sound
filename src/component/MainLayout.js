import { Flex } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Loading from "./Loading";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <div className="wrapper">
        <Header />
        {children ? (
          <main>{children}</main>
        ) : (
          <Flex justifyContent="center" alignItems="center">
            <Loading />
          </Flex>
        )}
        <Footer />
      </div>
    </>
  );
}
