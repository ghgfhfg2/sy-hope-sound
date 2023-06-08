import { useState, useEffect } from "react";
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

function WorkModify() {
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

  const [viewData, setViewData] = useState();
  useEffect(() => {
    const uid = router.query.uid;
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_work_view",
        uid,
      })
      .then((res) => {
        console.log(res.data.work);
        const writer = userAll?.find(
          (user) => res.data.work.writer === user.uid
        );
        const managerArr = JSON.parse(res.data.work.manager);
        const manager = [];
        setViewData({
          ...writer,
          ...res.data.work,
          manager: managerArr,
        });
      });
  }, []);

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
  const [typeRadio, setTypeRadio] = useState(viewData?.type);

  const submitWork = (values) => {
    values.content = values.content || viewData.content;
    values.type = typeRadio || viewData.type;
    values.title = values.title || viewData.title;
    values.manager = values.manager || viewData.manager;

    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "update_work_list",
        uid: router.query.uid,
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
    if (!values.title) {
      toast({
        description: "제목은 필수 사항 입니다.",
        status: "error",
        duration: 1000,
        isClosable: false,
      });
      return;
    }
    if (!typeRadio && !viewData.type) {
      toast({
        description: "유형을 지정해 주세요.",
        status: "error",
        duration: 1000,
        isClosable: false,
      });
      return;
    }
    if (!selectUser && !viewData.manager) {
      toast({
        description: "담당자를 지정해 주세요.",
        status: "error",
        duration: 1000,
        isClosable: false,
      });
      return;
    }

    values.content = values.content || viewData.content;
    values.type = typeRadio || viewData.type;
    values.title = values.title || viewData.title;
    values.manager = selectUser || viewData.manager;

    values = {
      ...values,
      manager: JSON.stringify(values.manager),
      writer: userInfo.uid,
    };

    submitWork(values);
  };
  return (
    <>
      {viewData && (
        <CommonForm onSubmit={handleSubmit(onSubmit)}>
          <Flex marginTop={5}>
            <Flex
              width="100%"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <FormControl className="row_section" isInvalid={errors.title}>
                <div className="row_box">
                  <FormLabel className="label">제목</FormLabel>
                  <Input
                    defaultValue={viewData?.title}
                    {...register("title")}
                  />
                </div>
                <FormErrorMessage>
                  {errors.title && errors.title.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl className="row_section">
                <div className="row_box">
                  <FormLabel className="label">유형</FormLabel>
                  <RadioGroup
                    onChange={setTypeRadio}
                    value={typeRadio || viewData.type}
                  >
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
                              <>
                                <li>
                                  {el.name}
                                  {el.rank && `(${el.rank})`}
                                  {el.part && `- ${el.part}`}
                                </li>
                              </>
                            );
                          } else if (viewData.manager.includes(el.uid)) {
                            return (
                              <>
                                <li>
                                  {el.name}
                                  {el.rank && `(${el.rank})`}
                                  {el.part && `- ${el.part}`}
                                </li>
                              </>
                            );
                          }
                        })}
                    </ul>
                  </Box>
                </div>
              </FormControl>
              {viewData && (
                <Editor
                  initTypeCon={viewData.content}
                  handleEditor={handleEditor}
                />
              )}

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

      {isManagerPop && userAll && (
        <SelectManagerPop
          userData={userAll}
          closeManagerPop={closeManagerPop}
          onSelectManager={onSelectManager}
          selectUser={selectUser || viewData.manager}
          isManagerPop={isManagerPop}
        />
      )}
    </>
  );
}

export default WorkModify;
