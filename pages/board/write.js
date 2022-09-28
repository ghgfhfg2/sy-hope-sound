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
import { format, getYear, getMonth, getDate } from "date-fns";
import styled from "styled-components";
import shortid from "shortid";
import ko from "date-fns/locale/ko";
import { CommonForm } from "pages/insa/setting";
import Editor from "@component/board/Editor";
import ComRadio from "@component/ComRadio";
import ManagerListPop from "@component/board/ManagerListPop";

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

  const watchRadio = watch("type");

  const [editorState, setEditorState] = useState();
  const handleEditor = (value) => {
    setEditorState(value);
  };  

  const onSubmit = (values) => {

    const CurDate = new Date();
    if(!checkManagerList){
      toast({
        description: "결재자를 선택해주세요",
        status: "error",
        duration: 1000,
        isClosable: false,
      })
      return;
    }
    return new Promise((resolve) => {
      let manager = managerList.map((el) => {
        let mng = {
          name: el.name,
          uid: el.uid,
        };
        return mng;
      });
      let obj = {
        ...values,
        editor: editorState,
        timestamp: CurDate.getTime(),
        writer_uid: userInfo.uid,
        manager: manager,
        state: 'ing',
        nextManager: manager[0]
      };
      const listRef = ref(db,`board/list/${format(CurDate,"yyyyMM")}/${shortid.generate()}`)
      set(listRef,{
        ...obj
      })
      .then(()=>{
        toast({
          description: "제출 완료 되었습니다.",
          status: 'success',
          duration: 1000,
          isClosable: false,
        })
      })
      .then(()=>{
        router.push('/board/list')
        resolve();
      })
    });
  };

  const [radioList, setRadioList] = useState();
  const [typeCon, setTypeCon] = useState();
  useEffect(() => {
    const typeRef = ref(db, `board/type_list`);
    onValue(typeRef, (data) => {
      let arr = [];
      let conArr = [];
      data.forEach((el) => {
        arr.push(`${el.val().uid}_${el.val().title}`);
        conArr.push(el.val());
      });
      setTypeCon(conArr);
      setRadioList(arr);
    });

    return () => {
      off(typeRef);
    };
  }, []);

  // 담당자 편집
  const [managerList, setManagerList] = useState();
  const [checkManagerList, setCheckManagerList] = useState();
  useEffect(() => {
    if (userAll) {
      let list = userAll.filter((el) => el.manager === 1);
      setManagerList(list);
    }
  }, [userAll]);

  const [isManagerPop, setIsManagerPop] = useState(false);
  const onManagerPop = () => {
    if(checkManagerList){
      toast({
        description: "다시 선택하려면 선택취소를 해주세요.",
        status: "error",
        duration: 1000,
        isClosable: false,
      });
    }else{
      setIsManagerPop(true);
    }
  };
  const closeManagerPop = () => {
    setIsManagerPop(false);
  };
  const onSelectManager = (checkedItems) => {
    let newList = checkedItems.sort((a, b) => {
      return a.value - b.value;
    });
    setCheckManagerList(newList);
    onManager(newList);
    closeManagerPop();
  };

  const [editorDisable, setEditorDisable] = useState(false);
  const [insertHtml, setInsertHtml] = useState();

  const onManager = (managerList) => {

    let newEditor = clearManager(editorState,managerList)
    managerList.forEach((el, idx) => {
      let pos = newEditor.indexOf(`<!-- add_start_${idx + 1} -->`);
      newEditor = [
        newEditor.slice(0, pos + 37),
        el.name,
        newEditor.slice(pos + 37),
      ].join("");
    });
    setEditorDisable(true);
    setInsertHtml(newEditor);
    setEditorState(newEditor);
  };
  const offManager = () => {

    let newEditor = clearManager(editorState,managerList)
    setInsertHtml(newEditor);
    setEditorState(newEditor);
    setEditorDisable(false);
    setCheckManagerList("");
  };

  const clearManager = (editorState,managerList) => {
    let newEditor = editorState;
    managerList.forEach((el, idx) => {
      let start = newEditor.indexOf(`<!-- add_start_${idx + 1} -->`);
      let end = newEditor.indexOf(`<!-- add_end_${idx + 1} -->`);
      newEditor = [newEditor.slice(0, start + 37), newEditor.slice(end)].join(
        ""
      );
    });
    return newEditor
  }

  const onEditor = () => {
    if(editorDisable){
      toast({
        description: "결재자 선택시 양식을 수정할 수 없습니다.",
        status: "info",
        duration: 1000,
        isClosable: false,
      })
    }
  }

  return (
    <>
      {isManagerPop && managerList && (
        <ManagerListPop
          userData={managerList}
          closeManagerPop={closeManagerPop}
          onSelectManager={onSelectManager}
          isManagerPop={isManagerPop}
        />
      )}
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
                {radioList && (
                  <ComRadio
                    name={"type"}
                    list={radioList}
                    label={`유형`}
                    register={register}
                    {...register("type", {
                      required: "제목은 필수항목 입니다.",
                    })}
                  />
                )}
              </div>
              <FormErrorMessage>
                {errors.type && errors.type.message}
              </FormErrorMessage>
            </FormControl>
            {watchRadio && (
              <>
                <div onClick={onEditor}>
                <Editor
                  disable={editorDisable}
                  insertHtml={insertHtml}
                  typeCon={typeCon}
                  handleEditor={handleEditor}
                  type={watchRadio}
                />
                </div>
                <FormControl isInvalid={errors.manager}>
                  <div className="row_box">
                    <FormLabel className="label" htmlFor="manager">
                      결재자
                    </FormLabel>
                    <Input
                      type="text"
                      className="sm"
                      value={
                        checkManagerList &&
                        checkManagerList.map((el) => el.name)
                      }
                      readOnly
                    />
                    <Button colorScheme="teal" onClick={onManagerPop} ml={2}>
                      결재자 선택
                    </Button>
                    <Button colorScheme="red" onClick={offManager} ml={2}>
                      선택취소
                    </Button>
                  </div>
                  <FormErrorMessage>
                    {errors.manager && errors.manager.message}
                  </FormErrorMessage>
                </FormControl>
              </>
            )}

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
    </>
  );
}
