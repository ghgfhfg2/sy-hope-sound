import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@redux/actions/user_action";
import { useRouter } from "next/router";
import styled from "styled-components";
import Link from "next/link";

const HeaderTop = styled.div`
  background: #fff;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  font-size: 20px;
  font-family: "TAEBAEKmilkyway";
  font-weight: bold;
`;

function Header() {
  const router = useRouter();

  return (
    <>
      <HeaderTop>자존감을 올려주는 말 한마디</HeaderTop>
    </>
  );
}

export default Header;
