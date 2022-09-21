import React, { useState, useEffect, useRef } from "react";
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

import { db } from "src/firebase";
import { ref, set, get } from "firebase/database";
import { format, getMonth, getDate } from "date-fns";
import styled from "styled-components";
import shortid from "shortid";
import ko from "date-fns/locale/ko";
import { CommonForm } from "pages/insa/setting";
import Editor from "@component/board/Editor";

export default function TypeBoard() {
  const toast = useToast();
  const userInfo = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  const {
    setValue,
    watch,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const watchRadio = watch("type");

  const [editorState, setEditorState] = useState();
  const handleEditor = (value) => {
    setEditorState(value);
  };
  const onSubmit = (values) => {
    return new Promise((resolve) => {
      let obj = {
        ...values,
        editor: editorState,
        timestamp: new Date().getTime(),
        writer_uid: userInfo.uid,
        manager: userInfo.manager_uid || "",
      };
      console.log(obj);
      resolve();
    });
  };

  return (
    <CommonForm style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Flex>
        <Flex width="100%" flexDirection="column" gap={5}>
          <FormControl isInvalid={errors.title}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="title">
                * 양식명
              </FormLabel>
              <Input
                id="title"
                className="sm"
                placeholder="양식을 선택할때 보여지는 타이틀 입니다."
                {...register("title", {
                  required: "양식명은 필수항목 입니다.",
                })}
              />
            </div>
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.type}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="type">
                * 양식타입
              </FormLabel>
              <Input
                id="type"
                className="sm"
                placeholder="양식을 구분짓는 타입명 입니다.(영어)"
                {...register("type", {
                  required: "양식타입은 필수항목 입니다.",
                  pattern: /^[A-Za-z]+$/i,
                })}
              />
            </div>
            <FormErrorMessage>
              {errors.type &&
                errors.type.type === "required" &&
                errors.type.message}
              {errors.type && errors.type.type === "pattern" && (
                <>양식타입은 영문만 가능합니다.</>
              )}
            </FormErrorMessage>
          </FormControl>

          <Editor handleEditor={handleEditor} />

          <Flex mt={4} width="100%" justifyContent="center">
            <Button
              width="150px"
              size="lg"
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              제출
              {isSubmitting}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </CommonForm>
  );
}
