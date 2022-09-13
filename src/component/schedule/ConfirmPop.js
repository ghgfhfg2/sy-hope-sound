import React from 'react';
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
import {CommonPopup} from "@component/insa/UserModifyPop";

export default function ConfirmPop({listData,closePopup}) {

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    return new Promise((resolve) => {
      values.uid = listData.uid;
      update(ref(db, `user/${listData.uid}`), {
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
        <DayOffList>
          
        </DayOffList>
      </div>
      <div className="bg" onClick={closePopup}></div>
    </CommonPopup>
  )
}
