import React, { useState, useEffect } from "react";
import { app, db } from "src/firebase";
import { ref, onValue, set, runTransaction, update } from "firebase/database";
import useGetUser from "@component/hook/getUserDb";
import styled from "styled-components";
import { Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import InsaSkeleton from "@component/insa/InsaSkeleton";
import UserModifyPop from "@component/insa/UserModifyPop";

const ListUl = styled.div`
  display: flex;
  flex-direction: column;
  > ul {
    display: flex;
  }
  .header {
    height: 55px;
    background: var(--p-color);
    color: #fff;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }
  .body {
    flex-direction: column;
    > li {
      display: flex;
      align-items: center;
    }
    .box {
      height: 50px;
      border-bottom: 1px solid #eaeaea;
    }
  }
  .box {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default function UserList() {
  const userList = useGetUser();  
  const [userData, setUserData] = useState();
  const userInfo = useSelector(state=>state.user.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isModifyPop, setIsModifyPop] = useState(false);
  
  const onUserModify = (uid) => {
    const dbRef = ref(db, `user/${uid}`);
    onValue(dbRef, (data) => {
      let user = {
        ...data.val(),
        uid: data.key,
      };
      setUserData(user);
      setIsModifyPop(true);
    });
  };
  const closeUserModify = () => {
    setUserData('');
    setIsModifyPop(false);
  }

  useEffect(()=>{
    if(userList){
      setIsLoading(true)
    }
  },[userList])
  return (
    <>
    {isLoading ? (
      <>
        <ListUl>
          <ul className="header">
            <li className="box name">이름</li>
            <li className="box part">부서</li>
            <li className="box rank">직급</li>
            <li className="box call">전화번호</li>
            <li className="box email">이메일</li>
            <li className="box date">입사일</li>
            {
              userInfo?.authority && userInfo.authority.includes('admin') &&
              <li className="box setting"></li>
            }
          </ul>
          <ul className="body">
            {userList &&
              userList.map((el) => (
                <>
                  <li key={el.uid}>
                    <span className="box name">{el.name}</span>
                    <span className="box part"></span>
                    <span className="box rank"></span>
                    <span className="box call"></span>
                    <span className="box email">{el.email}</span>
                    <span className="box date"></span>
                    {userInfo?.authority && userInfo.authority.includes('admin') &&
                      <div className="box setting">
                        <Button
                          size="sm"
                          onClick={() => {
                            onUserModify(el.uid);
                          }}
                        >
                          관리
                        </Button>
                      </div>
                    }
                  </li>
                </>
              ))}
          </ul>
        </ListUl>   
        {userData && isModifyPop &&
          <UserModifyPop userData={userData} closeUserModify={closeUserModify} />
        }
      </>
    ) : (
      <>
        <InsaSkeleton />
      </>
    )}
    
    </>
  );
}
