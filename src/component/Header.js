import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@redux/actions/user_action";
import { useRouter } from "next/router";
import styled from "styled-components";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";

const HeaderTop = styled.div`
  width: 100%;
  background: var(--m-color);
  color: #fff;
  font-size: 12px;
  padding: 0 1rem;
  height: 60px;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
  }
  .logo {
    cursor: pointer;
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    background: #fff;
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
    padding: 0 1rem;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    &.on {
      background: #fff;
      color: var(--m-color);
      a {
        font-weight: 600;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    height: 100%;
  }
`;

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
  return (
    <>
      <HeaderTop>
        <div className="left">
          <h1 className="logo">
            <Link href="/">
              <img src={logoImg} />
            </Link>
          </h1>
          <ul className="menu">
            <li className={router.route.indexOf("/insa") > -1 && "on"}>
              <Link href="/insa">인사관리</Link>
            </li>
            <li className={router.route.indexOf("/schedule") > -1 && "on"}>
              <Link href="/schedule">일정관리</Link>
            </li>
          </ul>
        </div>
        <ul className="right">
          {userInfo ? (
            <>
              <li className={router.route.indexOf("/mypage") > -1 && "on"}>
                <Link href="/mypage">마이페이지</Link>
              </li>
              <li>
                <a href="#" onClick={onLogout}>
                  로그아웃
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">로그인</Link>
              </li>
              <li>
                <Link href="/join">회원가입</Link>
              </li>
            </>
          )}
        </ul>
      </HeaderTop>
    </>
  );
}

export default Header;
