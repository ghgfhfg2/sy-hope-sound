import React from "react";
import { Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateDayoffCount } from "@redux/actions/counter_action";
import { db } from "src/firebase";
import { ref, set, update, remove, runTransaction } from "firebase/database";
import { CommonPopup } from "@component/insa/UserModifyPop";
import { DayOffList } from "@component/schedule/OffWrite";
import styled from "styled-components";
import shortid from "shortid";
import { format } from "date-fns";

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
  const dispatch = useDispatch();
  function onSubmit() {
    return new Promise((resolve) => {
      let finishDate = format(listData.timestamp, "yyyyMM");
      runTransaction(
        ref(db, `user/${listData.userUid.trim()}/dayoff`),
        (pre) => {
          let newDay = pre ? pre - listData.daySum : -1;
          if (newDay < 0) {
            window.alert("휴가가 부족합니다.");
            return;
          } else {
            return String(newDay);
          }
        }
      ).then((res) => {
        if (res.committed) {
          update(ref(db, `dayoff/finish/${finishDate}/${listData.uid}`), {
            ...listData,
          })
            .then(() => {
              listData.list.forEach((el) => {
                let d = el.date.split("-").join("");
                update(ref(db, `dayoff/list/${d}/${shortid.generate()}`), {
                  ...el,
                  uid: listData.uid,
                  userName: listData.userName,
                  userUid: listData.userUid,
                  manager: listData.manager,
                  reason: listData.reason,
                  subject: listData.subject,
                }).catch((error) => {
                  console.error(error);
                });
              });
            })
            .then(() => {
              remove(ref(db, `dayoff/temp/${listData.uid}`));
            })
            .then(() => {
              dispatch(updateDayoffCount(true));
              closePopup();
              resolve();
            })
            .catch((error) => {
              console.error(error);
              resolve();
            });
        }
      });
    });
  }

  return (
    <>
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
    </>
  );
}
