import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FormErrorMessage,
  FormControl,
  Input,
  Button,
  Flex,
  FormLabel,
  Stack,
  Box,
  useRadioGroup,
  useToast,
} from "@chakra-ui/react";

import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { db } from "src/firebase";
import { ref, set, get } from "firebase/database";
import { format, getMonth, getDate } from "date-fns";
import styled from "styled-components";
import shortid from "shortid";
import ko from "date-fns/locale/ko";
import { CommonForm } from "pages/insa/setting";
import Editor from "@component/board/Editor";
import ComRadio from "@component/ComRadio";

export default function TypeList() {
  const router = useRouter()
  const toast = useToast();
  const userAll = useSelector((state) => state.user.allUser);
  const userInfo = useSelector((state) => state.user.currentUser);
  

  return (
    <>
      <Button>
        <Link href="/setting/type_write">
          양식작성
        </Link>
      </Button>
    </>
  );
}
