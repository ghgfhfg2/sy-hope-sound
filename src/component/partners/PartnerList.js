import { useEffect, useState } from "react";
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
import { format } from "date-fns";
import styled from "styled-components";
import FinishPop from "@component/schedule/FinishPop";
import None from "@component/None";
import Link from "next/link";
import useGetUser from "@component/hooks/getUserDb";
import { Button, Flex, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { comma } from "../CommonFunc";
import { MdOutlineEmail } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import { BsCommand } from "react-icons/bs";
import { GoNote } from "react-icons/go";
import { BiPhoneCall } from "react-icons/bi";

const PartnersLi = styled.ul`
  li{
    justify-content:space-between;
    border:1px solid #ddd;border-radius:6px;
    margin-bottom:15px;overflow:hidden;
    .name{font-size:1rem; font-weight:600;padding: 0.7rem 1.5rem;
      background:#319795;color:#fff;
    }
    .left_box{
      &>div{margin:5px 0;display:flex;align-items:center;
        svg{margin-right:5px;font-size:1rem}
      }
    }
  }
`;

export default function PartnerList() {

  const [partnerList, setPartnerList] = useState()
  useEffect(() => {
    const pRef = ref(db,`partners/list`)
    onValue(pRef,data=>{
      let arr = [];
      const list = data.val();
      for(const key in list){
        list[key].uid = key;
        arr.push(list[key])
      }
      setPartnerList(arr)
    })
  
    return () => {
      
    }
  }, [])

  const onModify = (uid) => {

  }
  

  return (
    <PartnersLi>
      {partnerList && partnerList.map((el)=>(
        <li key={el.uid}>
          <div className="name">{el.name}</div>
          <Flex padding="1rem 1.5rem" justifyContent="space-between" alignItems="center">
            <div className="left_box">
              <div className="email">{
                el.email && <><MdOutlineEmail />{el.email}</>
              }</div>
              <div className="call">
                {el.call && <><BiPhoneCall />{el.call}</>}
              </div>
              <div className="address">
                {el.address2 &&
                  <>
                  <FiMapPin />{el.address2}{el.address2 && `, ${el.address3}`}</>
                }
              </div>
              <div className="role">
                {el.role && <><BsCommand />{el.role}</>}
              </div>
              <div className="etc">
                {el.etc && <><GoNote />{el.etc}</>}
              </div>
            </div>
            <div className="right_box">
              <Button onClick={()=>onModify()}>수정</Button>
            </div>
          </Flex>
        </li>
      ))}

    </PartnersLi>
  )
}
