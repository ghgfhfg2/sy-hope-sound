import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import styled from "styled-components";
import { CommonPopup } from "@component/insa/UserDayoffPop";
import axios from "axios";
import { WorkBoardList } from "./WorkList";
import useGetUser from "@component/hooks/getUserDb";
import Link from "next/link";

const WorkPopBox = styled(CommonPopup)`
  .con_box {
    min-height: 300px;
    height: auto;
    max-height: 90vh;
  }
`;

export const StepComponent = styled.span`
  .state {
    width: 55px;
    height: auto;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    color: #fff;
    font-weight: 600;
    &.state_1 {
      color: #2d3748;
      border: 1px solid #2d3748;
    }
    &.state_2 {
      color: #e53e3e;
      border: 1px solid #e53e3e;
    }
    &.state_3 {
      color: #2f855a;
      border: 1px solid #2f855a;
    }
    &.state_4 {
      color: #2b6cb0;
      border: 1px solid #2b6cb0;
    }
    &.state_5 {
      color: #a0aec0;
      border: 1px solid #a0aec0;
    }
  }
`;

export default function WorkPop({ selectWorkInfo, closeDayoffPop }) {
  const stateText = [
    { txt: "대기", state: 1 },
    { txt: "접수", state: 2 },
    { txt: "진행", state: 3 },
    { txt: "테스트", state: 4 },
    { txt: "완료", state: 5 },
  ];

  const router = useRouter();
  useGetUser();
  const userAll = useSelector((state) => state.user.allUser);

  const [listData, setListData] = useState();
  useEffect(() => {
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_select_work",
        state: selectWorkInfo.state,
        depth: selectWorkInfo.depth,
      })
      .then((res) => {
        const list = res.data?.cate?.map((el) => {
          const findUser = userAll?.find((user) => el.writer === user.uid);
          const manager = [];
          if (el.manager) {
            const managerArr = JSON.parse(el.manager);
            managerArr.forEach((el) => {
              manager.push(userAll?.find((user) => el === user.uid));
            });
          }
          el.cate_1 = JSON.parse(el.cate_1);
          el.cate_2 = el.cate_2 ? JSON.parse(el.cate_2) : "";
          el.cate_3 = el.cate_3 ? JSON.parse(el.cate_3) : "";
          return {
            ...findUser,
            ...el,
            manager,
          };
        });
        setListData(list);
      });
  }, []);

  return (
    <>
      <WorkPopBox>
        <div className="con_box">
          <WorkBoardList>
            <li className="header">
              <span>번호</span>
              <span>상태</span>
              <span className="subject">제목</span>
              <span className="name">작성자</span>
              <span className="manager">담당자</span>
              <span className="date">작성일</span>
            </li>
            {listData &&
              listData.map((el, idx) => (
                <li className="body" key={idx}>
                  <span>{el.uid}</span>
                  <StepComponent>
                    <span className={`state state_${el.state}`}>
                      {stateText[el.state - 1].txt}
                    </span>
                  </StepComponent>
                  <span className="subject">
                    <Link
                      target="_blank"
                      href={{
                        pathname: "/work/view",
                        query: { uid: el.uid },
                      }}
                    >
                      <a target="_blank" rel="noopener noreferrer">
                        {el.title}
                      </a>
                    </Link>
                  </span>
                  <span className="name">{el.name}</span>
                  <span className="manager">
                    {el.manager.map((mng, idx) => {
                      let comma = "";
                      if (idx != 0) {
                        comma = ", ";
                      }
                      return (
                        <>
                          <span>
                            {comma}
                            {mng?.name}
                          </span>
                        </>
                      );
                    })}
                  </span>
                  <span className="date">
                    {format(new Date(el.date_regis), "yyyy-MM-dd")}
                  </span>
                </li>
              ))}
          </WorkBoardList>
        </div>
        <div className="bg" onClick={closeDayoffPop}></div>
      </WorkPopBox>
    </>
  );
}