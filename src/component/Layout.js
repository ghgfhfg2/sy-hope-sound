import React from 'react'
import Header from './Header'
import LeftMenu from './LeftMenu'
import { userState } from "../../src/recoil/state"
import {useRecoilValue } from 'recoil';

function Layout({children}) {
  const user = useRecoilValue(userState)
  console.log(user)
  return (
    <>
      <div className="wrapper">
        <Header />
          <div className="container">
            <LeftMenu />
            <div className='content_box'>
              <main>
                {children}
              </main>
            </div>
          </div>
        <footer className="footer">footer</footer>
      </div>
    </>
  )
}

export default Layout