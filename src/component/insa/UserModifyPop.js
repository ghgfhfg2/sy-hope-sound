import {
  FormErrorMessage,
  FormControl,
  Input,
  Select,
  Button,
  Flex,
  Checkbox,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { db } from "src/firebase";
import { ref, update } from "firebase/database";
import { useDispatch } from "react-redux";
import { updateAllUser } from "@redux/actions/user_action";

import styled from "styled-components";
import PartSelect from "@component/popup/PartSelect";
import RankSelect from "@component/popup/RankSelect";
import ManagerSelect from "@component/popup/ManagerSelect";

export const CommonPopup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  animation: fadeIn 0.2s forwards;
  opacity: 0;
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.25);
  }
  .con_box {
    h2.title {
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 10px;
    }
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    padding: 1rem;
    transform: translateY(30px);
    z-index: 10;
    animation: fadeUp 0.2s forwards;
  }
  @keyframes fadeUp {
    to {
      transform: translateY(0);
    }
  }
`;

export default function UserModifyPop({
  managerList,
  userData,
  closeUserModify,
  partList,
  rankList,
  onRender,
}) {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    return new Promise((resolve) => {
      values.uid = userData.uid;
      update(ref(db, `user/${userData.uid}`), {
        ...values,
        call: values.call || "",
        call2: values.call2 || "",
        part: values.part || "",
        rank: values.rank || "",
        dayoff: Number(values.dayoff) || "",
        manager_uid: values.manager_uid || "",
        date: values.date || "",
      })
        .then(() => {
          values.part = values.part ? partList[values.part] : "";
          values.rank = values.rank ? rankList[values.rank] : "";
          dispatch(updateAllUser(values));
          closeUserModify();
          onRender();
          resolve();
        })
        .catch((error) => {
          console.error(error);
          resolve();
        });
    });
  }

  return (
    <CommonPopup>
      <div className="con_box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex justifyContent="center" marginTop={3}>
            <Flex
              maxWidth={400}
              width="100%"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Input
                readOnly
                defaultValue={userData.name}
                {...register("name")}
              />
              <Input
                readOnly
                defaultValue={userData.email}
                {...register("email")}
              />
              <Select
                placeholder="부서"
                defaultValue={userData.part}
                {...register("part")}
              >
                <PartSelect partList={partList} />
              </Select>
              <Select
                placeholder="직급"
                defaultValue={userData.rank}
                {...register("rank")}
              >
                <RankSelect rankList={rankList} />
              </Select>
              <Select
                placeholder="담당자"
                defaultValue={userData.manager_uid}
                {...register("manager_uid")}
              >
                <ManagerSelect managerList={managerList} />
              </Select>
              <FormControl isInvalid={errors.call}>
                <Input
                  type="number"
                  defaultValue={userData.call}
                  placeholder="전화번호"
                  {...register("call", {
                    pattern: /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/,
                  })}
                />
                <FormErrorMessage>
                  {errors.call && errors.call.type === "pattern" && (
                    <>{`휴대폰번호 양식에 맞지 않습니다.`}</>
                  )}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <Input
                  type="number"
                  defaultValue={userData.call2}
                  placeholder="전화번호2"
                  {...register("call2")}
                />
              </FormControl>

              <FormControl isInvalid={errors.date}>
                <Input
                  type="date"
                  defaultValue={userData.date.split(" ")[0]}
                  placeholder="입사일"
                  {...register("date")}
                />
              </FormControl>
              <FormControl mt={1} isInvalid={errors.date}>
                <Stack spacing={4} pl={1} direction="row">
                  <Checkbox colorScheme="teal" {...register("hidden")}>
                    <Text fontSize="sm">숨김처리</Text>
                  </Checkbox>
                </Stack>
              </FormControl>
              <Flex
                mt={4}
                width="100%"
                flexDirection="column"
                justifyContent="center"
              >
                <Button
                  mb={2}
                  width="100%"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  수정
                  {isSubmitting}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </form>
      </div>
      <div className="bg" onClick={closeUserModify}></div>
    </CommonPopup>
  );
}
