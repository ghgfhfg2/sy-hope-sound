import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Button,
  Input,
  Box,
  RadioGroup,
  Radio,
  Stack,
  useToast,
  Select,
} from "@chakra-ui/react";
import useGetUser from "@component/hooks/getUserDb";
import axios from "axios";
import styled from "styled-components";
import WorkPop from "@component/work/WorkPop";

const MenuStructure = styled.div`
  margin-top: 20px;
  border: 1px solid #555;
  border-width: 2px 0;
  * {
    box-sizing: border-box;
  }
  .wid_1 {
    width: 220px;
  }
  .wid_2 {
    width: 130px;
  }
  .header {
    display: flex;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
    & > span {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      padding: 10px;
    }
  }
  .tit_box {
    padding: 10px;
  }
  li {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid #ddd;
    &:last-child {
      border-bottom: 0;
    }
  }
  .depth_2 {
    & > li > .tit_box {
      display: flex;
      font-weight: 600;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #ddd;
    }
  }
  .depth_3 {
    width: 100%;
    li {
      &:hover {
        background: #f9f9f9;
      }
      .tit_box {
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #ddd;
      }
    }
  }
`;

export default function Structure() {
  const router = useRouter();
  useGetUser();
  const toast = useToast();

  const userAll = useSelector((state) => state.user.allUser);
  const userInfo = useSelector((state) => state.user.currentUser);

  //카테고리
  const [cateUid1, setCateUid1] = useState();
  const [cateUid2, setCateUid2] = useState();
  const [cateUid3, setCateUid3] = useState();

  //가겨온 카테고리 가공
  const CateDataProcessing = (initArray) => {
    let depthArr2 = [];
    let depthArr3 = [];

    let cateArr = [];

    initArray.forEach((el) => {
      const depth = el.depth.split("_");
      if (depth.length == 1) {
        cateArr.push(el);
      }
      if (depth.length == 2) {
        depthArr2.push(el);
      }
      if (depth.length == 3) {
        depthArr3.push(el);
      }
    });

    cateArr.sort((a, b) => a.depth - b.depth);

    depthArr3.forEach((d3) => {
      const idx = depthArr2.findIndex(
        (d2) =>
          d2.depth.split("_")[0] == d3.depth.split("_")[0] &&
          d2.depth.split("_")[1] == d3.depth.split("_")[1]
      );
      if (depthArr2[idx].sub) {
        depthArr2[idx].sub.push(d3);
      } else {
        depthArr2[idx].sub = [d3];
      }
    });

    depthArr2.forEach((d2) => {
      if (d2.sub) {
        d2.sub.sort((a, b) => a.depth.split("_")[2] - b.depth.split("_")[2]);
      }
      const idx = cateArr.findIndex(
        (d1) => d1.depth.split("_")[0] == d2.depth.split("_")[0]
      );
      if (cateArr[idx].sub) {
        cateArr[idx].sub.push(d2);
      } else {
        cateArr[idx].sub = [d2];
      }
    });

    cateArr.forEach((el) => {
      if (el.sub) {
        el.sub.sort((a, b) => a.depth.split("_")[1] - b.depth.split("_")[1]);
      }
    });
    return cateArr;
  };

  //카테고리 선택
  const [selectCateDepth2, setSelectCateDepth2] = useState();
  const [selectCateDepth3, setSelectCateDepth3] = useState();

  const onChangeCate = (e, depth) => {
    let uid;
    if (typeof e == "string") {
      uid = e;
    } else {
      uid = e.target.value;
    }
    if (depth == 1) {
      setSelectCateDepth2("");
      setSelectCateDepth3("");
      setCateUid2("");
      setCateUid3("");
      if (uid) {
        for (let i = 0; i < cateList.length; i++) {
          if (cateList[i].uid == uid && cateList[i].sub) {
            setCateUid1(cateList[i]);
            setSelectCateDepth2(cateList[i].sub);
          }
        }
      } else {
        setCateUid1("");
      }
    } else if (depth == 2) {
      if (uid) {
        for (let i = 0; i < selectCateDepth2.length; i++) {
          if (selectCateDepth2[i].uid == uid && selectCateDepth2[i].sub) {
            setSelectCateDepth3(selectCateDepth2[i].sub);
            setCateUid2(selectCateDepth2[i]);
            setCateUid3("");
          }
        }
      } else {
        setCateUid2("");
        setCateUid3("");
        setSelectCateDepth3("");
      }
    } else {
      if (uid) {
        for (let i = 0; i < selectCateDepth3.length; i++) {
          if (selectCateDepth3[i].uid == uid) {
            setCateUid3(selectCateDepth3[i]);
          }
        }
      } else {
        setCateUid3("");
      }
    }
  };

  const [render, setRender] = useState();
  const [cateList, setCateList] = useState();
  useEffect(() => {
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_cate_work",
      })
      .then((res) => {
        console.log(res);
        const listData = CateDataProcessing(res.data.cate);
        setCateList(listData);
      });
  }, [render]);

  //리스트 팝업
  const [isWorkPop, setIsWorkPop] = useState(false);
  const [selectWorkInfo, setSelectWorkInfo] = useState();

  const onPopWorkList = (state, depth) => {
    setIsWorkPop(true);
    setSelectWorkInfo({ state, depth });
  };
  const closeDayoffPop = () => {
    setIsWorkPop(false);
  };

  return (
    <>
      <Flex>
        <Select width={250} onChange={(e) => onChangeCate(e, 1)}>
          <option value="">프로젝트 선택</option>
          {cateList &&
            cateList.map((el) => (
              <>
                <option key={el.uid} value={el.uid}>
                  {el.title}
                </option>
              </>
            ))}
        </Select>
      </Flex>

      {selectCateDepth2 && (
        <MenuStructure>
          <div className="header">
            <span className="wid_1">카테고리1</span>
            <span className="wid_1">카테고리2</span>
            <span className="wid_2">진행상황</span>
            <span className="wid_2">미완료</span>
            <span className="wid_2">완료</span>
          </div>
          <ul className="depth_2">
            {selectCateDepth2.map((list) => (
              <>
                <li key={list.uid}>
                  <div className="tit_box wid_1">
                    <span className="tit open">
                      <span className="ic"></span>
                      {list.title}
                    </span>
                  </div>
                  <ul data-depth={list.depth} className="depth_3 on">
                    {list.sub &&
                      list.sub.map((list2) => (
                        <>
                          <li key={list2.uid}>
                            <div className="tit_box wid_1">
                              <span className="tit">{list2.title}</span>
                            </div>
                            <div className="tit_box wid_2">진행상황</div>
                            <div className="tit_box wid_2">
                              {list2.work?.state_1 && (
                                <button
                                  onClick={() => onPopWorkList(1, list2.depth)}
                                >
                                  {list2.work.state_1.length} 건
                                </button>
                              )}
                            </div>
                            <div className="tit_box wid_2">
                              {list2.work?.state_2 && (
                                <button
                                  onClick={() => onPopWorkList(2, list2.depth)}
                                >
                                  {list2.work.state_2.length} 건
                                </button>
                              )}
                            </div>
                          </li>
                        </>
                      ))}
                  </ul>
                </li>
              </>
            ))}
          </ul>
        </MenuStructure>
      )}
      {isWorkPop && (
        <WorkPop
          selectWorkInfo={selectWorkInfo}
          closeDayoffPop={closeDayoffPop}
        />
      )}
    </>
  );
}
