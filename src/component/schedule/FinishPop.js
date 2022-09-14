import React from "react";
import { Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { db } from "src/firebase";
import { ref, set, update, remove, query, orderByValue, equalTo } from "firebase/database";
import { CommonPopup } from "@component/insa/UserModifyPop";
import { DayOffList } from "@component/schedule/OffWrite";
import styled from "styled-components";
import shortid from "shortid";
import { format } from "date-fns";

const FinishPopup = styled(CommonPopup)`
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

export default function FinishPop({ listData, closePopup }) {
  function onSubmit() {
    return new Promise((resolve) => {
      
      let finishDate = format(listData.timestamp,"yyyyMM");
      update(ref(db, `dayoff/temp/${listData.uid}`), {...listData})
      .then(()=>{
        listData.list.forEach(el=>{
          let d = format(new Date(el.date),'yyyyMM')
          remove(query(ref(db, `dayoff/list/${d}`),orderByValue('uid'),equalTo(listData.uid)))
          .catch((error) => {
            console.error(error);
          });
        })
      })
      .then(()=>{
        remove(ref(db,`dayoff/finish/${finishDate}/${listData.uid}`))
      })
      .then(()=>{
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
    <>
    <FinishPopup>
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
            결재취소
          </Button>
        </DayOffList>
      </div>
      <div className="bg" onClick={closePopup}></div>
    </FinishPopup>
    </>
  );
}
