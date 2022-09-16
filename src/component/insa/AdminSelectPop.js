import React from 'react'
import { Button } from "@chakra-ui/react";
import { CommonPopup } from "@component/insa/UserModifyPop"
import { ListUl } from "@component/insa/UserList"
import styled from 'styled-components'
const AdminSelect = styled(ListUl)`
  width:90vw;
  max-width:500px;
`

export default function AdminSelectPop({ userData, closeAdminPop, onSelectUser }) {
  return (
    <CommonPopup>
      <div className="con_box">
        <AdminSelect>
          <ul className="header">
            <li className="box name">이름</li>
            <li className="box part">부서</li>
            <li className="box rank">직급</li>
            <li className="box"></li>
          </ul>
          <ul className="body">
            {userData &&
              userData.map((el) => (
                <>
                  <li key={el.uid}>
                    <span className="box name">{el.name}</span>
                    <span className="box part">{el.part}</span>
                    <span className="box rank">{el.rank}</span>
                    <span className="box">
                      <Button onClick={()=>{onSelectUser(el.uid,el.name,el.rank)}}>선택</Button>
                    </span>
                  </li>
                </>
              ))}
          </ul>
        </AdminSelect>
      </div>
      <div className="bg" onClick={closeAdminPop}></div>
    </CommonPopup>
  )
}
