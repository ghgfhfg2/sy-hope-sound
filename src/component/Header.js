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
  border-bottom: 1px solid #e8e8e8;
  font-size: 12px;
  padding: 0 1rem;
  height: 60px;
  display: flex;
  justify-content: space-between;
  .menu {
    display: flex;
    align-items: center;
    height: 100%;
  }
  li {
    margin-right: 15px;
  }
  .right {
    display: flex;
    align-items: center;
    height: 100%;
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
      .then((res) => router.push("/login"))
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <HeaderTop>
        <ul className="menu">
          <li>
            <Link href="/insa">인사관리</Link>
          </li>
          <li>
            <Link href="/schedule">일정관리</Link>
          </li>
        </ul>
        <ul className="right">
          {userInfo ? (
            <>
              <li>
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
