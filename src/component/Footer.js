import { Image } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
const FooterBox = styled.div`
  border-top: 1px solid #ddd;
  .content_box {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    .logo {
      width: 100px;
    }
  }
`;

export default function Footer() {
  const logoUrl = useSelector((state) => state.logo.url);
  return (
    <FooterBox>
      <div className="content_box">
        <div className="logo">{logoUrl && <Image alt="" src={logoUrl} />}</div>
      </div>
    </FooterBox>
  );
}
