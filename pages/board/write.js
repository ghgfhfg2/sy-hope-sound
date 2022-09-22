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

import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { db } from "src/firebase";
import { ref, set, get, onValue, off } from "firebase/database";
import { format, getMonth, getDate } from "date-fns";
import styled from "styled-components";
import shortid from "shortid";
import ko from "date-fns/locale/ko";
import { CommonForm } from "pages/insa/setting";
import Editor from "@component/board/Editor";
import ComRadio from "@component/ComRadio";

export default function Write() {
  const toast = useToast();
  const userAll = useSelector((state) => state.user.allUser);
  const userInfo = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  const {
    setValue,
    watch,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  
  const watchRadio = watch("type")

  const [editorState, setEditorState] = useState()
  const handleEditor = (value) => {
    setEditorState(value);
  };
  const onSubmit = (values) => {
    return new Promise((resolve) => {
      let obj = {
        ...values,
        editor:editorState,
        timestamp:new Date().getTime(),
        writer_uid:userInfo.uid,
        manager:userInfo.manager_uid || ''
      }
      console.log(obj);
      resolve();
    });
  };


  const [radioList, setRadioList] = useState()
  const [typeCon, setTypeCon] = useState()
  useEffect(() => {
    const typeRef = ref(db,`board/type_list`)
    onValue(typeRef,data=>{
      let arr = [];
      let conArr = [];
      data.forEach(el=>{
        arr.push(`${el.val().uid}_${el.val().title}`)
        conArr.push(el.val())
      })
      setTypeCon(conArr)
      setRadioList(arr)
    })
  
    return () => {
      off(typeRef)
    }
  }, [])


  return (
    <CommonForm style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Flex>
        <Flex width="100%" flexDirection="column" gap={5}>
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

          <FormControl isInvalid={errors.type}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="type">
                유형
              </FormLabel>
              {radioList &&
                <ComRadio name={'type'} list={radioList} 
                  label={`유형`}
                  register={register}
                  {...register("type", {
                    required: "제목은 필수항목 입니다.",
                  })}
                />
              }
            </div>
            <FormErrorMessage>
              {errors.type && errors.type.message}
            </FormErrorMessage>
          </FormControl>
          
          {watchRadio && 
            <Editor typeCon={typeCon} handleEditor={handleEditor} type={watchRadio} />
          } 

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
