import {
  FormErrorMessage,
  FormControl,
  Input,
  Select,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { db } from "src/firebase";
import { ref, update } from "firebase/database";
import { useDispatch } from "react-redux";
import { updateAllUser } from "@redux/actions/user_action";

import styled from "styled-components";
import PartSelect from "@component/popup/PartSelect";
import RankSelect from "@component/popup/RankSelect";

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
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    padding: 1rem;
    z-index: 10;
  }
`;

export default function UserModifyPop({ userData, closeUserModify }) {
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
        call: values.call || "",
        part: values.part || "",
        rank: values.rank || "",
        dayoff: values.dayoff || "",
      })
        .then(() => {
          dispatch(updateAllUser(values));
          closeUserModify();
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
                <PartSelect />
              </Select>
              <Select
                placeholder="직급"
                defaultValue={userData.rank}
                {...register("rank")}
              >
                <RankSelect />
              </Select>
              <FormControl isInvalid={errors.call}>
                <Input
                  type="number"
                  defaultValue={userData.call}
                  placeholder="전화번호"
                  {...register("call", {
                    pattern: /\d/i,
                  })}
                />
                <FormErrorMessage>
                  {errors.call && errors.call.type === "pattern" && (
                    <>{`전화번호는 숫자만 입력 할 수 있습니다.`}</>
                  )}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.dayoff}>
                <Input
                  type="number"
                  defaultValue={userData.dayoff}
                  placeholder="연차"
                  {...register("dayoff", {
                    pattern: /\d/i,
                  })}
                />
                <FormErrorMessage>
                  {errors.dayoff && errors.dayoff.type === "pattern" && (
                    <>{`연차 숫자만 입력 할 수 있습니다.`}</>
                  )}
                </FormErrorMessage>
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
