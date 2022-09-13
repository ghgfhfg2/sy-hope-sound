import BoardList, { BoardLi } from "@component/BoardList";
import { useEffect, useState } from "react";
import { db } from "src/firebase";
import { ref, onValue, remove, get, off, update } from "firebase/database";
import shortid from "shortid";
import { format } from "date-fns";
import styled from "styled-components";
import ConfirmPop from "@component/schedule/ConfirmPop";
import None from "@component/None";

const ReadyList = styled(BoardLi)`
  li {
    .name {
      max-width: 150px;
      flex: 1;
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
  const [readyList, setReadyList] = useState();
  useEffect(() => {
    const listRef = ref(db, `dayoff/temp`);
    onValue(listRef, (data) => {
      let listArr = [];
      data.forEach((el) => {
        let obj = {
          ...el.val(),
          uid: el.key,
        };
        listArr.push(obj);
      });
      setReadyList(listArr);
    });
    return () => {
      off(listRef);
    };
  }, []);

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
      <BoardList>
        <ReadyList>
          <li className="header">
            <span className="name">이름</span>
            <span className="subject">제목</span>
            <span className="date">작성일</span>
          </li>
          {readyList?.map((el) => (
            <li key={shortid()}>
              <span className="name">{el.userName}</span>
              <span className="subject">
                <button type="button" onClick={() => onList(el)}>
                  {el.subject}
                </button>
              </span>
              <span className="date">
                {format(new Date(el.timestamp), "yyyy-MM-dd")}
              </span>
            </li>
          ))}
          {readyList?.length === 0 && <None />}
        </ReadyList>
      </BoardList>
      {listData && isConfirmPop && (
        <ConfirmPop listData={listData} closePopup={closePopup} />
      )}
    </>
  );
}
