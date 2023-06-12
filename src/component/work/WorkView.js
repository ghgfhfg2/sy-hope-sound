import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styled from "styled-components";
import axios from "axios";
import useGetUser from "@component/hooks/getUserDb";
import StepBox from "@component/work/StepBox";
import { Button, Flex, useToast } from "@chakra-ui/react";
import Link from "next/link";

export const WorkViewBox = styled.div`
  dt {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    border-top: 2px solid #555;
    font-size: 16px;
    font-weight: 600;
  }
  dd {
    padding: 15px;
    display: flex;
    gap: 50px;
    border-bottom: 1px solid #ddd;
  }
  .box {
    .tit {
      font-weight: 600;
    }
  }
`;

export default function WorkView() {
  const toast = useToast();
  const userInfo = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  useGetUser();
  const userAll = useSelector((state) => state.user.allUser);
  const [viewData, setViewData] = useState();
  const [render, setRender] = useState(true);

  const [stateData, setStateData] = useState();

  const stateText = [
    { txt: "대기", state: 1 },
    { txt: "접수", state: 2 },
    { txt: "진행", state: 3 },
    { txt: "테스트", state: 4 },
    { txt: "완료", state: 5 },
  ];
  useEffect(() => {
    const uid = router.query.uid;
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_work_view",
        uid,
      })
      .then((res) => {
        const writer = userAll?.find(
          (user) => res.data.work.writer === user.uid
        );
        const managerArr = JSON.parse(res.data.work.manager);
        const manager = [];
        managerArr.forEach((el) => {
          manager.push(userAll?.find((user) => el === user.uid));
        });
        setViewData({
          ...writer,
          ...res.data.work,
          manager,
        });
      });

    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_work_state",
        ruid: router.query.uid,
      })
      .then((res) => {
        let history = res.data?.history;
        if (!history) return;
        history = history.map((el) => {
          el.stateTxt = stateText[el.state - 1].txt;
          const writer = userAll?.find((user) => {
            return el.writer === user.uid;
          });
          el.writer = writer;
          return el;
        });
        setStateData(history);
      });
  }, [userAll, render]);

  const onRender = () => {
    setRender(!render);
  };

  const onWorkRemove = () => {
    const agree = confirm("삭제 하시겠습니까?");
    if (!agree) return;
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "remove_work_list",
        uid: router.query.uid,
      })
      .then((res) => {
        toast({
          description: "삭제되었습니다.",
          status: "success",
          duration: 1000,
          isClosable: false,
        });
        router.push("/work");
      });
  };

  return (
    <>
      {viewData && (
        <>
          <WorkViewBox>
            <dl>
              <dt>{viewData.title}</dt>
              <dd>
                <StepBox
                  stateText={stateText}
                  stateData={stateData}
                  step={viewData.state}
                  onRender={onRender}
                />
              </dd>
              <dd>
                <div className="box">
                  <span className="tit">작성자 : </span>
                  <span className="con">{viewData.name}</span>
                </div>
                <div className="box">
                  <span className="tit">담당자 : </span>
                  <span className="con">
                    {viewData.manager.map((mng, idx) => {
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
                </div>
                <div className="box">
                  <span className="tit">작성일 : </span>
                  <span className="con">{viewData.date_regis}</span>
                </div>
              </dd>
              <dd>
                <div
                  dangerouslySetInnerHTML={{ __html: viewData.content }}
                ></div>
              </dd>
            </dl>
          </WorkViewBox>
          <Flex mt={3}>
            {viewData.writer == userInfo.uid && (
              <>
                <Button
                  mr={1}
                  colorScheme="red"
                  onClick={() => onWorkRemove(viewData.uid)}
                >
                  삭제
                </Button>
                <Link
                  href={{
                    pathname: "/work/modify",
                    query: { uid: viewData.uid },
                  }}
                >
                  <Button mr={1}>수정</Button>
                </Link>
              </>
            )}
            <Link href="/work">
              <Button colorScheme="teal">목록</Button>
            </Link>
          </Flex>
        </>
      )}
    </>
  );
}
