import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormErrorMessage,
  FormControl,
  Input,
  Select,
  Button,
  Flex,
  FormLabel,
  Text,
  useToast,
} from "@chakra-ui/react";
import styled from "styled-components";
import { format } from "date-fns";
import { CommonPopup } from "../insa/UserDayoffPop";
import axios from "axios";

const MessageViewPopup = styled(CommonPopup)`
  .con_box {
    width: 90%;
    max-width: 600px;
    padding: 1rem 1.5rem;
    height: auto;
    dl {
      dt {
        font-size: 1.4rem;
        font-weight: 600;
        padding: 10px;
        border-bottom: 1px solid #ddd;
      }
      dd {
        border-bottom: 1px solid #ddd;
        padding: 1rem 10px;
        .info {
          display: flex;
          gap: 1rem;
        }
        .tit {
          font-weight: 600;
        }
      }
    }
  }
`;

export default function MessageViewPop({
  msgData,
  closeMessagePop,
  onReplyPop,
  readMessage,
  onRemoveMessage,
  readOnly,
}) {
  console.log(msgData);
  const [recipientList, setRecipientList] = useState();
  const userAll = useSelector((state) => state.user.allUser);
  useEffect(() => {
    if (readOnly) {
      const users = userAll.filter(
        (el) => msgData.recipient.indexOf(el.uid) > -1
      );
      console.log(users);
      setRecipientList(users);
      return;
    }
    readMessage(msgData.uid);
  }, []);

  return (
    <MessageViewPopup>
      <div className="con_box">
        <dl>
          <dt>{msgData.title}</dt>
          <dd>
            <ul className="info">
              <li>
                <span className="tit">
                  {readOnly ? "받는사람" : "보낸사람"} :{" "}
                </span>
                <span className="con">
                  {!readOnly && `${msgData.name}(${msgData.rank})`}
                  {readOnly &&
                    recipientList &&
                    recipientList.map((el, idx) => {
                      if (recipientList.length == idx + 1) {
                        return (
                          <>
                            {el.name}({el.rank})
                          </>
                        );
                      } else {
                        return (
                          <>
                            {el.name}({el.rank}),
                          </>
                        );
                      }
                    })}
                </span>
              </li>
              <li>
                <span className="tit">보낸날짜 : {}</span>
                <span className="con">
                  {format(new Date(msgData.date_regis), "yyyy-MM-dd H:m:s")}
                </span>
              </li>
            </ul>
          </dd>
          <dd>
            <div dangerouslySetInnerHTML={{ __html: msgData.content }}></div>
          </dd>
        </dl>

        <Flex mt={4} width="100%" justifyContent="center">
          {readOnly ? (
            <>
              <Button
                mb={2}
                width="100%"
                colorScheme="teal"
                variant="outline"
                mr={2}
                onClick={closeMessagePop}
              >
                확인
              </Button>
              <Button
                onClick={onRemoveMessage}
                mb={2}
                width="100%"
                colorScheme="red"
              >
                삭제하기
              </Button>
            </>
          ) : (
            <>
              <Button
                mb={2}
                width="100%"
                colorScheme="teal"
                variant="outline"
                mr={2}
                onClick={closeMessagePop}
              >
                취소
              </Button>
              <Button
                onClick={onReplyPop}
                mb={2}
                width="100%"
                colorScheme="teal"
              >
                답장하기
              </Button>
            </>
          )}
        </Flex>
      </div>
      <div className="bg" onClick={closeMessagePop}></div>
    </MessageViewPopup>
  );
}
