import { Flex } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Loading from "./Loading";

export default function MainLayout({ children, logoImg }) {
  const logoUrl = useSelector((state) => state.logo.url);
  return (
    <>
      <div className="wrapper">
        <Header logoImg={logoUrl} />
            {children ? (
              <main>{children}</main>
            ) : (
              <Flex justifyContent="center" alignItems="center">
                <Loading />
              </Flex>
            )}
        <footer className="footer">footer</footer>
      </div>
    </>
  );
}

