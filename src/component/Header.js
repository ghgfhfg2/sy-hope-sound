import React from 'react';
import styled from "styled-components";
import Link from "next/link";

const HeaderTop = styled.div`
  width: 100%;border-bottom: 1px solid #e8e8e8;height: 35px;line-height: 35px;font-size: 12px;

`;

function Header() {
  return (
    <>
    <HeaderTop>
      <ul className="menu">
        <li>
          <Link href="/insa">
            인사관리
          </Link>
          <Link href="/schedule">
            일정관리
          </Link>
        </li>
      </ul>
    </HeaderTop>
    </>
  )
}

export default Header