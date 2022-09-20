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
  HStack,
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

export default function Write() {
  const toast = useToast();
  const userAll = useSelector((state) => state.user.allUser);
  const router = useRouter();
  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleEditor = (value) => {
    console.log(value);
  };
  const onSubmit = (values) => {
    return new Promise((resolve) => {
      console.log(values);
      resolve();
    });
  };
  return (
    <CommonForm style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Flex>
        <Flex width="100%" flexDirection="column" gap={2}>
          <FormControl isInvalid={errors.subject}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="subject">
                제목
              </FormLabel>
              <Input
                id="subject"
                className="lg"
                placeholder="* 제목"
                {...register("subject", {
                  required: "제목은 필수항목 입니다.",
                })}
              />
            </div>
            <FormErrorMessage>
              {errors.subject && errors.subject.message}
            </FormErrorMessage>
          </FormControl>

          <Editor />

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
