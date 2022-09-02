import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.css'
import "../styles/App.css";
import Header from '../src/component/Header'
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  return (
    <>
    <ChakraProvider>
      <div class="wrapper">
        <Header />
          <div class="container">
            <nav class="left_menu">
              <ul className='depth_1'>
                <li>
                  <Link href="/insa" >insa</Link>
                </li>
                <li>
                  <Link href="/schedule" >schedule</Link>
                </li>
              </ul>
            </nav>
            <div className='content_box'>
              <Component {...pageProps} />
            </div>
          </div>
        <footer className="footer">footer</footer>
      </div>
    </ChakraProvider>
    </>
  )
}

export default MyApp
