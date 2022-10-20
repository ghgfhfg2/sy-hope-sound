import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@redux/actions/user_action";
import { useRouter } from "next/router";
import styled from "styled-components";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import { Button, Image,Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure, } from "@chakra-ui/react";
import { BiUser } from "react-icons/bi";
import { TbLogout } from "react-icons/tb";
import { AiOutlineMenu } from "react-icons/ai";
import MobileMenu from "@component/MobileMenu"

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
      padding: 0.5rem 1rem;
      font-size: 14px;
      color: var(--m-color);
    }
    &.on {
      color: var(--m-color);
      a {
        font-weight: 600;
        border-radius: 6px;
        background: var(--m-color);
        color: #fff;
      }
    }
  }
  .right {
    display: flex;
    margin-right: 1rem;
    align-items: center;
    height: 100%;
    li a {
      padding: 0.5rem;
    }
  }
  .btn_menu{display:none}
  @media screen and (max-width: 1024px) {
    padding-right:0;
    .left{margin-left:1rem}
    .logo_box{width:auto;
      position:absolute;left:50%;top:50%;
      transform:translate(-50%,-50%);
    }
    .menu {
      display: none;
    }
    .right{display:none}
    .btn_menu{display:block;
      border:0;background:none;
    }

  }

`;

const LeftMenuBox = styled.div`
  @media screen and (max-width: 1024px) {
    padding: 0 1rem;
    .right{
      padding: 15px 0;
      display:flex;
      li{
        display:flex;margin-right:20px;
      }
    }
    .left_menu{display:flex}

  }
`

function Header({ logoImg }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.currentUser);
  const auth = getAuth();
  const router = useRouter();
  const onLogout = () => {
    signOut(auth)
      .then((res) => {
        dispatch(clearUser());
      })
      .then((res) => router.push("/login"))
      .catch((error) => {
        console.log(error);
      });
  };

  const UserMenu = () => {
    return(
      <ul className="right">
        <li className={router.route.indexOf("/mypage") > -1 && "on"}>
          <span style={{marginRight:"10px"}}>{userInfo.name} 님 환영합니다.</span>
          <Link href="/mypage">
            <a>
              <BiUser style={{ fontSize: "1.2rem" }} />
            </a>
          </Link>
        </li>
        <li>
          <a href="#" onClick={onLogout}>
            <TbLogout style={{ fontSize: "1.2rem" }} />
          </a>
        </li>
      </ul>
    )
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  useEffect(() => {
    onClose()
  }, [router])

  return (
    <>      
      <HeaderTop>
        <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody px={0}>
              <LeftMenuBox>
                {userInfo && (
                  <UserMenu />
                )}
              </LeftMenuBox>
              <MobileMenu router={router.route} userInfo={userInfo} onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        
        <div className="left">
          <Button ref={btnRef} onClick={onOpen} className="btn_menu">
            <AiOutlineMenu />
          </Button>
          <div className="logo_box">
            <h1 className="logo">
              <Link href="/">
                <Image alt="" src={logoImg} />
              </Link>
            </h1>
          </div>
          <ul className="menu">
            {userInfo && userInfo.authority?.includes("admin") && (
              <li className={router.route.indexOf("/setting") > -1 && "on"}>
                <Link href="/setting">설정</Link>
              </li>
            )}
            <li className={router.route.indexOf("/insa") > -1 && "on"}>
              <Link href="/insa">인사관리</Link>
            </li>
            <li className={router.route.indexOf("/schedule") > -1 && "on"}>
              <Link href="/schedule">일정관리</Link>
            </li>
            <li className={router.route.includes("/board/") && "on"}>
              <Link href="/board/wait">지출결의서</Link>
            </li>
            <li className={router.route.includes("/ragular") && "on"}>
              <Link href="/ragular">정기결제</Link>
            </li>
            {userInfo && userInfo.authority?.includes("admin") && (
              <li className={router.route.includes("/stats") && "on"}>
                <Link href="/stats/price">통계</Link>
              </li>
            )}            
            <li className={router.route.includes("/partners") && "on"}>
              <Link href="/partners">협력사</Link>
            </li>
          </ul>
        </div>
        {userInfo && (
          <UserMenu />
        )}
      </HeaderTop>
    </>
  );
}

export default Header;
