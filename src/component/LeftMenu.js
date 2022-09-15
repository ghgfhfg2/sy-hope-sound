import { useEffect,useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setDayoffCount,updateDayoffCount } from "@redux/actions/counter_action";
import Link from 'next/link';
import { useRouter } from "next/router";
import styled from 'styled-components';
import { db } from "src/firebase";
import { ref, onValue, remove, get, off, update, query,orderByChild, equalTo } from "firebase/database";

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

function LeftMunu({userInfo}) {
  const router = useRouter().route;
  const dispatch = useDispatch()
  const dayoffCount = useSelector(state=>state.counter.dayoffCount)
  const dayoffCheck = useSelector(state=>state.counter.dayoffCheck)
  const [dayoffReady, setDayoffReady] = useState('결재대기')
  useEffect(() => {
    let countRef;
    countRef = query(ref(db,`dayoff/temp`),orderByChild("manager"),equalTo(userInfo ? userInfo.uid : ''))
    if(router.includes('/schedule')){
      onValue(countRef,data=>{
        let count = 0;
        for(const key in data.val()){
          count++;
        }
        dispatch(setDayoffCount(count))
        dispatch(updateDayoffCount(false))
      })
    }
    return () => {
      off(countRef)
    }
  }, [userInfo,dayoffCheck,router])

  useEffect(() => {
    setDayoffReady(`결재요청(${dayoffCount})`)
  }, [dayoffCount])
  
    
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
                <Link href="/schedule/sign_ready">
                  {dayoffReady}                
                </Link>
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