import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { CommonForm } from "pages/setting";
import { useForm } from "react-hook-form";
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Button,
  Input,
  Box,
  RadioGroup,
  Radio,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { BsListCheck } from "react-icons/bs";
import SelectManagerPop from "@component/popup/SelectManagerPop";
import useGetUser from "@component/hooks/getUserDb";
import axios from "axios";
const Editor = dynamic(() => import("@component/board/Editor"), {
  ssr: false,
});

function WorkRegist() {
  const router = useRouter();
  useGetUser();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const userAll = useSelector((state) => state.user.allUser);
  const userInfo = useSelector((state) => state.user.currentUser);
  const [isManagerPop, setIsManagerPop] = useState(false);

  const onManagerPop = () => {
    setIsManagerPop(true);
  };
  const closeManagerPop = () => {
    setIsManagerPop(false);
  };

  const [selectUser, setSelectUser] = useState();
  const onSelectManager = (checkedItems) => {
    setSelectUser(checkedItems);
    closeManagerPop();
  };

  //유형
  const [typeRadio, setTypeRadio] = useState();

  const submitWork = (values) => {
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "regis_work_list",
        ...values,
      })
      .then((res) => {
        toast({
          description: "저장되었습니다.",
          status: "success",
          duration: 1000,
          isClosable: false,
        });
        router.push("/work");
      });
  };

  const [editorState, setEditorState] = useState();

  const handleEditor = (value) => {
    setEditorState(value);
  };

  const onSubmit = async (values) => {
    console.log(editorState);
    if (!typeRadio) {
      toast({
        description: "유형을 지정해 주세요.",
        status: "error",
        duration: 1000,
        isClosable: false,
      });
      return;
    }
    if (!selectUser) {
      toast({
        description: "담당자를 지정해 주세요.",
        status: "error",
        duration: 1000,
        isClosable: false,
      });
      return;
    }
    values = {
      ...values,
      type: typeRadio,
      manager: JSON.stringify(selectUser),
      writer: userInfo.uid,
      content: editorState,
    };

    submitWork(values);
  };
  return (
    <>
      <CommonForm onSubmit={handleSubmit(onSubmit)}>
        <Flex marginTop={5}>
          <Flex width="100%" flexDirection="column" alignItems="center" gap={2}>
            <FormControl className="row_section" isInvalid={errors.title}>
              <div className="row_box">
                <FormLabel className="label">제목</FormLabel>
                <Input
                  {...register("title", {
                    required: "제목 필수항목 입니다.",
                  })}
                />
              </div>
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl className="row_section">
              <div className="row_box">
                <FormLabel className="label">유형</FormLabel>
                <RadioGroup onChange={setTypeRadio} value={typeRadio}>
                  <Stack direction="row">
                    <Radio value="1">프로젝트</Radio>
                    <Radio value="2">기능개발</Radio>
                    <Radio value="3">오류수정</Radio>
                  </Stack>
                </RadioGroup>
              </div>
            </FormControl>
            <FormControl isInvalid={errors.manager} className="row_section">
              <div className="row_box">
                <FormLabel className="label" htmlFor="manager">
                  담당자
                </FormLabel>
                <Box size="lg">
                  <Button onClick={onManagerPop} colorScheme="teal">
                    편집
                    <BsListCheck style={{ marginLeft: "5px" }} />
                  </Button>
                  <ul className="manager_list">
                    {userAll &&
                      userAll.map((el) => {
                        if (selectUser?.includes(el.uid)) {
                          return (
                            <li>
                              {el.name}
                              {el.rank && `(${el.rank})`}
                              {el.part && `- ${el.part}`}
                            </li>
                          );
                        }
                      })}
                  </ul>
                </Box>
              </div>
            </FormControl>

            <Editor initTypeCon=" " handleEditor={handleEditor} />

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

      {isManagerPop && userAll && (
        <SelectManagerPop
          userData={userAll}
          closeManagerPop={closeManagerPop}
          onSelectManager={onSelectManager}
          selectUser={selectUser}
          isManagerPop={isManagerPop}
        />
      )}
    </>
  );
}

export default WorkRegist;
