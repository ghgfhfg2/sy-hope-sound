import { Box, Button, Flex, Image, useToast } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { MdImageSearch } from "react-icons/md";
import { useSelector } from "react-redux";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { db } from "src/firebase";
import {
  ref,
  set,
  get,
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
import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styled from "styled-components";
import { HiExternalLink } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { imageResize, dataURLtoFile } from "@component/hooks/useImgResize";
const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  header {
    width: 100%;
    height: 250px;
    background: #ddd;
    position: relative;
    .bg_balck {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      transition: all 0.2s;
    }
    .bg_img {
      position: absolute;
      left: 0;
      top: 0;
    }
    .btn_bg_modify {
      padding:0;
      opacity: 0;
      z-index: -1;
      position: absolute;
      right: 0;
      bottom: 20px;
      input{width:0;height:0;position:absolute;opacity:0;z-index:-1}
      label{
        display:flex;
        align-items:center;
        height:100%;
        padding: 0 12px;
      }
    }
    .content_box {
      position: relative;
      height: 100%;
    }
    &:hover .btn_bg_modify {
      opacity: 1;
      z-index: 10;
    }
  }
  .content_box {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 1400px;
    &.con {
      min-height: 300px;
      padding-left: 250px;
      padding-bottom: 100px;
    }
  }
  .profile_box {
    position: absolute;
    width: 180px;
    left: 1rem;
    top: -30px;
    z-index: 10;
    text-align: center;
    h3 {
      font-size: 20px;
      margin-top: 10px;
    }
    .btn_modify {
      padding: 0;
      margin-top: 10px;
      a {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 1rem;
      }
    }
  }
  .profile_img {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
    background: #eee;
    z-index: 10;
    display:flex;
    justify-content:center;
    align-items:center;
    box-shadow: 0 0 8px rgb(0 0 0 / 50%);
  }

  h2.title {
    font-size: 1rem;
    font-weight: 600;
  }

  .divide {
    width: 100%;
    height: 1px;
    margin: 2.5rem 0;
    background: #f1f1f1;
  }

  .hitmap_box {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 5px;
    margin-top: 1rem;
    position: relative;
    .react-calendar-heatmap text {
      font-size: 9px;
      fill: #555;
    }
  }
  .type_info {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 1rem;
    bottom: 1rem;
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

  .react-calendar-heatmap-week rect {
    rx: 2;
  }

  .board_type_0 {
    background: #319795;
  }
  .board_type_1 {
    background: #3182ce;
  }
  .board_type_2 {
    background: #718096;
  }
  .board_type_3 {
    background: #00b5d8;
  }
  .board_type_4 {
    background: #38a169;
  }
  .board_type_5 {
    background: #d69e2e;
  }
  .react-calendar-heatmap {
    .color-empty {
      fill: #f1f1f1;
    }
    .color-github-1 {
      fill: #3182ce;
    }
    .color-github-2 {
      fill: #dd6b20;
    }
    .color-github-3 {
      fill: #319795;
    }

    .board_type_0 {
      fill: #319795;
    }
    .board_type_1 {
      fill: #3182ce;
    }
    .board_type_2 {
      fill: #718096;
    }
    .board_type_3 {
      fill: #00b5d8;
    }
    .board_type_4 {
      fill: #38a169;
    }
    .board_type_5 {
      fill: #d69e2e;
    }
  }
`;


const HitmapOver = styled.div`
  position:absolute;
  left:${(props) => `${props.pos.x}px` || 0};
  top:${(props) => `${props.pos.y}px` || 0};
  transform:translate(-100%,-100%);
  border-radius:5px;
  background:rgba(0,0,0,0.7);
  color:#fff;
  padding:5px 1rem;
`

export default function Main() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const toast = useToast()
  const [headerImg, setHeaderImg] = useState("https://source.unsplash.com/1920x250/?colorfull,sky,nature,space");

  const [curDate, setCurDate] = useState(new Date());
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  useEffect(() => {
    setStartDate(format(subMonths(curDate, 11), "yyyy-MM-dd"));
    setEndDate(format(addMonths(curDate, 1), "yyyy-MM-dd"));
    return () => {};
  }, [curDate]);

  const [dayOffList, setDayOffList] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const [boardType, setBoardType] = useState([]);
  useEffect(() => {

    setHeaderImg(userInfo?.mainBgUrl)

    const dayoffRef = query(
      ref(db, `dayoff/list`),
      orderByKey(),
      startAt(format(subMonths(curDate, 11), "yyyyMMdd")),
      endAt(format(addMonths(curDate, 1), "yyyyMMdd"))
    );

    const boardTypeRef = query(ref(db, `board/type_list`));

    const getMyList = async () => {
      const getBoardType = await get(boardTypeRef).then((data) => {
        const type = data.val();
        let arr = [];
        let i = 0;
        for (const key in type) {
          let obj = {
            title: type[key].title,
            uid: type[key].uid,
            type: i,
          };
          i++;
          arr.push(obj);
        }
        return arr;
      });
      setBoardType(getBoardType);

      const getDayoff = await get(dayoffRef).then((data) => {
        let arr = [];
        for (const mon in data.val()) {
          const month = data.val()[mon];
          for (const key in month) {
            if (userInfo?.uid === month[key].userUid) {
              arr.push(month[key]);
            }
          }
        }
        arr = arr.map((el) => {
          let typeVal = 0;
          if (el.offType === "오전반차") {
            typeVal = 1;
          }
          if (el.offType === "오후반차") {
            typeVal = 2;
          }
          if (el.offType === "연차") {
            typeVal = 3;
          }
          let obj = {
            ...el,
            type: typeVal,
            offType:el.offType,
          };
          return obj;
        });
        return arr;
      });
      const boardRef = query(
        ref(db, `board/list`),
        orderByChild("dateMonth"),
        startAt(format(subMonths(curDate, 11), "yyyyMM")),
        endAt(format(addMonths(curDate, 1), "yyyyMM"))
      );
      const getBoardList = await get(boardRef).then((data) => {
        let arr = [];
        const list = data.val();
        for (const key in list) {
          list[key];
          if (list[key].writer_uid === userInfo?.uid) {
            let obj = {
              date: format(new Date(list[key].timestamp), "yyyy-MM-dd"),
              type: list[key].type,
              subject: list[key].subject,
            };
            arr.push(obj);
          }
        }
        arr = arr.map((el) => {
          getBoardType.forEach((type) => {
            if (el.type === type.uid) {
              el.type = type.type;
              el.typeName = type.title
            }
          });
          return el;
        });
        return arr;
      });
      setDayOffList(getDayoff);
      setBoardList(getBoardList);
    };
    getMyList();
  }, [userInfo]);

  const [currentDayoff, setCurrentDayoff] = useState();
  const [currentBoard, setCurrentBoard] = useState();
  const [tooltipPos, setTooltipPos] = useState();
  const onCurrentDayoff = async (e) => {
    setCurrentDayoff(e)
  }
  const onTooltip = (e,val,type) => {
    if(val){
      let pos = {
        x:e.target.getBoundingClientRect().x,
        y:window.pageYOffset + e.target.getBoundingClientRect().y
      }
      if(type === 'dayoff'){
        setCurrentDayoff(val)
      }
      if(type === 'board'){
        setCurrentBoard(val)
      }
      setTooltipPos(pos)
    }else{
      setCurrentDayoff('')
      setCurrentBoard('')
      setTooltipPos('')
    }
  }


  //백그라운드 설정
  const storage = getStorage();
  const onMainBg = async (e) => {
    const file = e.target.files[0];
    if(!file) return
    if(file.type !== "image/gif" &&
    file.type !== "image/png" &&
    file.type !== "image/jpeg"){
      toast({
        description: "지원하지않는 형식 입니다.",
        status: "error",
        duration: 1000,
        isClosable: false,
      });
      return
    }
    const resizeImg = await imageResize(file,2000).then(img=>{
      return img
    })
    const newFile = dataURLtoFile(resizeImg,file.name)
    const storageRef = sRef(
      storage,
      `user/background/maninBg`
    );
    const url = await uploadBytes(storageRef, newFile).then((snapshot) => {
      const downloadUrl = getDownloadURL(snapshot.ref);
      return downloadUrl;
    });
    update(ref(db,`user/${userInfo.uid}`),{
      mainBgUrl:url
    })
    .then(()=>{
      setHeaderImg(url)
    })
  }
  


  return (
    <MainWrapper>
      <header
        style={{
          background: `url(${headerImg}) no-repeat center center/cover`,
        }}
      >
        <div className="bg_balck"></div>
        <div className="content_box">
          <Button className="btn_bg_modify">
            <input type="file" id="bg_input" onInput={onMainBg} accept="image/*" />
            <label htmlFor="bg_input">
            <MdImageSearch style={{ fontSize: "20px" }} />
            </label>
          </Button>
        </div>
      </header>
      <div className="content_box con">
        <div className="profile_box">
          <div className="profile_img">
            {userInfo && userInfo.profile ? (
              <div
                style={{
                  background: `url(${userInfo.profile}) no-repeat center center/cover`,
                  height: "100%",
                }}
              />
            ) : (
              <FaUser style={{fontSize:"95px",color:"#bbb"}} />
            )
          }
          </div>
          <h3>{userInfo && userInfo.name}</h3>
          <Button variant="outline" className="btn_modify" size="sm">
            <Link href="/mypage">정보 수정하기</Link>
          </Button>
        </div>
        <Flex justifyContent="space-between" alignItems="center">
          <h2 className="title">연차내역</h2>
          <Link href="/board/schedule">
            <a className="link">
              <Flex alignItems="center">
                more
                <HiExternalLink
                  style={{ marginTop: "4px", marginLeft: "4px" }}
                />
              </Flex>
            </a>
          </Link>
        </Flex>
        <div className="hitmap_box">
          <CalendarHeatmap
            gutterSize={2}
            startDate={format(subMonths(curDate, 11), "yyyy-MM-dd")}
            endDate={format(addMonths(curDate, 1), "yyyy-MM-dd")}
            values={dayOffList}
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              return `color-github-${value.type}`;
            }}
            onMouseOver={(e,value)=>{
              onTooltip(e,value,'dayoff')
            }}
            
            showWeekdayLabels={true}
          />
          <ul className="type_info">
            <li className="am_off">오전반차</li>
            <li className="pm_off">오후반차</li>
            <li className="all_off">연차</li>
          </ul>          
        </div>
        <div className="divide"></div>
        <Flex justifyContent="space-between" alignItems="center">
          <h2 className="title">결재내역</h2>
          <Link href="/board/list">
            <a className="link">
              <Flex alignItems="center">
                more
                <HiExternalLink
                  style={{ marginTop: "4px", marginLeft: "4px" }}
                />
              </Flex>
            </a>
          </Link>
        </Flex>
        <div className="hitmap_box">
          <CalendarHeatmap
            gutterSize={2}
            startDate={format(subMonths(curDate, 11), "yyyy-MM-dd")}
            endDate={format(addMonths(curDate, 1), "yyyy-MM-dd")}
            values={boardList}
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              return `board_type_${value.type}`;
            }}
            onMouseOver={(e,value)=>{
              onTooltip(e,value,'board')
            }}
            showWeekdayLabels={true}
          />
          <ul className="type_info">
            {boardType &&
              boardType.map((el, idx) => (
                <>
                  <li key={idx} className={`board_type_${idx}`}>
                    {el.title}
                  </li>
                </>
              ))}
          </ul>
        </div>
      </div>
      {currentDayoff &&
        <HitmapOver pos={tooltipPos} data={currentDayoff}>
          <p>{currentDayoff.subject}</p>
          <p>{currentDayoff.date}</p>
          <p>{currentDayoff.offType}</p>
        </HitmapOver>
      }
      {currentBoard &&
        <HitmapOver pos={tooltipPos} data={currentBoard}>
          <p>{currentBoard.subject}</p>
          <p>{currentBoard.date}</p>
          <p>{currentBoard.typeName}</p>
        </HitmapOver>
      }
    </MainWrapper>
  );
}
