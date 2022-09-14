import Link from 'next/link';
import { useRouter } from "next/router";
import styled from 'styled-components';

const LeftMenu = styled.nav`
width: 200px;border-right: 1px solid #ddd;
flex-shrink:0;
.depth_1{
  display:flex;flex-direction:column;margin:10px 0;
  >li{display:flex;margin:5px 0;
    &.on{font-weight:bold}
  }
  >li>a{padding:0 15px;}
}  
`

function LeftMunu() {
  const router = useRouter().route;
  return (
    <>
      <LeftMenu>
        {router.includes('/schedule') && 
          <>
            <ul className='depth_1'>
              <li className={router === "/schedule/write" ? "on" : ""}>
                <Link href="/schedule/write">글작성</Link>
              </li>
              <li className={router === "/schedule/sign_ready" ? "on" : ""}>
                <Link href="/schedule/sign_ready">결재대기</Link>
              </li>
              <li className={router === "/schedule/finish" ? "on" : ""}>
                <Link href="/schedule/finish">결재완료</Link>
              </li>
            </ul>
          
          </>
        }
      </LeftMenu>
    </>
  )
}

export default LeftMunu