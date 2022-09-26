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
import { ref, set, update, onValue, off, query, orderByChild } from "firebase/database";
import { format, getMonth, getDate } from "date-fns";
import styled from "styled-components";
import shortid from "shortid";
import ko from "date-fns/locale/ko";
import { CommonForm } from "pages/insa/setting";
import Editor from "@component/board/Editor";
import Link from "next/link";

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
  const watchTitle = watch('title')
  const [editorState, setEditorState] = useState();

  const [initTypeCon, setInitTypeCon] = useState();
  useEffect(() => {
    const typeRef = query(ref(db, `board/type_list/${router.query.id}`));
    onValue(typeRef, (data) => {
      console.log(data.val())
      if(data.val().title){
        setValue("title",data.val().title)
      }
      setInitTypeCon(data.val());
    });
    return () => {
      off(typeRef)
    };
  }, []);

  const handleEditor = (value) => {
    setEditorState(value);
  };
  const onSubmit = (values) => {
    let editCon = editorState || initTypeCon.editor || ""

    return new Promise((resolve) => {
      let uid = router.query.id || shortid.generate();
      let obj = {
        ...values,
        editor: editCon,
        timestamp: new Date().getTime(),
        writer_uid: userInfo.uid,
        manager: userInfo.manager_uid || "",
        uid,
      };
      const typeRef = ref(db, `board/type_list/${uid}`);
      update(typeRef, {
        ...obj,
      }).then(() => {
        toast({
          description: "저장되었습니다.",
          status: "success",
          duration: 1000,
          isClosable: false,
        });
        router.push("/setting/type_board");
      });
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
                {...register("title", {
                  required: "양식명은 필수항목 입니다.",
                })}
              />
            </div>
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
          {initTypeCon && initTypeCon.editor ? (
            <>
              <Editor
                initTypeCon={initTypeCon.editor}
                handleEditor={handleEditor}
              />
            </>
          ) : (
            <Editor handleEditor={handleEditor} />
          )}

          <Flex mt={4} width="100%" justifyContent="center">
            <Button
              width="150px"
              size="lg"
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              저장
            </Button>
            <Link href="/setting/type_board">
              <Button width="150px" size="lg" colorScheme="teal" ml={2}>
                목록
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </CommonForm>
  );
}
