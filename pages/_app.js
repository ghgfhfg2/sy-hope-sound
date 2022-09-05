import { ChakraProvider } from '@chakra-ui/react';
import {useRouter} from 'next/router'
import '../styles/globals.css';
import "../styles/App.css";
import Layout from '../src/component/Layout';
import { RecoilRoot } from 'recoil';
import { app } from "../firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth";

function MyApp({ Component, pageProps }) {
  const router = useRouter(); 
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/')
    } 
  });
  const getLayout = Component.getLayout || ((page)=>{
  return(
        <Layout>
          {page}
        </Layout>
    )
  })

  return (
    <ChakraProvider>
      <RecoilRoot>
        {getLayout(<Component {...pageProps} />)}
      </RecoilRoot>
    </ChakraProvider>
  )
}

export default MyApp
