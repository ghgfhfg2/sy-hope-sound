import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@redux/actions/user_action";
import { useRouter } from "next/router";
import styled from "styled-components";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import {
  Button,
  Image,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { BiUser } from "react-icons/bi";
import { TbLogout } from "react-icons/tb";
import { AiOutlineMenu } from "react-icons/ai";
import { BsEnvelope } from "react-icons/bs";

const HeaderTop = styled.div`
  width: 100%;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 0 0 / 15%);
  font-size: 12px;
  padding-right: 1rem;
  height: 60px;
  display: flex;
  position: sticky;
  top: 0;
  z-index: 100;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
  }
  .logo_box {
    width: 200px;
  }
  .logo {
    cursor: pointer;
    display: flex;
    height: 40px;
    width: auto;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    img {
      max-height: 30px;
    }
  }
  .menu {
    display: flex;
    align-items: center;
    height: 100%;
  }
  li {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 0.5rem;
    a {
      transition: all 0.2s;
      padding: 0.5rem 1rem;
      font-size: 14px;
      color: var(--m-color);
      border-radius: 0;
      &:hover {
        font-weight: 600;
        border-radius: 6px;
        background: var(--m-color);
        color: #fff;
      }
    }
    &.on {
      color: var(--m-color);
      a {
        font-weight: 600;
        border-radius: 6px;
        background: var(--m-color);
        color: #fff;
        &.non {
          color: var(--m-color);
          background: none;
        }
      }
    }
  }
  .right {
    display: flex;
    margin-right: 1rem;
    align-items: center;
    height: 100%;
    li a {
      position: relative;
      padding: 0.5rem;
      .non_read {
        position: absolute;
        right: -3px;
        top: -2px;
        border-radius: 50%;
        width: 17px;
        height: 17px;
        color: #fff;
        display: flex;
        font-size: 11px;
        align-items: center;
        justify-content: center;
        background: red;
      }
    }
  }
  .btn_menu {
    display: none;
  }
  @media screen and (max-width: 1024px) {
    padding-right: 0;
    .left {
      margin-left: 1rem;
    }
    .logo_box {
      width: auto;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .menu {
      display: none;
    }
    .right {
      display: none;
    }
    .btn_menu {
      display: block;
      border: 0;
      background: none;
    }
  }
`;

const LeftMenuBox = styled.div`
  @media screen and (max-width: 1024px) {
    padding: 0 1rem;
    .right {
      padding: 15px 0;
      display: flex;
      li {
        display: flex;
        margin-right: 20px;
      }
    }
    .left_menu {
      display: flex;
    }
  }
`;

function Header() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.currentUser);
  const auth = getAuth();
  const router = useRouter();
  const onLogout = () => {
    signOut(auth)
      .then((res) => {
        dispatch(clearUser());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onMainRefresh = () => {
    if (router.route == "/") {
      router.reload();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <HeaderTop></HeaderTop>
    </>
  );
}

export default Header;
