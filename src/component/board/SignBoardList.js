import { BoardLi } from "@component/BoardList";
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
  startAt,
  endAt,
  orderByKey,
} from "firebase/database";
import shortid from "shortid";
import { format } from "date-fns";
import styled from "styled-components";
import FinishPop from "@component/schedule/FinishPop";
import None from "@component/None";
import Link from "next/link";
import ManagerListPop from "./ManagerListPop";

const SignBoardLi = styled(BoardLi)`
  li {
    .name {
      max-width: 150px;
      flex: 1;
    }
    .subject {
      flex: 1;
    }
    .date {
      max-width: 150px;
      flex: 1;
    }
  }
  .body{
    .subject{justify-content:flex-start;padding:0 1rem}
  }
`;

export default function SignBoardList() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const [boardList, setBoardList] = useState();
  useEffect(() => {
    const listRef = query(
      ref(db, `board/list`),
      orderByKey(),
      startAt("202209"),
      endAt("202209")
    );
    onValue(listRef, (data) => {
      let listArr = [];
      data.forEach((el) => {
        for (const key in el.val()) {
          let mg_list = [];
          mg_list = el.val()[key].manager.map(el=>el.uid)
          if(mg_list.includes(userInfo.uid)){
            let obj = {
              ...el.val()[key],
              uid: key,
              date:format(el.val()[key].timestamp,"yyyyMM"),
              date_:format(el.val()[key].timestamp,"yyyy-MM-dd")
            }
            listArr.push(obj)
          }
        }
      });
      setBoardList(listArr);
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
        <SignBoardLi>
          <li className="header">
            <span className="state">상태</span>
            <span className="subject">제목</span>
            <span className="date">작성일</span>
          </li>
          {boardList &&
            boardList.map((el) => 
              (
              <li className="body" key={shortid()}>
                <span className="state">
                  {el.state === 'ing' ? '결재대기' : ""}
                </span>
                <Link href={`/board/view?id=${el.uid}&date=${el.date}`}>
                  <span className="subject link">
                    {el.subject}
                  </span>
                </Link>
                <span className="date">{el.date_}</span>
              </li>
            )
            )}
          {boardList?.length === 0 && <None />}
        </SignBoardLi>
        {listData && isConfirmPop && (
          <FinishPop listData={listData} closePopup={closePopup} />
        )}
    </>
  );
}
