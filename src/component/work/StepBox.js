import React from "react";
import styled from "styled-components";
import { AiOutlineDoubleRight } from "react-icons/ai";
const StepComponent = styled.ul`
  display: flex;
  gap: 15px;
  li {
    color: #bbb;
    border-radius: 5px;
    display: flex;
    align-items: center;
    &.state {
      color: #fff;
      background: #ddd;
      padding: 5px 10px;
    }
    &.on {
      color: #fff;
      background: #234e52;
      font-weight: 600;
    }
  }
`;

export default function StepBox({ step }) {
  return (
    <StepComponent>
      <li className={step == 1 ? "on state" : "state"}>대기</li>
      <li>
        <AiOutlineDoubleRight />
      </li>
      <li className={step == 2 ? "on state" : "state"}>접수</li>
      <li>
        <AiOutlineDoubleRight />
      </li>
      <li className={step == 3 ? "on state" : "state"}>진행</li>
      <li>
        <AiOutlineDoubleRight />
      </li>
      <li className={step == 4 ? "on state" : "state"}>테스트</li>
      <li>
        <AiOutlineDoubleRight />
      </li>
      <li className={step == 5 ? "on state" : "state"}>완료</li>
    </StepComponent>
  );
}
