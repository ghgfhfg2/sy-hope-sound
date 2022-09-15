import React, { useState, useEffect } from 'react';
import { db } from "src/firebase";
import { ref, set, update, remove, query, orderByValue,orderByChild, equalTo, runTransaction, onValue, orderByKey, startAt, endAt } from "firebase/database";
import { format, addMonths, subMonths } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, parse, getDay, isSunday } from 'date-fns';
import styled from 'styled-components';

const ScheduleCalendar = styled.div`
  @import "scss-common.scss";
  @include flex($d: column, $a: stretch);
  .header{
    height:50px;
    margin-bottom:20px;
    button{
        padding:0 15px;border-radius:5px;
        border:1px solid #2C7A7B;
        transition: all 0.2s;
        &:hover{
          background:#2C7A7B;color:#fff;
        }
    }
    .current_date{font-size:18px;font-weight:600}
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
  .days{
    background:#2C7A7B;color:#fff;
    border-radius:5px;font-size:1.1rem;
    padding:0.5rem;
    margin-bottom:10px;
  }
  .body{
    .col{
      height:110px;
      border:1px solid #ededed;
      margin-left:-1px;margin-top:-1px;
      position:relative;
      justify-content:flex-start;
      align-items:flex-start;
      padding:15px;
    }
    .disabled{
      background:#f1f1f1;
      color:#999;
    }
    .selected{
      border:1px solid #38B2AC;
      z-index:1;
    }
    .valid{
      &.sunday .num{color:#E53E3E}
    }
    .valid:hover{
      background:#f9f9f9;
    }
  }
`


const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
    return (
        <div className="header row">
            <button type="button" onClick={prevMonth}>이전</button>
            <div className="col">
                <span className="current_date">
                    {format(currentMonth, 'yyyy')}년&nbsp;
                    {format(currentMonth, 'M')}월
                </span>
            </div>
            <button type="button" onClick={nextMonth}>다음</button>
        </div>
    );
};

const RenderDays = () => {
    const days = [];
    const date = ['일', '월', '화', '수', '목', '금', '토'];

    for (let i = 0; i < 7; i++) {
        days.push(
            <div className="col" key={i}>
                {date[i]}
            </div>,
        );
    }

    return <div className="days row">{days}</div>;
};

const RenderCells = ({ currentMonth, selectedDate, onDateClick }) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            const cloneDay = day;
            days.push(
                <div
                    className={`col cell ${
                        !isSameMonth(day, monthStart)
                            ? 'disabled'
                            : isSameDay(day, selectedDate)
                            ? 'selected'
                            : format(currentMonth, 'M') !== format(day, 'M')
                            ? 'not-valid'
                            : 'valid'
                          } ${isSunday(day) ? 'sunday' : ''}
                    `
                  }
                    key={day}
                    onClick={() => onDateClick(cloneDay)}
                >
                    <span
                        className={
                            format(currentMonth, 'M') !== format(day, 'M')
                                ? 'text not-valid'
                                : 'num'
                        }
                    >
                        {formattedDate}
                    </span>
                </div>,
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="row" key={day}>
                {days}
            </div>,
        );
        days = [];
    }
    return <div className="body">{rows}</div>;
};

function Schedule () {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const curMonth = format(new Date(currentMonth),"yyyyMM")
    const listRef = query(ref(db,`dayoff/finish`),orderByKey(),equalTo(curMonth))
    onValue(listRef,data=>{
      let listArr = [];
      data.forEach(el=>{
        console.log(el.val())
      })
    })
    return () => {
      
    }
  }, [currentMonth])
  

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const onDateClick = (day) => {
    console.log(day)
    console.log(getDay(day))
    return
    setSelectedDate(day);
  };
  return (
    <ScheduleCalendar>
      <RenderHeader
        currentMonth={currentMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <RenderDays />
      <RenderCells
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateClick={onDateClick}
      />
    </ScheduleCalendar>
  );
};

export default Schedule