import React from 'react';
import {useRouter} from 'next/router'
import styled from "styled-components";
import Link from "next/link";
import { userState } from "../../src/recoil/state"
import {useRecoilState } from 'recoil';
import { getAuth, signOut } from "firebase/auth";

const HeaderTop = styled.div`
  width: 100%;border-bottom: 1px solid #e8e8e8;font-size: 12px;
  padding:0 1rem;height:60px;
  display:flex;justify-content:space-between;
  .menu{
    display:flex;align-items:center;height: 100%;
  }
  li{margin-right:15px}
  .right{
    display:flex;align-items:center;height: 100%;
  }
`;

function Header() {
  const auth = getAuth();
  const router = useRouter(); 
  const [userAuth, setUserAuth] = useRecoilState(userState);
  console.log(userAuth)
  
  const onLogout = () => {
    signOut(auth)
    .then((res) => {
      console.log(res)
      //setUserAuth({})  
      console.log("logged out");
      console.log(userAuth)
    })
    .then(res=>router.push('/login'))
    .catch((error) => {
      console.log(error);
    });
  }
  return (
    <>
    <HeaderTop>
      <ul className="menu">
        <li>
          <Link href="/insa">
            인사관리
          </Link>
        </li>
        <li>
          <Link href="/schedule">
            일정관리
          </Link>
        </li>
      </ul>
      <ul className='right'>
        {Object.keys(userAuth).length > 0 ? (
          <>
            <li>
              <Link href="/mypage">
                마이페이지
              </Link>
            </li>
            <li>
              <a href='#' onClick={onLogout}>
                로그아웃
              </a>
            </li>
          </>
        ):(
          <>
            <li>
              <Link href="/login">
                로그인
              </Link>
            </li>
            <li>
              <Link href="/join">
                회원가입
              </Link>
            </li>
          </>
        )}
      </ul>
    </HeaderTop>
    </>
  )
}

export default Header