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
import { Button, Flex, Select } from "@chakra-ui/react";
import { StepComponent } from "@component/work/WorkPop";

export const WorkBoardList = styled(BoardLi)`
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
    &.body {
      .date {
        color: #888;
      }
      .subject {
        font-weight: 600;
      }
    }
  }
  @media all and (max-width: 640px) {
    overflow: auto;
    li {
      width: 600px;
    }
  }
`;

const WorkTopSelect = styled.div`
  @media all and (max-width: 640px) {
    .wrap {
      flex-direction: column;
    }
    .state {
      margin-top: 10px;
    }
  }
`;

export default function WorkList() {
  const userInfo = useSelector((state) => state.user.currentUser);
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
  const curPage = router.query["p"] || 1;

  const [totalPage, setTotalPage] = useState();
  const getWorkList = (page, state, project) => {
    if (!userInfo) return;
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_work_list",
        page,
        state,
        project,
        depth: userInfo.project_depth || "",
      })
      .then((res) => {
        const total = res.data.total;
        setTotalPage(total);
        const list = res.data.list?.map((el) => {
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
  };

  const [projectList, setProjectList] = useState();
  useEffect(() => {
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_project_list",
      })
      .then((res) => {
        setProjectList(res.data.project);
      });
  }, []);

  useEffect(() => {
    getWorkList(curPage);
    return () => {};
  }, [userAll, curPage, userInfo]);

  //상태 필터
  const [curState, setCurState] = useState();
  const filterState = (state) => {
    setCurState(state);
    getWorkList(1, state);
  };

  //프로젝트 필터
  const [curProject, setCurProject] = useState();
  const onFilterProject = (e) => {
    setCurProject(e.target.value);
    getWorkList(1, "", e.target.value);
  };

  return (
    <>
      <WorkTopSelect>
        <Flex className="wrap">
          {projectList && (
            <Select onChange={onFilterProject} width={200} mr={3}>
              <option value="" key="-1">
                전체 프로젝트
              </option>
              {projectList.map((el) => (
                <option value={el.uid} key={el.uid}>
                  {el.title}
                </option>
              ))}
            </Select>
          )}
          {stateText && (
            <>
              <Flex className="state" mb={3} gap={2}>
                <Button
                  colorScheme={curState ? "gray" : "teal"}
                  onClick={() => filterState()}
                >
                  전체
                </Button>
                {stateText.map((el) => (
                  <Button
                    colorScheme={curState == el.state ? "teal" : "gray"}
                    key={el.state}
                    onClick={() => filterState(el.state)}
                  >
                    {el.txt}
                  </Button>
                ))}
              </Flex>
            </>
          )}
        </Flex>
      </WorkTopSelect>
      <WorkBoardList>
        <li className="header">
          <span>번호</span>
          <span>상태</span>
          <span className="cate">프로젝트</span>
          <span className="cate">카테고리1</span>
          <span className="cate">카테고리2</span>
          <span className="subject">제목</span>
          <span className="name">작성자</span>
          <span className="manager">담당자</span>
          <span className="date">작성일</span>
        </li>
        {listData &&
          listData.map((el) => (
            <li className="body" key={shortid()}>
              <span>{el.uid}</span>
              <StepComponent>
                <span className={`state state_${el.state}`}>
                  {stateText[el.state - 1].txt}
                </span>
              </StepComponent>
              <span className="cate">{el.cate_1.title}</span>
              <span className="cate">{el.cate_2.title}</span>
              <span className="cate">{el.cate_3.title}</span>
              <span className="subject">
                <Link
                  href={{
                    pathname: "/work/view",
                    query: { uid: el.uid },
                  }}
                >
                  {el.title}
                </Link>
                {el.reply_cnt > 0 && (
                  <span style={{ marginLeft: "4px", width: "auto" }}>
                    ({el.reply_cnt})
                  </span>
                )}
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
        {!listData && <None />}
      </WorkBoardList>
      <Pagenation total={totalPage} current={curPage} viewPage={10} />
    </>
  );
}
