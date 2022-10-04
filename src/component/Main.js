import { Button, Image } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdImageSearch } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { db } from "src/firebase";
import {
  ref,
  set,
  onValue,
  off,
  query,
  update,
  orderByChild,
  equalTo,
  orderByValue,
  startAt,
  orderByKey,
  endAt,
} from "firebase/database";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import styled from 'styled-components'
const MainWrapper = styled.div`
  display:flex;align-items:center;
  flex-direction:column;
  header{
    width:100%;
    height:250px;
    background:#ddd;
    position:relative;
    .bg_balck{
      width:100%;height:100%;background:rgba(0,0,0,0.3);
      position:absolute;left:0;top:0;z-index:1;
      transition:all 0.2s;
    }
    .bg_img{
      position:absolute;left:0;top:0;
    }
    .btn_bg_modify{
      padding:0 12px;
      opacity:0;
      z-index:-1;
      position:absolute;right:0;bottom:20px;
    }
    .content_box{
      position:relative;
      height:100%;
    }
    &:hover .btn_bg_modify{
      opacity:1;z-index:10;
    }
  }
  .content_box{
    position:relative;
    margin:0 auto;
    width:100%;
    max-width:1400px;
    &.con{min-height:300px;
      padding-top:0;
      padding-left:230px;
    }
  }
  .profile_box{
    position:absolute;
    width:180px;
    left:1rem;top:-30px;
    z-index:10;
    text-align:center;
    h3{font-size:20px;margin-top:10px;}
    .btn_modify{padding:0;
      margin-top:10px;
      a{height:100%;
        display:flex;align-items:center;
        padding:0 1rem;
      }
    }
  }
  .profile_img{
    width:180px;height:180px;
    border-radius:50%;overflow:hidden;
    background:#ddd;
    z-index:10;
    box-shadow: 0 0 8px rgb(0 0 0 / 60%);
  }

  .hitmap_box{
    margin-top:2rem;
    position:relative;
    .react-calendar-heatmap text{font-size:0.5rem;}
  }
  .type_info {
    display: flex;
    justify-content:flex-end;
    position:absolute;right:0;bottom:0;
    li {
      margin-right: 4px;
      width: 70px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      padding: 5px;
      border-radius: 4px;
    }
  }
  .all_off {
    background: #319795;
  }
  .am_off {
    background: #3182ce;
  }
  .pm_off {
    background: #dd6b20;
  }
  .react-calendar-heatmap .color-github-1{
    fill:#3182ce;
  }
  .react-calendar-heatmap .color-github-2{
    fill:#dd6b20;
  }
  .react-calendar-heatmap .color-github-3{
    fill:#319795;
  }
`

export default function Main() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const [headerImg, setHeaderImg] = useState('https://source.unsplash.com/1920x250/?colorfull,sky,nature,space');

  
  const [curDate, setCurDate] = useState(new Date())
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  useEffect(() => {
    setStartDate(format(subMonths(curDate, 11), "yyyy-MM-dd"))
    setEndDate(format(addMonths(curDate, 1), "yyyy-MM-dd"))
    return () => {
      
    }
  }, [curDate])


  const [dayOffList, setDayOffList] = useState([])
  useEffect(() => {
    const dayoffRef = query(ref(db,`dayoff/list`),orderByKey(),startAt(format(subMonths(curDate, 11), "yyyyMMdd")),endAt(format(addMonths(curDate, 1), "yyyyMMdd")))
    onValue(dayoffRef,data=>{
      let arr = []
      for(const mon in data.val()){
        const month = data.val()[mon];
        for(const key in month){
          if(userInfo?.uid === month[key].userUid){
            arr.push(month[key])
          }
        }
      }
      arr = arr.map(el=>{
        let typeVal;
        if(el.offType === '오전반차'){
          typeVal = 1;
        }
        if(el.offType === '오후반차'){
          typeVal = 2;
        }
        if(el.offType === '연차'){
          typeVal = 3;
        }
        let obj = {
          date:el.date,
          type:typeVal
        }
        return obj
      })
      setDayOffList(arr)
    })
    
    return () => {
      off(dayoffRef)
    }
  }, [userInfo])


  return (
    <MainWrapper>
      <header style={{background:`url(${headerImg}) no-repeat center center/cover`}}>
        <div className='bg_balck'></div>
        <div className='content_box'>
          <Button className="btn_bg_modify"><MdImageSearch style={{fontSize:"20px"}} /></Button>
        </div>
      </header>
      <div className='content_box con'>
        <div className='profile_box'>
          <div className='profile_img'>
            {userInfo && userInfo.profile &&
              <div style={{background:`url(${userInfo.profile}) no-repeat center center/cover`,height:"100%"}} />
            }
          </div>
          <h3>{userInfo && userInfo.name}</h3>
          <Button variant='outline' className='btn_modify' size="sm">
            <Link href="/mypage">정보 수정하기</Link>
          </Button>
        </div>
        <div className='hitmap_box'>          
          <CalendarHeatmap
            startDate={format(subMonths(curDate, 11), "yyyy-MM-dd")}
            endDate={format(addMonths(curDate, 1), "yyyy-MM-dd")}
            values={dayOffList}
            classForValue={value => {
              if (!value) {
                return 'color-empty';
              }
              return `color-github-${value.type}`;
            }}
            onClick={value => value && alert(`Clicked on value with count: ${value.type}`)}
            showWeekdayLabels={true}
          />
          <ul className="type_info">
            <li className="am_off">오전반차</li>
            <li className="pm_off">오후반차</li>
            <li className="all_off">연차</li>
          </ul>
        </div>

      </div>
    </MainWrapper>
  )
}
