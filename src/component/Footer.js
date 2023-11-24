import { Flex, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
const FooterBox = styled.div`
  border-top: 1px solid #ddd;
  .content_box {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }
  .logo {
    width: 100px;
    margin-right: 80px;
    opacity: 0.5;
  }
  .footer_con {
    color: #888;
  }
  @media screen and (max-width: 1024px) {
    .logo {
      margin-right: 2rem;
      width: 70px;
    }
  }
`;

export default function Footer() {
  return (
    <FooterBox>
      <div className="content_box">
        <Flex>
          <div className="footer_con">
            © Copyright 2023 All rights reserved by sy_dev
          </div>
        </Flex>
      </div>
    </FooterBox>
  );
}
