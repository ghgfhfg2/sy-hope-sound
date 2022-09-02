import React from 'react'
import Header from './Header'

function Layout({Children}) {
  return (
    <>
      <Header />
      {Children}
      <div>footer</div>
    </>
  )
}

export default Layout