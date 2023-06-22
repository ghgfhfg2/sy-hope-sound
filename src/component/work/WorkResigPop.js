import styled from "styled-components";
import { CommonPopup } from "@component/insa/UserDayoffPop";

import WorkRegist from "@component/work/WorkRegist";

const WorkRegisPopBox = styled(CommonPopup)``;

export default function WorkResigPop({
  selectWorkInfo,
  closeRegisPop,
  closeRender,
}) {
  return (
    <WorkRegisPopBox>
      <div className="con_box">
        <WorkRegist selectWorkInfo={selectWorkInfo} closeRender={closeRender} />
      </div>
      <div className="bg" onClick={closeRegisPop}></div>
    </WorkRegisPopBox>
  );
}
