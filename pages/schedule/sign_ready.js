import BoardList, { BoardLi } from "@component/BoardList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import shortid from "shortid";
import { format, setDate } from "date-fns";
import styled from "styled-components";
import ConfirmPop from "@component/schedule/ConfirmPop";
import None from "@component/None";

const ReadyList = styled(BoardLi)`
  li {
    &.header {
      .subject {
        justify-content: center;
      }
    }
    .name {
      max-width: 150px;
      flex: 1;
    }
    .reason {
      flex: 1;
      max-width: 200px;
    }
    .subject {
      flex: 1;
      justify-content: flex-start;
      padding: 0 1rem;
    }
    .date {
      max-width: 150px;
      flex: 1;
    }
  }
`;

export default function SignReady() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const [readyList, setReadyList] = useState();
  useEffect(() => {
    let listRef;
    listRef = query(ref(db, `dayoff/temp`));
    onValue(listRef, (data) => {
      let listArr = [];
      data.forEach((el) => {
        let daySum = 0;
        el.val().list.forEach((li) => {
          daySum += li.day;
        });
        let obj = {
          ...el.val(),
          uid: el.key,
          daySum,
        };
        listArr.push(obj);
      });
      listArr = listArr.filter((el) => {
        return (
          el.nextManager.id === userInfo?.uid || el.userUid === userInfo?.uid
        );
      });
      setReadyList(listArr);
    });
    return () => {
      off(listRef);
    };
  }, [userInfo]);

  const [listData, setListData] = useState();
  const [isConfirmPop, setIsConfirmPop] = useState(false);
  const onList = (list) => {
    setListData(list);
    setIsConfirmPop(true);
  };
  const closePopup = () => {
    setListData("");
    setIsConfirmPop(false);
  };

  return (
    <>
      <ReadyList>
        <li className="header">
          <span className="name">이름</span>
          <span className="subject">제목</span>
          <span className="reason">사유</span>
          <span className="date">작성일</span>
        </li>
        {readyList &&
          readyList.map((el) => (
            <li key={shortid()}>
              <span className="name">{el.userName}</span>
              <span className="subject">
                <button type="button" onClick={() => onList(el)}>
                  {el.subject}
                </button>
              </span>
              <span className="reason">{el.reason}</span>
              <span className="date">
                {format(new Date(el.timestamp), "yyyy-MM-dd")}
              </span>
            </li>
          ))}
        {readyList?.length === 0 && <None />}
      </ReadyList>
      {listData && isConfirmPop && (
        <ConfirmPop
          userInfo={userInfo}
          listData={listData}
          closePopup={closePopup}
        />
      )}
    </>
  );
}
