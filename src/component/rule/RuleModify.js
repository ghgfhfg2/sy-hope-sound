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
  Select,
} from "@chakra-ui/react";
import { BsListCheck } from "react-icons/bs";
import SelectManagerPop from "@component/popup/SelectManagerPop";
import useGetUser from "@component/hooks/getUserDb";
import axios from "axios";
import { useEffect } from "react";
import Link from "next/link";
const Editor = dynamic(() => import("@component/board/Editor"), {
  ssr: false,
});

function RuleModify() {
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

  const [cateList, setCateList] = useState();
  useEffect(() => {
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_rule_category",
      })
      .then((res) => {
        setCateList(res.data.list);
      });
  }, []);

  const [initData, setInitData] = useState();
  useEffect(() => {
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_rule_view",
        uid: router.query.uid,
      })
      .then((res) => {
        if (res.data.rule.writer !== userInfo?.uid) {
          toast({
            description: "다른 작성자의 글은 수정 할 수 없습니다.",
            status: "error",
            duration: 1000,
            isClosable: false,
          });
          router.push("/rule");
        }
        setInitData(res.data.rule);
      });
  }, []);

  const submitRule = (values) => {
    values.title = values.title || initData.title;
    values.content = values.content || initData.content;
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "update_rule_list",
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
        router.push("/rule");
      });
  };

  const [editorState, setEditorState] = useState();

  const handleEditor = (value) => {
    setEditorState(value);
  };

  const onSubmit = async (values) => {
    values = {
      ...values,
      manager: userInfo.manager_uid,
      writer: userInfo.uid,
      content: editorState,
    };

    submitRule(values);
  };
  return (
    <>
      <CommonForm onSubmit={handleSubmit(onSubmit)}>
        <Flex marginTop={5}>
          <Flex width="100%" flexDirection="column" alignItems="center" gap={2}>
            <FormControl className="row_section" isInvalid={errors.title}>
              <div className="row_box">
                <FormLabel className="label">제목</FormLabel>
                <Input defaultValue={initData?.title} {...register("title")} />
              </div>
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl className="row_section" isInvalid={errors.category}>
              <div className="row_box">
                <FormLabel className="label">카테고리</FormLabel>
                {initData && initData.category && (
                  <Select
                    defaultValue={initData.category}
                    width={200}
                    {...register("category", {
                      required: "카테고리는 필수항목 입니다.",
                    })}
                  >
                    <option value="">카테고리 선택</option>
                    {cateList?.map((el) => (
                      <>
                        <option value={el.title}>{el.title}</option>
                      </>
                    ))}
                  </Select>
                )}
              </div>
              <FormErrorMessage>
                {errors.category && errors.category.message}
              </FormErrorMessage>
            </FormControl>
            {initData && (
              <Editor
                initTypeCon={initData.content}
                handleEditor={handleEditor}
              />
            )}

            {/* submit */}
            <Flex mt={4} gap={2} justifyContent="center">
              <Link href="/rule">
                <Button width={120}>목록</Button>
              </Link>
              <Button
                mb={2}
                width={120}
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
    </>
  );
}

export default RuleModify;
