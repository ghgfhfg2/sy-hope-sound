import React from "react";
import { Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { db } from "src/firebase";
import { CommonPopup } from "@component/insa/UserModifyPop";
import { DayOffList } from "@component/schedule/OffWrite";
import styled from "styled-components";

const ConfirmPopup = styled(CommonPopup)`
  .con_box {
    width: 100%;
    max-width: 500px;
  }
  span.day {
    margin-left: auto;
  }
  h2 {
    font-size: 1.4rem;
    text-align: center;
    font-weight: 600;
  }
  .name {
    text-align: right;
  }
`;

export default function ConfirmPop({ listData, closePopup }) {
  function onSubmit() {
    return new Promise((resolve) => {
      console.log(listData);
      resolve();
      return;
      set(ref(db, `dayoff/`), {})
        .then(() => {
          closePopup();
          resolve();
        })
        .catch((error) => {
          console.error(error);
          resolve();
        });
    });
  }

  return (
    <ConfirmPopup>
      <div className="con_box">
        <h2>{listData.subject}</h2>
        <div className="name">{listData.userName}</div>
        <DayOffList>
          <li className="header">
            <span className="type">유형</span>
            <span className="date">날짜</span>
            <span className="day">일수</span>
          </li>
          {listData &&
            listData.list.map((el) => (
              <>
                <li>
                  <span className="type">{el.offType}</span>
                  <span className="date">{el.date}</span>
                  <span className="day">{el.day}</span>
                </li>
              </>
            ))}
          <Button onClick={onSubmit} colorScheme="teal" mt="5">
            결재
          </Button>
        </DayOffList>
      </div>
      <div className="bg" onClick={closePopup}></div>
    </ConfirmPopup>
  );
}
