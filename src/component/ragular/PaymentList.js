import { useEffect, useState } from "react";
import { BoardLi } from "@component/BoardList";
import { useSelector } from "react-redux";
import { db } from "src/firebase";
import {
  ref,
  onValue,
  remove,
  get,
  off,
  update,
  query,
  startAt,
  endAt,
  orderByKey,
  equalTo,
  orderByChild,
} from "firebase/database";
import shortid from "shortid";
import { format } from "date-fns";
import styled from "styled-components";
import None from "@component/None";
import Link from "next/link";
import { Button, Flex, Input } from "@chakra-ui/react";
import { comma } from "../CommonFunc";
import PaymentRegistPop from "./PaymentRegistPop";

const PaymentLi = styled(BoardLi)`
  li {
    .name {
      max-width: 120px;
      flex: 1;
    }
    .subject {
      flex: 1;
    }
    .date {
      max-width: 120px;
      flex: 1;
    }
    .type{width:150px}
  }
  .body {
    .subject {
      justify-content: flex-start;
      padding: 0 1rem;
    }
    .income{color:#C53030;font-weight:600}
    .spend{color:#2B6CB0;font-weight:600}
  }
`;

export default function PaymentList() {

  const [boardList, setBoardList] = useState([]);

  useEffect(() => {
    const pRef = ref(db,`regular/list`)
    onValue(pRef,data=>{
      let arr = [];
      const list = data.val();
      for(const key in list){
        arr.push(list[key])
      }
      setBoardList(arr)
    })
  
    return () => {
      off(pRef)
    }
  }, [])
  


  const [isPaymentPop, setIsPaymentPop] = useState(false);
  const onPaymentPop = () => {
    setIsPaymentPop(true)
  }
  const closePaymentPop = () => {
    setIsPaymentPop(false)
  }

  return (
    <>
    <PaymentLi>
      <li className="header">
        <span className="subject">제목</span>
        <span className="income">소득</span>
        <span className="spend">지출</span>
        <span className="date">결재일</span>
      </li>
      {boardList &&
        boardList.map((el) => (
          <li className="body" key={shortid()}>
            <span className="subject">{el.subject}</span>
            <span className="income">{comma(el.income)}</span>
            <span className="spend">{comma(el.spend)}</span>
            <span className="date">{el?.date}</span>
          </li>
        ))}
      {boardList?.length === 0 && <None />}
    </PaymentLi>
    <Flex mt={5} justifyContent="flex-end">
      <Button colorScheme="teal" onClick={onPaymentPop}>등록</Button>
    </Flex>
    {isPaymentPop &&
      <PaymentRegistPop closePop={closePaymentPop} />
    }
    </>
  )
}
