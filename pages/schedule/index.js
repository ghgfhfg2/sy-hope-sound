import React, { useState, useEffect } from "react";
import { db } from "src/firebase";
import {
  ref,
  off,
  set,
  update,
  remove,
  query,
  orderByValue,
  orderByChild,
  equalTo,
  runTransaction,
  onValue,
  orderByKey,
  startAt,
  endAt,
} from "firebase/database";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import {
  isSameMonth,
  isSameDay,
  addDays,
  parse,
  getDay,
  isSunday,
} from "date-fns";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import styled from "styled-components";
import { el } from "date-fns/locale";
import Loading from "../../src/component/Loading";
import { Flex } from "@chakra-ui/react";

export const ScheduleCalendar = styled.div`
  .header {
    height: 50px;
    margin-bottom: 20px;
    button {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
      padding: 0 15px;
      border-radius: 5px;
      border: 1px solid #2c7a7b;
      &:hover {
        background: #2c7a7b;
        color: #fff;
      }
    }
    .current_date {
      font-size: 18px;
      font-weight: 600;
    }
  }
  .row {
    display: flex;
    flex: 1;
  }
  .col {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .days {
    background: #2c7a7b;
    color: #fff;
    border-radius: 5px;
    font-size: 1rem;
    padding: 0.5rem;
    margin-bottom: 10px;
  }
  .body {
    .col {
      height: 110px;
      border: 1px solid #ededed;
      margin-left: -1px;
      margin-top: -1px;
      position: relative;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 15px;
      overflow: auto;
    }
    .disabled {
      background: #f1f1f1;
      color: #999;
    }
    .selected {
      border: 1px solid #38b2ac;
      z-index: 1;
    }
    .valid {
      &.sunday .num {
        color: #e53e3e;
      }
    }
    .valid:hover {
      background: #f9f9f9;
    }
    .dayoff_list {
      opacity: 0;
      display: flex;
      flex-wrap: wrap;
      animation: fadeIn 0.2s 0.1s forwards;
      li {
        padding: 5px;
        font-size: 11px;
        color: #fff;
        margin: 2px;
        border-radius: 3px;
      }
    }
  }
  .type_info {
    display: flex;
    margin-bottom: 15px;
    li {
      margin-right: 4px;
      width: 70px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      padding: 5px;
      border-radius: 4px;
    }
  }
  .all_off {
    background: #319795;
  }
  .am_off {
    background: #3182ce;
  }
  .pm_off {
    background: #dd6b20;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

export const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
  const prevM = format(subMonths(currentMonth, 1), "M");
  const nextM = format(addMonths(currentMonth, 1), "M");
  return (
    <div className="header row">
      <button type="button" onClick={prevMonth}>
        <MdArrowBackIos style={{ marginRight: "4px" }} />
        {prevM}월
      </button>
      <div className="col">
        <span className="current_date">
          {format(currentMonth, "yyyy")}년&nbsp;
          {format(currentMonth, "M")}월
        </span>
      </div>
      <button type="button" onClick={nextMonth}>
        {nextM}월<MdArrowForwardIos style={{ marginLeft: "4px" }} />
      </button>
    </div>
  );
};

const RenderDays = () => {
  const days = [];
  const date = ["일", "월", "화", "수", "목", "금", "토"];

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="col" key={i}>
        {date[i]}
      </div>
    );
  }

  return <div className="days row">{days}</div>;
};

const RenderCells = ({
  currentMonth,
  selectedDate,
  dayoffList,
  onDateClick,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;
      days.push(
        <div
          className={`col ani__fade_in custom__scroll_bar cell ${
            !isSameMonth(day, monthStart)
              ? "disabled"
              : isSameDay(day, selectedDate)
              ? "selected"
              : format(currentMonth, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          } ${isSunday(day) ? "sunday" : ""}
                    `}
          key={day}
          onClick={() => onDateClick(cloneDay)}
        >
          <span
            className={
              format(currentMonth, "M") !== format(day, "M")
                ? "text not-valid"
                : "num"
            }
          >
            {formattedDate}
            <ul className="dayoff_list">
              {dayoffList &&
                dayoffList[formattedDate] &&
                dayoffList[formattedDate].map((el) => {
                  if (isSameMonth(day, monthStart)) {
                    return (
                      <>
                        <li
                          className={
                            el.offType === "연차"
                              ? "all_off"
                              : el.offType === "오전반차"
                              ? "am_off"
                              : el.offType === "오후반차"
                              ? "pm_off"
                              : ""
                          }
                        >
                          {el.userName}
                        </li>
                      </>
                    );
                  }
                })}
            </ul>
          </span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="row" key={day}>
        {days}
      </div>
    );
    days = [];
  }
  return <div className="body">{rows}</div>;
};

function Schedule() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isMonthLoading, setIsMonthLoading] = useState(false);

  const [dayoffList, setDayoffList] = useState();
  useEffect(() => {
    const startDate = format(new Date(currentMonth), "yyyyMM") + "01";
    const endDate = format(new Date(currentMonth), "yyyyMM") + "31";
    const listRef = query(
      ref(db, `dayoff/list`),
      orderByKey(),
      startAt(startDate),
      endAt(endDate)
    );
    onValue(listRef, (data) => {
      if (!data.size) {
        setDayoffList();
      }
      let listObj = {};
      data.forEach((el) => {
        for (const key in el.val()) {
          let value = el.val()[key];
          value.month = value.date.split("-")[1];
          let date = value.date.split("-")[2];
          date = Number(date);

          listObj[date] = listObj[date] ? [...listObj[date], value] : [value];
        }
      });
      setDayoffList(listObj);
    });
    return () => {
      off(listRef);
    };
  }, [currentMonth]);

  const prevMonth = () => {
    setIsMonthLoading(true);
    setCurrentMonth(subMonths(currentMonth, 1));
    setTimeout(() => {
      setIsMonthLoading(false);
    }, 100);
  };
  const nextMonth = () => {
    setIsMonthLoading(true);
    setCurrentMonth(addMonths(currentMonth, 1));
    setTimeout(() => {
      setIsMonthLoading(false);
    }, 100);
  };
  const onDateClick = (day) => {
    return;
    setSelectedDate(day);
  };
  return (
    <ScheduleCalendar>
      <ul className="type_info">
        <li className="am_off">오전반차</li>
        <li className="pm_off">오후반차</li>
        <li className="all_off">연차</li>
      </ul>
      <RenderHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <RenderDays />
      {!isMonthLoading ? (
        <RenderCells
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          dayoffList={dayoffList}
          onDateClick={onDateClick}
        />
      ) : (
        <RenderCells
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onDateClick={onDateClick}
        />
      )}
    </ScheduleCalendar>
  );
}

export default Schedule;
