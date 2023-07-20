import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { BoardLi } from "@component/BoardList";
import { getFormatDate } from "@component/CommonFunc";
import { format } from "date-fns";
import shortid from "shortid";
import None from "@component/None";
import styled from "styled-components";
import axios from "axios";
import useGetUser from "@component/hooks/getUserDb";
import { Pagenation } from "../Pagenation";
import Link from "next/link";
import { Flex, Input } from "@chakra-ui/react";

const AttendStateList = styled.ul`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
  li {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 7px 10px;
    &.state_1 {
      background: #ddd;
      color: #fff;
    }
    &.state_2 {
      background: #2c7a7b;
      border-color: #2c7a7b;
      color: #fff;
    }
    &.state_3 {
      background: #333;
      border-color: #333;
      color: #fff;
    }
  }
`;

const AttendBoardList = styled(BoardLi)`
  li {
    .date {
      width: 150px;
      flex-shrink: 0;
    }
  }
`;

export default function Attend() {
  const today = getFormatDate(new Date());
  const router = useRouter();
  useGetUser();
  const userAll = useSelector((state) => state.user.allUser);

  const [attendList, setAttendList] = useState();
  const [userStateList, setUserStateList] = useState();

  const getAttendList = (e) => {
    const date = e?.target.value || today.full_;
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "attend_all_list",
        date,
      })
      .then((res) => {
        const initState = userAll?.map((el) => {
          el.state = 1;
          return el;
        });
        setUserStateList(initState);
        setAttendList("");
        if (!res.data) return;
        const list = res.data.list.map((el) => {
          const user = userAll.find((user) => el.mem_uid == user.uid);
          el.date_regis = el.date_regis.split(" ")[1].substr(0, 5);
          el = {
            ...user,
            ...el,
          };
          return el;
        });
        let userState = userAll.map((el) => {
          const user = list.filter((user) => user.mem_uid == el.uid);
          el.state = 1;
          if (user.find((el) => el.type == "1")) el.state = 2;
          if (user.find((el) => el.type == "2")) el.state = 3;
          return el;
        });
        userState = userState.filter((el) => !el.hidden);
        setUserStateList(userState);
        setAttendList(list);
      });
  };
  useEffect(() => {
    getAttendList();
  }, []);

  return (
    <>
      <Flex>
        <Input
          id="date"
          type="date"
          defaultValue={today.full_}
          style={{ width: "150px", marginBottom: "10px", marginRight: "10px" }}
          placeholder="날짜"
          onChange={getAttendList}
        />
        <AttendStateList>
          <li className="state_1">미출근</li>
          <li className="state_2">출근</li>
          <li className="state_3">퇴근</li>
          <li>* 괄호 안은 출근 예정 시간</li>
        </AttendStateList>
      </Flex>
      <AttendStateList>
        {userStateList &&
          userStateList.map((el) => (
            <li key={el.uid} className={`state_${el.state}`}>
              {el.name} ({el.attendTime})
            </li>
          ))}
      </AttendStateList>
      <AttendBoardList>
        <li className="header">
          <span className="name">이름</span>
          <span className="date">예정시간</span>
          <span className="date">출근시간</span>
          <span className="date">퇴근시간</span>
          <span className="date">근무시간</span>
        </li>
        {attendList ? (
          attendList.map((el) => (
            <>
              <li key={el.uid}>
                <span>{el.name}</span>
                <span className="date">{el.attend_time}</span>
                <span className="date">{el.type == 1 && el.date_regis}</span>
                <span className="date">{el.type == 2 && el.date_regis}</span>
                <span className="date">{el.work_time}</span>
              </li>
            </>
          ))
        ) : (
          <None />
        )}
      </AttendBoardList>
    </>
  );
}
