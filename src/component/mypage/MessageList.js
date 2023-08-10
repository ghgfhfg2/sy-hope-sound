import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetUser from "@component/hooks/getUserDb";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import styled from "styled-components";
import { Pagenation } from "../Pagenation";
import { WorkBoardList } from "@component/work/WorkList";
import { useRouter } from "next/router";
import None from "@component/None";
import MessageViewPop from "./MessageViewPop";
import { format, register } from "timeago.js";
import koLocale from "timeago.js/lib/lang/ko";
import MeessageReplyPop from "./MessageReplyPop";
register("ko", koLocale);
const MessageBoardList = styled(WorkBoardList)`
  .body {
    .subject {
      cursor: pointer;
      font-weight: 600;
      color: #222;
      &.read {
        color: #888;
      }
    }
  }
`;

export default function MessageList() {
  const router = useRouter();
  const toast = useToast();
  useGetUser();
  const userAll = useSelector((state) => state.user.allUser);
  const userInfo = useSelector((state) => state.user.currentUser);
  const [listData, setListData] = useState();

  const curPage = router.query["p"] || 1;
  const [totalPage, setTotalPage] = useState();

  const [render, setRender] = useState(false);
  const onRender = () => {
    setRender(!render);
  };
  useEffect(() => {
    if (!userInfo) return;
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_message_list",
        mem_uid: userInfo.uid,
        page: curPage,
      })
      .then((res) => {
        if (!res.data) return;
        const total = res.data.total;
        setTotalPage(total);
        const list = res.data.list?.map((el) => {
          const findUser = userAll?.find((user) => el.writer === user.uid);
          return {
            ...findUser,
            ...el,
          };
        });
        setListData(list);
      });
  }, [userInfo, render]);

  const [isMessagePop, setisMessagePop] = useState(false);
  const [msgData, setMsgData] = useState();
  const onMessageViewPop = (data) => {
    const user = userAll.find((el) => el.uid == data.writer);
    const viewCon = {
      ...user,
      ...data,
    };
    setMsgData(viewCon);
    setisMessagePop(true);
  };

  const readMessage = (uid) => {
    const newList = listData.map((el) => {
      if (el.uid == uid) {
        el.read_state = "1";
      }
      return el;
    });
    setListData(newList);
    axios.post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
      a: "update_message_state",
      uid,
      read_state: 1,
    });
  };

  const closeMessagePop = () => {
    setisMessagePop(false);
  };

  const [isReplyPop, setIsReplyPop] = useState(false);
  const onReplyPop = () => {
    setIsReplyPop(true);
  };
  const closeReplyPop = () => {
    setIsReplyPop(false);
  };

  const onRemoveMessage = () => {
    console.log(11);
    console.log(msgData);
  };

  return (
    <>
      <MessageBoardList>
        <li className="header">
          <span>번호</span>
          <span className="name">상태</span>
          <span className="subject">제목</span>
          <span className="name">보낸사람</span>
          <span className="date">보낸시간</span>
        </li>
        {listData &&
          listData.map((el, idx) => {
            const num = listData.length - idx;
            return (
              <li className="body" key={el.uid}>
                <span>{num}</span>
                <span className="date">
                  {el.read_state > 0 ? "읽음" : "미확인"}
                </span>
                <span
                  onClick={() => onMessageViewPop(el)}
                  className={`${
                    el.read_state > 0 ? "subject read" : "subject"
                  }`}
                >
                  {el.title}
                </span>
                <span className="name">
                  {el.name}({el.rank})
                </span>
                <span className="date">{format(el.date_regis, "ko")}</span>
              </li>
            );
          })}
        {listData?.length === 0 && <None />}
      </MessageBoardList>
      <Pagenation
        type="report"
        total={totalPage}
        current={curPage}
        viewPage={10}
      />
      {isMessagePop && (
        <MessageViewPop
          onReplyPop={onReplyPop}
          msgData={msgData}
          onRemoveMessage={onRemoveMessage}
          readMessage={readMessage}
          closeMessagePop={closeMessagePop}
        />
      )}
      {isReplyPop && (
        <MeessageReplyPop
          msgData={msgData}
          closeReplyPop={closeReplyPop}
          closeMessagePop={closeMessagePop}
          onRender={onRender}
        />
      )}
    </>
  );
}
