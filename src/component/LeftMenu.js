import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { db } from "src/firebase";
import {
  ref,
  onValue,
  remove,
  get,
  off,
  update,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

const LeftMenu = styled.nav`
  width: 200px;
  flex-shrink: 0;
  background: #234e52;
  .depth_1 {
    display: flex;
    flex-direction: column;
    > li {
      display: flex;
      padding: 1rem 0;
      position: relative;
      &.on {
        background: #1d4044;
        a {
          color: #fff;
          font-weight: 600;
        }
      }
    }
    > li > a {
      padding: 0 15px;
      display: block;
      width: 100%;
      font-size: 13px;
      color: #bcdde1;
      &:hover {
        color: #fff;
        cursor: pointer;
        font-weight: 600;
      }
    }
  }
`;

function LeftMunu({ userInfo }) {
  const router = useRouter().route;
  const dispatch = useDispatch();
  const [dayoffReady, setDayoffReady] = useState("결재대기");
  const [dayoffCountNum, setDayoffCountNum] = useState(0);
  useEffect(() => {
    let countRef;
    countRef = query(ref(db, `dayoff/temp`));
    if (router.includes("/schedule")) {
      onValue(countRef, (data) => {
        let count = 0;
        for (const key in data.val()) {
          if (
            data.val()[key].nextManager.id === userInfo.uid ||
            data.val()[key].userUid === userInfo.uid
          ) {
            count++;
          }
        }
        setDayoffCountNum(count);
      });
    }
    return () => {
      off(countRef);
    };
  }, [userInfo, router]);

  const [boardWait, setBoardWait] = useState(0);
  const [waitCount, setWaitCount] = useState("결재대기");
  const [reCount, setReCount] = useState(false);
  useEffect(() => {
    const listRef = query(
      ref(db, `board/list`),
      orderByChild("state"),
      equalTo("ing")
    );
    onValue(listRef, (data) => {
      let count = 0;
      data.forEach((el) => {
        console.log(el.val().writer_uid,userInfo.uid)
        if (
          el.val().nextManager.uid === userInfo.uid ||
          el.val().writer_uid === userInfo.uid
        ) {
          count++;
        }
      });
      setBoardWait(count)
      // setBoardWait((pre) => {
      //   if (pre === count) {
      //     return pre;
      //   } else {
      //     setTimeout(() => {
      //       setReCount(!reCount);
      //     }, 100);
      //     return count;
      //   }
      // });
    });
    setWaitCount(`결재요청(${boardWait})`);
    return () => {
      off(listRef);
    };
  }, [userInfo, reCount]);

  return (
    <>
      <LeftMenu>
        {router.includes("/setting") && (
          <>
            <ul className="depth_1">
              <li className={router === "/setting" ? "on" : ""}>
                <Link href="/setting/">기본설정</Link>
              </li>
              <li
                className={
                  router.includes("/setting/type_write") ||
                  router.includes("/setting/type_board")
                    ? "on"
                    : ""
                }
              >
                <Link href="/setting/type_board">결재양식</Link>
              </li>
            </ul>
          </>
        )}
        {router.includes("/insa") && (
          <>
            <ul className="depth_1">
              <li className={router === "/insa" ? "on" : ""}>
                <Link href="/insa/">직원정보</Link>
              </li>
            </ul>
          </>
        )}
        {router.includes("/schedule") && (
          <>
            <ul className="depth_1">
              <li className={router === "/schedule" ? "on" : ""}>
                <Link href="/schedule">스케쥴표</Link>
              </li>
              <li className={router === "/schedule/write" ? "on" : ""}>
                <Link href="/schedule/write">글작성</Link>
              </li>
              <li className={router === "/schedule/sign_ready" ? "on" : ""}>
                <Link href="/schedule/sign_ready">
                  <a>결재대기({dayoffCountNum})</a>
                </Link>
              </li>
              <li className={router === "/schedule/finish" ? "on" : ""}>
                <Link href="/schedule/finish">결재완료</Link>
              </li>
            </ul>
          </>
        )}
        {router.includes("/board") && (
          <>
            <ul className="depth_1">
              <li className={router.includes("/board/wait") ? "on" : ""}>
                <Link href="/board/wait">{waitCount}</Link>
              </li>
              <li className={router.includes("/board/list") ? "on" : ""}>
                <Link href="/board/list">결재완료</Link>
              </li>
              <li className={router === "/board/write" ? "on" : ""}>
                <Link href="/board/write">글작성</Link>
              </li>
            </ul>
          </>
        )}
        {router.includes("/stats") && (
          <>
            <ul className="depth_1">
              <li className={router.includes("/stats/price") ? "on" : ""}>
                <Link href="/stats/price">소득/지출</Link>
              </li>
            </ul>
          </>
        )}
      </LeftMenu>
    </>
  );
}

export default LeftMunu;
