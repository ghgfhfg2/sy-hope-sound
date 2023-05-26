import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styled from "styled-components";
import axios from "axios";
import useGetUser from "@component/hooks/getUserDb";
import StepBox from "@component/work/StepBox";

const WorkViewBox = styled.div`
  dt {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    border-top: 2px solid #555;
    font-size: 16px;
    font-weight: 600;
  }
  dd {
    padding: 15px;
    display: flex;
    gap: 50px;
    border-bottom: 1px solid #ddd;
  }
  .box {
    .tit {
      font-weight: 600;
    }
  }
`;

export default function WorkView() {
  const router = useRouter();
  useGetUser();
  const userAll = useSelector((state) => state.user.allUser);
  const [viewData, setViewData] = useState();
  useEffect(() => {
    const uid = router.query.uid;
    console.log(uid);
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_work_view",
        uid,
      })
      .then((res) => {
        console.log(res.data.work.writer);
        const writer = userAll?.find(
          (user) => res.data.work.writer === user.uid
        );
        const managerArr = JSON.parse(res.data.work.manager);
        const manager = [];
        managerArr.forEach((el) => {
          manager.push(userAll?.find((user) => el === user.uid));
        });
        setViewData({
          ...writer,
          ...res.data.work,
          manager,
        });
      });
  }, [userAll]);
  return (
    <>
      {viewData && (
        <>
          <WorkViewBox>
            <dl>
              <dt>{viewData.title}</dt>
              <dd>
                <StepBox step={2} />
              </dd>
              <dd>
                <div className="box">
                  <span className="tit">작성자 : </span>
                  <span className="con">{viewData.name}</span>
                </div>
                <div className="box">
                  <span className="tit">담당자 : </span>
                  <span className="con">
                    {viewData.manager.map((mng, idx) => {
                      let comma = "";
                      if (idx != 0) {
                        comma = ", ";
                      }
                      return (
                        <>
                          <span>
                            {comma}
                            {mng?.name}
                          </span>
                        </>
                      );
                    })}
                  </span>
                </div>
                <div className="box">
                  <span className="tit">작성일 : </span>
                  <span className="con">{viewData.date_regis}</span>
                </div>
              </dd>
              <dd>
                <div
                  dangerouslySetInnerHTML={{ __html: viewData.content }}
                ></div>
              </dd>
            </dl>
          </WorkViewBox>
        </>
      )}
    </>
  );
}
