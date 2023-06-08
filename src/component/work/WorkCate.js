import { useState } from "react";
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
import useGetUser from "@component/hooks/getUserDb";
import styled from "styled-components";
import axios from "axios";
const WorkCateBox = styled.div`
  ul.depth_1 ul {
    display: none;
  }
  ul.depth_1 ul.on {
    display: flex;
  }
`;

function WorkCate() {
  const router = useRouter();
  useGetUser();
  const toast = useToast();

  const userAll = useSelector((state) => state.user.allUser);
  const userInfo = useSelector((state) => state.user.currentUser);

  const toggleDepth = (depth) => {
    const ul = document.querySelector(`ul[data-depth="${depth}"]`);
    console.log(ul);
    ul.classList.toggle("on");
  };

  return (
    <>
      <WorkCateBox>
        <ul className="depth_1">
          <li>
            <span onClick={() => toggleDepth("0")}>메뉴1</span>
            <ul data-depth="0" className="depth_2">
              <li>
                <span onClick={() => toggleDepth("0_0")}>하위1</span>
                <ul data-depth="0_0" className="depth_3">
                  <li>하위2</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </WorkCateBox>
    </>
  );
}

export default WorkCate;
