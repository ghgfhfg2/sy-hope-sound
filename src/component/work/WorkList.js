import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { BoardLi } from "@component/BoardList";
import { format } from "date-fns";
import shortid from "shortid";
import None from "@component/None";
import styled from "styled-components";
import axios from "axios";
import useGetUser from "@component/hooks/getUserDb";
import { Pagenation } from "../Pagenation";
import Link from "next/link";

const WorkBoardList = styled(BoardLi)`
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
    .manager {
      flex: 1;
      max-width: 200px;
      span {
        width: auto;
      }
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

export default function WorkList() {
  const router = useRouter();
  useGetUser();
  const userAll = useSelector((state) => state.user.allUser);
  const [listData, setListData] = useState();
  const curPage = router.query["p"] || 1;

  const [totalPage, setTotalPage] = useState();
  const getWorkList = (page) => {
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_work_list",
        page,
      })
      .then((res) => {
        console.log(res);
        const total = res.data.total;
        setTotalPage(total);
        const list = res.data.list?.map((el) => {
          const findUser = userAll?.find((user) => el.writer === user.uid);
          const managerArr = JSON.parse(el.manager);
          const manager = [];
          managerArr.forEach((el) => {
            manager.push(userAll?.find((user) => el === user.uid));
          });
          return {
            ...findUser,
            ...el,
            manager,
          };
        });
        setListData(list);
      });
  };

  useEffect(() => {
    console.log(curPage);
    getWorkList(curPage);
    return () => {};
  }, [userAll, curPage]);

  return (
    <>
      <WorkBoardList>
        <li className="header">
          <span>번호</span>
          <span className="subject">제목</span>
          <span className="name">작성자</span>
          <span className="manager">담당자</span>
          <span className="date">작성일</span>
        </li>
        {listData &&
          listData.map((el) => (
            <li key={shortid()}>
              <span>{el.uid}</span>
              <span className="subject">
                <Link
                  href={{
                    pathname: "/work/view",
                    query: { uid: el.uid },
                  }}
                >
                  {el.title}
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
        {listData?.length === 0 && <None />}
      </WorkBoardList>
      <Pagenation total={totalPage} current={curPage} viewPage={10} />
    </>
  );
}
