import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { CommonForm } from "pages/setting";
import { useForm } from "react-hook-form";
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
import { BsListCheck } from "react-icons/bs";
import { AiOutlinePlusSquare } from "react-icons/ai";
import useGetUser from "@component/hooks/getUserDb";
import styled from "styled-components";
import axios from "axios";
const WorkCateBox = styled.div`
  ul.depth_1 {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  ul.depth_1 ul {
    display: none;
    padding-left: 10px;
    margin-top: 5px;
  }
  ul.depth_1 > li {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  ul.depth_1 > li > .tit {
    font-size: 16px;
  }
  .tit_box {
    display: flex;
    align-items: center;
  }
  .tit {
    &.depth_1 {
      font-size: 16px;
    }
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: 600;
    padding-left: 17px;
    position: relative;
    .ic {
      position: absolute;
      left: 0;
      top: 5px;
      width: 11px;
      height: 11px;
      &::after {
        content: "";
        display: inline-block;
        width: 11px;
        height: 1px;
        background: #555;
        position: absolute;
        top: 5px;
        left: 0;
      }
      &::before {
        content: "";
        display: inline-block;
        width: 1px;
        height: 11px;
        background: #555;
        position: absolute;
        left: 5px;
        top: 0;
        transition: all 0.2s;
      }
    }
  }
  ul.depth_1 ul.on {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  ul.depth_3.on {
    gap: 5px !important;
  }

  .tit.open > .ic {
    &::before {
      transform: rotate(90deg);
    }
  }
  .btn_add {
    background: none;
    padding: 2px;
    width: auto;
    height: auto;
    min-width: 0;
    border: 1px solid #555;
    border-radius: 0;
    .ic {
      width: 7px;
      height: 7px;
      position: relative;
      &::after {
        content: "";
        display: inline-block;
        width: 7px;
        height: 1px;
        background: #555;
        position: absolute;
        top: 3px;
        left: 0;
      }
      &::before {
        content: "";
        display: inline-block;
        width: 1px;
        height: 7px;
        background: #555;
        position: absolute;
        left: 3px;
        top: 0;
        transition: all 0.2s;
      }
    }
    &.on .ic::before {
      display: none;
    }
  }
  .add_cate_box {
    display: none;
    align-items: center;
    &.on {
      display: flex;
    }
  }
  ul.depth_3 li {
    font-size: 12px;
    font-weight: 400;
    color: #555;
    .tit {
      cursor: auto;
    }
  }
`;

function WorkCate() {
  const router = useRouter();
  useGetUser();
  const toast = useToast();

  const userAll = useSelector((state) => state.user.allUser);
  const userInfo = useSelector((state) => state.user.currentUser);

  const toggleDepth = (e, depth) => {
    const tit = e.currentTarget;
    const li = tit.closest("li");
    const ul = li.querySelector(`ul[data-depth="${depth}"]`);
    tit.classList.toggle("open");
    ul.classList.toggle("on");
  };

  const onDepthInput = (e, depth) => {
    e.currentTarget.classList.toggle("on");
    const box = document.querySelector(`div[data-depth="${depth}"]`);
    box.classList.toggle("on");
  };

  let testCate = [
    {
      tit: "메뉴3",
      depth: "2",
    },
    {
      tit: "메뉴1",
      depth: "0",
    },
    {
      tit: "메뉴2",
      depth: "1",
    },
    {
      tit: "하위1_1",
      depth: "0_0",
    },
    {
      tit: "하위1_2",
      depth: "0_1",
    },
    {
      tit: "하위2_1",
      depth: "1_0",
    },
    {
      tit: "하위3",
      depth: "0_2",
    },
    {
      tit: "하위4",
      depth: "0_3",
    },
    {
      tit: "하위1_1_1",
      depth: "0_0_0",
    },
    {
      tit: "하위1_2_2",
      depth: "0_1_0",
    },
    {
      tit: "하위1_2_1",
      depth: "0_1_1",
    },
  ];
  let depthArr2 = [];
  let depthArr3 = [];

  let cateArr = [];

  testCate.forEach((el) => {
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

  const makeDepth = (depth) => {
    const d = depth.split("_");
    let idx;
    if (d.length == 1) {
      idx = 1 * cateArr[cateArr.length - 1].depth + 1;
    }
    if (d.length == 2) {
      idx = 1 * depthArr2[depthArr2.length - 1].depth + 1;
    }
    const title = document.querySelector(
      `div[data-depth="${depth}"] input`
    ).value;
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "regis_cate_depth",
        title,
        depth,
      })
      .then((res) => {
        toast({
          description: "카테고리가 추가 되었습니다.",
          status: "success",
          duration: 1000,
          isClosable: false,
        });
      });
  };

  return (
    <>
      <WorkCateBox>
        <ul className="depth_1">
          {cateArr &&
            cateArr.map((el) => {
              return (
                <>
                  <li>
                    <div className="tit_box">
                      <span
                        className="tit depth_1"
                        onClick={(e) => toggleDepth(e, el.depth)}
                      >
                        <span className="ic"></span>
                        {el.tit}
                      </span>
                      <Button
                        onClick={(e) => onDepthInput(e, el.depth)}
                        className="btn_add"
                        size="sm"
                        ml={2}
                      >
                        <span className="ic" />
                      </Button>
                      <div data-depth={el.depth} className="add_cate_box">
                        <Input size="sm" ml={2} placeholder="하위 카테고리명" />
                        <Button
                          onClick={() => makeDepth(el.depth)}
                          size="sm"
                          ml={1}
                          colorScheme="teal"
                        >
                          생성
                        </Button>
                      </div>
                    </div>
                    <ul data-depth={el.depth} className="depth_2">
                      {el.sub &&
                        el.sub.map((list) => (
                          <>
                            <li>
                              <div className="tit_box">
                                <span
                                  className="tit open"
                                  onClick={(e) => toggleDepth(e, list.depth)}
                                >
                                  <span className="ic"></span>
                                  {list.tit}
                                </span>
                                <Button
                                  onClick={(e) => onDepthInput(e, list.depth)}
                                  className="btn_add"
                                  size="sm"
                                  ml={2}
                                >
                                  <span className="ic" />
                                </Button>
                                <div
                                  data-depth={list.depth}
                                  className="add_cate_box"
                                >
                                  <Input
                                    size="sm"
                                    ml={2}
                                    placeholder="하위 카테고리명"
                                  />
                                  <Button
                                    onClick={() => makeDepth(list.depth)}
                                    size="sm"
                                    ml={1}
                                    colorScheme="teal"
                                  >
                                    생성
                                  </Button>
                                </div>
                              </div>
                              <ul
                                data-depth={list.depth}
                                className="depth_3 on"
                              >
                                {list.sub &&
                                  list.sub.map((list2) => (
                                    <>
                                      <li>
                                        <span className="tit">{list2.tit}</span>
                                      </li>
                                    </>
                                  ))}
                              </ul>
                            </li>
                          </>
                        ))}
                    </ul>
                  </li>
                </>
              );
            })}
          {/* <li>
            <Flex alignItems="center">
              <span className="tit" onClick={(e) => toggleDepth(e, "0")}>
                <span className="ic"></span>메뉴1
              </span>
              <Button className="btn_add" size="sm" ml={2}>
                <AiOutlinePlusSquare onClick={onDepthInput()} />
              </Button>
              <div className="add_cate_box">
                <Input size="sm" ml={2} placeholder="하위 카테고리명" />
                <Button
                  onClick={() => makeDepth("0")}
                  size="sm"
                  ml={1}
                  colorScheme="teal"
                >
                  생성
                </Button>
              </div>
            </Flex>
            <ul data-depth="0" className="depth_2">
              <li>
                <span className="tit" onClick={(e) => toggleDepth(e, "0_0")}>
                  <span className="ic"></span>하위1
                </span>
                <ul data-depth="0_0" className="depth_3">
                  <li>
                    <span className="tit">하위2</span>
                  </li>
                </ul>
              </li>
            </ul>
          </li> */}
        </ul>
      </WorkCateBox>
    </>
  );
}

export default WorkCate;
