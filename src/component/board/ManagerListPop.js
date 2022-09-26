import React, { useState, useEffect } from "react";
import { Button, CheckboxGroup, Checkbox, Flex, Input } from "@chakra-ui/react";
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
} from "firebase/database";
import { CommonPopup } from "@component/insa/UserModifyPop";
import { ListUl } from "@component/insa/UserList";
import styled from "styled-components";
const ManagerSelect = styled(ListUl)`
  width: 90vw;
  max-width: 500px;
  .num{max-width:50px;padding-left:1rem;}
  .chk {
    max-width: 50px;
  }
  .name {
    max-width: 80px;
  }
  .body {
    overflow: auto;
    max-height: 60vh;
  }
  .body .name {
    justify-content: flex-start;
  }

`;

export default function ManagerListPop({
  userData,
  closeManagerPop,
  onSelectManager,
}) {
  const [initUser, setInitUser] = useState();
  useEffect(() => {
    let useRef = query(ref(db, `user`), orderByChild("manager"), equalTo(1));
    onValue(useRef, (data) => {
      let arr = [];
      for (const key in data.val()) {
        arr.push(key);
      }
      setInitUser(arr);
    });
    return () => {
      off(useRef);
    };
  }, []);

  const [checkedItems, setCheckedItems] = useState([]);

  const onChageCheckItem = (e) => {
    checkManager.forEach(el=>{
      if(!e.includes(el.id)){
        removeManager(el.id)
      }
    })
    setCheckedItems(e);
  };

  const [checkManager, setCheckManager] = useState([])
  const onNumber = (e) => {
    const value = e.target.value;
    const id = e.target.id.split('_')[0];
    const name = e.target.id.split('_')[1];
    let arr = [];
    let isEqual = false
    arr = checkManager.map(el=>{
      if(el.id === id){
        isEqual = true;
        el.value = value
      }
      return el
    })
    if(!isEqual){
      arr.push({
        id,name,value
      })
    }
    setCheckManager(arr)
  }
  const removeManager = (id) => {
    let newList = checkManager;
    newList = newList.filter(el=>el.id !== id);
    setCheckManager(newList)
  }

  return (
    <CommonPopup>
      <div className="con_box">
        <ManagerSelect>
          <ul className="header">
            <li className="box num">순서</li>
            <li className="box chk">선택</li>
            <li className="box name">이름</li>
            <li className="box part">부서</li>
            <li className="box rank">직급</li>
          </ul>
          {initUser && (
            <CheckboxGroup
              onChange={onChageCheckItem}
              colorScheme="teal"
            >
              <ul className="body">
                {userData &&
                  userData.map((el) => (
                    <>
                      <li key={el.uid}>
                        <span className="box num">
                          {
                            checkedItems.includes(el.uid) &&
                            <Input onChange={onNumber} maxLength={2} size="xs" id={`${el.uid}_${el.name}`} textAlign="center" type="number" />
                          }
                        </span>
                        <span className="box chk">
                          <Checkbox value={el.uid}></Checkbox>
                        </span>
                        <span className="box name">{el.name}</span>
                        <span className="box part">{el.part}</span>
                        <span className="box rank">{el.rank}</span>
                      </li>
                    </>
                  ))}
              </ul>
            </CheckboxGroup>
          )}
        </ManagerSelect>
        <Flex justifyContent="center" mt={5}>
          <Button
            onClick={() => {
              onSelectManager(checkManager);
            }}
            colorScheme="teal"
            width="100px"
          >
            선택
          </Button>
        </Flex>
      </div>
      <div className="bg" onClick={closeManagerPop}></div>
    </CommonPopup>
  );
}
