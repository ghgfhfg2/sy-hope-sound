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
import {
  ref,
  set,
  update,
  onValue,
  off,
  query,
  orderByChild,
  remove,
} from "firebase/database";
import { format, getMonth, getDate } from "date-fns";
import styled from "styled-components";
import shortid from "shortid";
import ko from "date-fns/locale/ko";
import { CommonForm } from "pages/insa/setting";
import Editor from "@component/board/Editor";
import Link from "next/link";

export default function SignBoardView() {
  const toast = useToast();
  const userInfo = useSelector((state) => state.user.currentUser);
  const router = useRouter();
  const queryPath = `${router.query.date}/${router.query.id}`;

  const {
    setValue,
    watch,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const watchRadio = watch("type");
  const watchTitle = watch("subject");
  const [editorState, setEditorState] = useState();

  const [insertHtml, setInsertHtml] = useState();
  const [initTypeCon, setInitTypeCon] = useState();
  useEffect(() => {
    const listRef = query(ref(db, `board/list/${queryPath}`));
    onValue(listRef, (data) => {
      if(data.val()){
        if (data.val().subject) {
          setValue("subject", data.val().subject);
        }
        setInitTypeCon(data.val());
      }
    });
    return () => {
      off(listRef);
    };
  }, []);

  const handleEditor = (value) => {
    setEditorState(value);
  };
  const onSubmit = (values) => {
    let editCon = editorState || initTypeCon.editor || "";

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
      const listRef = ref(db, `board/list/${uid}`);
      update(listRef, {
        ...obj,
      }).then(() => {
        toast({
          description: "저장되었습니다.",
          status: "success",
          duration: 1000,
          isClosable: false,
        });
        router.push("/board/list");
      });
      resolve();
    });
  };

  const [isSignLoading, setIsSignLoading] = useState(false);
  //결재
  const onSign = () => {
    setIsSignLoading(true);

    let newEditor = initTypeCon.editor;
    initTypeCon.manager.forEach((el, idx) => {
      if (el.uid === userInfo.uid) {
        let start = newEditor.indexOf(`<!-- add_start_${idx + 1} -->`);
        let end = newEditor.indexOf(`<!-- add_end_${idx + 1} -->`);
        newEditor = [
          newEditor.slice(0, start + 37),
          `<div class="stamp">${el.name}</div>`,
          newEditor.slice(end),
        ].join("");
      }
    });

    const curIdx = initTypeCon.manager.findIndex(
      (el) => el.uid === userInfo.uid
    );
    update(ref(db, `board/list/${queryPath}`), {
      editor: newEditor,
      nextManager: initTypeCon.manager[curIdx + 1] || "",
      cancelManager: initTypeCon.manager[curIdx],
      state: initTypeCon.manager[curIdx + 1] ? "ing" : "finish",
    })
    .then(()=>{
      toast({
        description: "결재 되었습니다.",
        status: 'success',
        duration: 1000,
        isClosable: false,
      })
      setInsertHtml(newEditor);
      setEditorState(newEditor);
      setIsSignLoading(false);
    })

  };

  //결재취소
  const onSignCancel = () => {
    const idx = initTypeCon.manager.findIndex(el=>el.uid === userInfo.uid)
    let newEditor = initTypeCon.editor;
    let start = newEditor.indexOf(`<!-- add_start_${idx + 1} -->`);
    let end = newEditor.indexOf(`<!-- add_end_${idx + 1} -->`);
    newEditor = [
      newEditor.slice(0, start + 37),
      `${userInfo.name}`,
      newEditor.slice(end),
    ].join("");

    update(ref(db, `board/list/${queryPath}`), {
      editor: newEditor,
      nextManager: initTypeCon.manager[idx],
      cancelManager: idx > 0 ? initTypeCon.manager[idx] : "",
      state: "ing",
    })
    .then(()=>{
      toast({
        description: "결재가 취소되었습니다.",
        status: 'success',
        duration: 1000,
        isClosable: false,
      })
      setInsertHtml(newEditor);
      setEditorState(newEditor);
    })

  }

  //글 삭제
  const onRemove = () => {
    remove(ref(db,`board/list/${queryPath}`))
    .then(()=>{
      toast({
        description: "삭제 되었습니다.",
        status: 'success',
        duration: 1000,
        isClosable: false,
      })
      router.push('/board/list')
    })
  }

  return (
    <CommonForm style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Flex>
        <Flex width="100%" flexDirection="column" gap={5}>
          <FormControl isInvalid={errors.title}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="subject">
                * 제목
              </FormLabel>
              <Input
                id="subject"
                readOnly
                className="sm"
                {...register("subject", {
                  required: "제목은 필수항목 입니다.",
                })}
              />
            </div>
            <FormErrorMessage>
              {errors.subject && errors.subject.message}
            </FormErrorMessage>
          </FormControl>
          {initTypeCon && initTypeCon.editor ? (
            <>
              <Editor
                disable={true}
                initTypeCon={initTypeCon.editor}
                insertHtml={insertHtml}
                handleEditor={handleEditor}
              />
            </>
          ) : (
            <Editor handleEditor={handleEditor} />
          )}

          <Flex mt={4} width="100%" justifyContent="center">
            {/* <Button
              width="150px"
              size="lg"
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              저장
            </Button> */}
            {initTypeCon?.nextManager.uid === userInfo?.uid && (
              <Button
                width="150px"
                size="lg"
                ml={2}
                colorScheme="teal"
                isLoading={isSignLoading}
                onClick={onSign}
              >
                결재
              </Button>
            )}
            {initTypeCon && initTypeCon.cancelManager?.uid === userInfo?.uid && (
              <Button
                width="150px"
                size="lg"
                ml={2}
                colorScheme="red"
                isLoading={isSignLoading}
                onClick={onSignCancel}
              >
                결재취소
              </Button>
            )}
            {initTypeCon && !initTypeCon.cancelManager && initTypeCon.writer_uid === userInfo?.uid && 
              <Button
                width="150px"
                size="lg"
                ml={2}
                colorScheme="red"
                isLoading={isSignLoading}
                onClick={onRemove}
              >
                삭제
              </Button>
            }
            <Link href="/board/list">
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
