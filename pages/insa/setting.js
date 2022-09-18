import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  HStack,
  Box,
  FormLabel,
  FormErrorMessage,
  FormControl,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react";
import useGetUser from "@component/hook/getUserDb";
import {
  AiOutlineCheck,
  AiOutlineDelete,
  AiOutlineEnter,
} from "react-icons/ai";
import { HiOutlinePlus } from "react-icons/hi";
import { BsPencilSquare } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import AlertBox from "@component/popup/Alert";
import AdminSelectPop from "@component/insa/AdminSelectPop";
import ManagerSelectPop from "@component/insa/ManagerSelectPop";
import styled from "styled-components";
import shortid from "shortid";
import { db } from "src/firebase";
import {
  ref,
  set,
  onValue,
  off,
  query,
  update,
  orderByChild,
  equalTo,
  orderByValue,
  startAt,
} from "firebase/database";

export const CommonForm = styled.form`
  .row_section {
    margin-bottom: 1rem;
    border-bottom: 1px solid #eee;
    padding: 0 1rem 1rem 1rem;
  }
  .row_box {
    display: flex;
    align-items: center;
    .label {
      width: 100px;
      margin: 0;
      flex-shrink: 0;
    }
    .xs {
      width: 12.5%;
    }
    .sm {
      width: 25%;
    }
    .md {
      width: 50%;
    }
    .lg {
      width: 100%;
    }
    .read_only {
      background: #f1f1f1;
    }
  }
  .manager_list {
    li {
      margin-top: 10px;
    }
  }
  .part_list {
    display: flex;
    margin: 10px 0;
    flex-wrap: wrap;
    li {
      padding: 7px 12px;
      border: 1px solid #2c7a7b;
      border-radius: 4px;
      margin-right: 5px;
      margin-bottom: 5px;
      position: relative;
      button {
        margin-left: 5px;
      }
      .modify_box {
        position: absolute;
        left: 1px;
        top: 1px;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        padding: 0 10px;
        display: flex;
        align-items: center;
        background: #fff;
        input {
          border: 0;
          flex: 1;
          height: 100%;
          width: 100%;
        }
      }
    }
  }
`;

export default function Setting() {
  useGetUser();
  const userAll = useSelector((state) => state.user.allUser);
  const router = useRouter();
  const [isAdminPop, setIsAdminPop] = useState(false);
  const [isManagerPop, setIsManagerPop] = useState(false);
  const {
    getValues,
    setValue,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [alertMessage, setAlertMessage] = useState("");
  const [alertState, setAlertState] = useState(false);

  const [partList, setPartList] = useState([]);
  const [rankList, setRankList] = useState([]);

  const [settingState, setSettingState] = useState();
  useEffect(() => {
    const adminRef = ref(db, `admin/setting`);
    onValue(adminRef, (data) => {
      setSettingState(data.val());
      setPartList(data.val().part);
      setRankList(data.val().rank);
    });
    return () => {
      off(adminRef);
    };
  }, []);

  const onAdminPop = () => {
    setIsAdminPop(true);
  };
  const closeAdminPop = () => {
    setIsAdminPop(false);
  };
  const onSelectUser = (uid, name, rank) => {
    setValue("admin", `${name}(${rank})-${uid}`);
    closeAdminPop();
  };

  const onManagerPop = () => {
    setIsManagerPop(true);
  };
  const closeManagerPop = () => {
    setIsManagerPop(false);
  };
  const onSelectManager = (checkedItems) => {
    userAll.forEach((el) => {
      let userRef = ref(db, `user/${el.uid}`);
      if (checkedItems.includes(el.uid)) {
        update(userRef, {
          manager: 1,
        });
      } else {
        update(userRef, {
          manager: 0,
        });
      }
    });
    closeManagerPop();
  };

  const onAddPart = (type, sort) => {
    const val = getValues(sort);
    if (val.length === 0) {
      return;
    }
    if (type === "part") {
      let newArr = [...partList];
      let obj = {
        uid: shortid.generate(),
        name: val,
        state: 1,
      };
      newArr.push(obj);
      setPartList(newArr);
    }
    if (type === "rank") {
      let newArr = [...rankList];
      let obj = {
        uid: shortid.generate(),
        name: val,
        state: 1,
      };
      newArr.push(obj);
      setRankList(newArr);
    }
    setValue(sort, "");
  };
  const onRemovePart = (type, uid, name) => {
    let agree = confirm(`${name}을(를) 삭제하시겠습니까?`);
    if (agree) {
      if (type === "part") {
        let newArr = [...partList];
        newArr = newArr.filter((el) => el.uid !== uid);
        setPartList(newArr);
      }
      if (type === "rank") {
        let newArr = [...rankList];
        newArr = newArr.filter((el) => el.uid !== uid);
        setRankList(newArr);
      }
    }
  };

  //부서 수정열기
  const onModifyPart = (type, uid) => {
    if (type === "part") {
      let newArr = [...partList];
      newArr = newArr.map((el) => {
        if (el.uid === uid) {
          el.state = 2;
        }
        return el;
      });
      setPartList(newArr);
    }
    if (type === "rank") {
      let newArr = [...rankList];
      newArr = newArr.map((el) => {
        if (el.uid === uid) {
          el.state = 2;
        }
        return el;
      });
      setRankList(newArr);
    }
    setTimeout(() => {
      document.getElementById(uid).focus();
    }, 100);
  };

  //부서 수정완료
  const onModiPartSubmit = (type, uid) => {
    if (type === "part") {
      let newArr = [...partList];
      newArr = newArr.map((el) => {
        if (el.uid === uid) {
          (el.state = 1), (el.name = document.getElementById(uid).value);
        }
        return el;
      });
      setPartList(newArr);
    }
    if (type === "rank") {
      let newArr = [...rankList];
      newArr = newArr.map((el) => {
        if (el.uid === uid) {
          (el.state = 1), (el.name = document.getElementById(uid).value);
        }
        return el;
      });
      setRankList(newArr);
    }
  };

  const onSubmit = (values) => {
    let newValues;
    return new Promise((resolve) => {
      newValues = {
        admin: values.admin,
        part: partList,
        rank: rankList,
      };
      const setRef = ref(db, `admin/setting`);
      set(setRef, {
        ...newValues,
      })
        .then(() => {
          console.log("set");
        })
        .catch((error) => console.error(error));
      resolve();
    });
  };

  return (
    <>
      {alertState && <AlertBox text={alertMessage} />}
      {settingState && (
        <CommonForm onSubmit={handleSubmit(onSubmit)}>
          <Flex marginTop={5}>
            <Flex
              width="100%"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <FormControl isInvalid={errors.admin} className="row_section">
                <div className="row_box">
                  <FormLabel className="label" htmlFor="admin">
                    관리자
                  </FormLabel>
                  <Input
                    id="admin"
                    readOnly
                    className="input sm"
                    placeholder="기본 관리자"
                    defaultValue={settingState.admin}
                    {...register("admin")}
                  />
                  <Button onClick={onAdminPop} colorScheme="teal" ml={2}>
                    찾기
                    <FiSearch style={{ marginLeft: "5px" }} />
                  </Button>
                </div>
              </FormControl>
              <FormControl isInvalid={errors.manager} className="row_section">
                <div className="row_box">
                  <FormLabel className="label" htmlFor="manager">
                    담당자
                  </FormLabel>
                  <Box size="lg">
                    <Button onClick={onManagerPop} colorScheme="teal">
                      찾기
                      <FiSearch style={{ marginLeft: "5px" }} />
                    </Button>
                    <ul className="manager_list">
                      {userAll &&
                        userAll.map((el) => {
                          if (el.manager === 1) {
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
              <FormControl isInvalid={errors.part} className="row_section">
                <div className="row_box">
                  <FormLabel className="label" htmlFor="part">
                    부서
                  </FormLabel>
                  <Box className="lg">
                    <finish
                      id="part"
                      placeholder="추가할 부서명"
                      className="input xs"
                      {...register("part")}
                    />
                    <Button
                      onClick={() => onAddPart("part", "part")}
                      colorScheme="teal"
                      ml={2}
                    >
                      <HiOutlinePlus fontSize="1.1rem" />
                    </Button>
                    {partList.length > 0 && (
                      <ul className="part_list">
                        {partList.map((el) => (
                          <li key={el.uid}>
                            {el.name}
                            {el.state === 2 && (
                              <>
                                <div className="modify_box">
                                  <input
                                    type="text"
                                    id={el.uid}
                                    defaultValue={el.name}
                                  ></input>
                                  <button
                                    onClick={() =>
                                      onModiPartSubmit("part", el.uid)
                                    }
                                    type="button"
                                  >
                                    <AiOutlineEnter />
                                  </button>
                                </div>
                              </>
                            )}
                            <button
                              onClick={() => {
                                onModifyPart("part", el.uid);
                              }}
                              type="button"
                            >
                              <BsPencilSquare />
                            </button>
                            <button
                              onClick={() => {
                                onRemovePart("part", el.uid, el.name);
                              }}
                              type="button"
                            >
                              <AiOutlineDelete />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Box>
                </div>
              </FormControl>
              <FormControl isInvalid={errors.rank} className="row_section">
                <div className="row_box">
                  <FormLabel className="label" htmlFor="rank">
                    직급
                  </FormLabel>
                  <Box className="lg">
                    <Input
                      id="rank"
                      placeholder="추가할 직급명"
                      className="input xs"
                      {...register("rank")}
                    />
                    <Button
                      onClick={() => onAddPart("rank", "rank")}
                      colorScheme="teal"
                      ml={2}
                    >
                      <HiOutlinePlus fontSize="1.1rem" />
                    </Button>
                    {rankList.length > 0 && (
                      <ul className="part_list">
                        {rankList.map((el) => (
                          <li key={el.uid}>
                            {el.name}
                            {el.state === 2 && (
                              <>
                                <div className="modify_box">
                                  <input
                                    type="text"
                                    id={el.uid}
                                    defaultValue={el.name}
                                  ></input>
                                  <button
                                    onClick={() =>
                                      onModiPartSubmit("rank", el.uid)
                                    }
                                    type="button"
                                  >
                                    <AiOutlineEnter />
                                  </button>
                                </div>
                              </>
                            )}
                            <button
                              onClick={() => {
                                onModifyPart("rank", el.uid);
                              }}
                              type="button"
                            >
                              <BsPencilSquare />
                            </button>
                            <button
                              onClick={() => {
                                onRemovePart("rank", el.uid, el.name);
                              }}
                              type="button"
                            >
                              <AiOutlineDelete />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Box>
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
      {isAdminPop && userAll && (
        <AdminSelectPop
          userData={userAll}
          closeAdminPop={closeAdminPop}
          onSelectUser={onSelectUser}
        />
      )}
      {isManagerPop && userAll && (
        <ManagerSelectPop
          userData={userAll}
          closeManagerPop={closeManagerPop}
          onSelectManager={onSelectManager}
          isManagerPop={isManagerPop}
        />
      )}
    </>
  );
}