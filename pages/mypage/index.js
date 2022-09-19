import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  useToast,
} from "@chakra-ui/react";
import useGetUser from "@component/hooks/getUserDb";

import styled from "styled-components";
import { db } from "src/firebase";
import { ref, update } from "firebase/database";
import { CommonForm } from "pages/insa/setting";

export default function Mypage() {
  const toast = useToast();
  const userInfo = useSelector((state) => state.user.currentUser);
  const getUserInfo = useGetUser();
  const partList = getUserInfo[1]?.partList;
  const rankList = getUserInfo[1]?.rankList;

  const [userData, setUserData] = useState();
  useEffect(() => {
    if (partList && rankList && userInfo) {
      let user = {
        ...userInfo,
        part: userInfo.part ? partList[userInfo.part] : "",
        rank: userInfo.rank ? rankList[userInfo.rank] : "",
      };
      setUserData(user);
    }
  }, [userInfo, partList, rankList]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (values) => {
    update(ref(db, `user/${userInfo.uid}`), {
      ...values,
    }).then(() => {
      toast({
        position: "top",
        title: "업데이트 되었습니다.",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    });
  };

  return (
    <>
      {userData && (
        <CommonForm onSubmit={handleSubmit(onSubmit)}>
          <Flex marginTop={5}>
            <Flex
              width="100%"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <FormControl className="row_section">
                <div className="row_box">
                  <FormLabel className="label">이름</FormLabel>
                  <Input
                    id="name"
                    defaultValue={userData.name}
                    readOnly
                    className="xs read_only"
                  />
                </div>
              </FormControl>
              <FormControl className="row_section">
                <div className="row_box">
                  <FormLabel className="label">이메일</FormLabel>
                  <Input
                    id="name"
                    defaultValue={userData.email}
                    readOnly
                    className="sm read_only"
                  />
                </div>
              </FormControl>
              <FormControl className="row_section">
                <div className="row_box">
                  <FormLabel className="label">부서</FormLabel>
                  <Input
                    id="part"
                    defaultValue={userData.part}
                    readOnly
                    className="read_only sm"
                  />
                </div>
              </FormControl>

              <FormControl isInvalid={errors.call} className="row_section">
                <div className="row_box">
                  <FormLabel className="label" htmlFor="call">
                    전화번호
                  </FormLabel>
                  <Input
                    id="call"
                    type="number"
                    defaultValue={userData.call}
                    className="input xs"
                    {...register("call")}
                  />
                </div>
              </FormControl>
              {/* submit */}
              <Flex
                width="150px"
                mt={4}
                flexDirection="column"
                justifyContent="center"
              >
                <Button
                  mb={2}
                  width="100%"
                  size="lg"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  저장
                  {isSubmitting}
                </Button>
              </Flex>
              {/* submit */}
            </Flex>
          </Flex>
        </CommonForm>
      )}
    </>
  );
}
