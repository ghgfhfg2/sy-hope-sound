import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@redux/actions/user_action";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  FormErrorMessage,
  FormControl,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react";
import LoginLayout from "@component/LoginLayout";
import Link from "next/link";
import { app, db } from "../../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = getAuth();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  function onSubmit(values) {
    
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch(setUser(user));
        // ...
      })
      .then((res) => router.push("/"))
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex justifyContent="center" marginTop={10}>
          <Flex
            maxWidth={400}
            width="100%"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <FormControl isInvalid={errors.email}>
              <Input
                id="email"
                placeholder="이메일"
                {...register("email", {
                  required: "이메일은 필수항목 입니다.",
                  pattern: /^\S+@\S+$/i,
                })}
              />
              <FormErrorMessage>
                {errors.email &&
                  errors.email.type === "required" &&
                  errors.email.message}
                {errors.email && errors.email.type === "pattern" && (
                  <>이메일 형식이 맞지 않습니다.</>
                )}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호"
                {...register("password", {
                  required: true,
                  minLength: 4,
                  maxLength: 16,
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.type === "required" && (
                  <>비밀번호를 입력해 주세요</>
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
                로그인
                {isSubmitting}
              </Button>
              <Link href="/join">
                <a style={{ alignSelf: "flex-end" }}>회원가입</a>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </>
  );
}

export default Login;

Login.getLayout = function getLayout(page) {
  return <LoginLayout>{page}</LoginLayout>;
};
