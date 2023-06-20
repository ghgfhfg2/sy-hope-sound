import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CommonPopup } from "@component/insa/UserDayoffPop";
import axios from "axios";

const WorkListPop = styled(CommonPopup)``;

export default function WorkPop({ selectWorkInfo, closeDayoffPop }) {
  const [listData, setListData] = useState();
  useEffect(() => {
    console.log({
      a: "get_select_work",
      state: selectWorkInfo.state,
      depth: selectWorkInfo.depth,
    });
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_select_work",
        state: selectWorkInfo.state,
        depth: selectWorkInfo.depth,
      })
      .then((res) => {
        setListData(res.data.cate);
      });
  }, []);

  return (
    <WorkListPop>
      <div className="con_box">
        {listData && listData.map((el) => <>{el.title}</>)}
      </div>
      <div className="bg" onClick={closeDayoffPop}></div>
    </WorkListPop>
  );
}
