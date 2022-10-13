import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
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
  NumberInput,
  useToast,
} from "@chakra-ui/react";

import { db } from "src/firebase";
import { ref, set, get, onValue, off } from "firebase/database";
import { format, getYear, getMonth, getDate } from "date-fns";
import styled from "styled-components";
import shortid from "shortid";
import { CommonForm } from "pages/setting";
import AddressPop from "../popup/AddressPop";




const BoardWrite = styled(CommonForm)`
  .row_box {
    .price {
      margin-left: 5px;
      color: #858585;
    }
  }
`;

export default function PartnerRegist() {

  const toast = useToast();
  const router = useRouter();

  const {
    setValue,
    watch,
    handleSubmit,
    setFocus,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [openPostcode, setOpenPostcode] = useState(false);
  const handle = {
    // 버튼 클릭 이벤트
    clickButton: () => {
      onPostcode();
    },

    // 주소 선택 이벤트
    selectAddress: (data) => {
      setValue('address',data.zonecode);
      setValue('address2',data.address);
      setFocus('address3')
      closePostcode()
    },
  }

  const onPostcode = () => {
    setOpenPostcode(true)
  }
  const closePostcode = () => {
    setOpenPostcode(false);
  }


  const onSubmit = async (values) => {
    const partnerRef = ref(db,`partners/list/${shortid.generate()}`)
    set(partnerRef,{
      ...values
    })
    .then(()=>{
      toast({
        description: "등록 되었습니다.",
        status: "success",
        duration: 1000,
        isClosable: false,
      })
      router.push('/partners')
    })
  }

  return (
    <BoardWrite style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
      <Flex>
        <Flex width="100%" flexDirection="column" gap={5}>
          <FormControl isInvalid={errors.name}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="name">
                회사명
              </FormLabel>
              <Input
                id="name"
                className="xs"
                placeholder="* 회사명"
                {...register("name", {
                  required: "이름은 필수항목 입니다.",
                })}
              />
            </div>
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.call}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="call">
                전화번호
              </FormLabel>
              <Input
                id="call"
                type="text"
                className="xs"
                placeholder="전화번호"
                {...register("call")}
              />
            </div>
            {errors.call &&  (
              <>{errors.call.type}</>
            )}
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="email">
                이메일
              </FormLabel>
              <Input
                id="email"
                className="sm"
                placeholder="이메일"
                {...register("email", {
                  pattern: /^\S+@\S+$/i,
                })}
              />
            </div>
            <FormErrorMessage>
              {errors.email && errors.email.type === "pattern" && (
                <>이메일 형식이 맞지 않습니다.</>
              )}
            </FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={errors.address}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="address">
                주소
              </FormLabel>
              <Box style={{width:"100%"}}>
                <Flex>
                  <Input
                    id="address"
                    className="xs"
                    placeholder="우편번호"
                    readOnly
                    {...register("address")}
                  />
                  <Button ml={2} colorScheme="teal" variant="outline" onClick={handle.clickButton}>주소찾기</Button>
                </Flex>
                <Flex flexDirection="column">
                  <Input
                    id="address2"
                    mt={2}
                    className="md"
                    placeholder="기본주소"
                    readOnly
                    {...register("address2")}
                  />
                  <Input
                    id="address3"
                    mt={2}
                    className="md"
                    placeholder="상세주소"
                    {...register("address3")}
                  />
                </Flex>
              </Box>
              {openPostcode && 
                <AddressPop handle={handle} onPostcode={onPostcode} closePostcode={closePostcode} />}
            </div>
            <FormErrorMessage>
              {errors.address && errors.address.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.role}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="role">
              담당업무
              </FormLabel>
              <Input
                id="role"
                className="lg"
                placeholder=""
                {...register("role")}
              />
            </div>
            <FormErrorMessage>
              {errors.role && errors.role.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.etc}>
            <div className="row_box">
              <FormLabel className="label" htmlFor="etc">
              비고
              </FormLabel>
              <Input
                id="etc"
                className="lg"
                placeholder=""
                {...register("etc")}
              />
            </div>
            <FormErrorMessage>
              {errors.etc && errors.etc.message}
            </FormErrorMessage>
          </FormControl>
          
          <Flex mt={4} width="100%" justifyContent="center">
            <Button
              width="150px"
              size="lg"
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              등록
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </BoardWrite>
  )
}
