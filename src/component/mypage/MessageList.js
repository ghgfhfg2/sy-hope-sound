import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetUser from "@component/hooks/getUserDb";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

export default function MessageList() {
  const toast = useToast();
  useGetUser();
  const userAll = useSelector((state) => state.user.allUser);
  const userInfo = useSelector((state) => state.user.currentUser);
  const [messageList, setMessageList] = useState();
  useEffect(() => {
    if (!userInfo) return;
    axios
      .post("https://shop.editt.co.kr/_var/_xml/groupware.php", {
        a: "get_message_list",
        mem_uid: userInfo.uid,
      })
      .then((res) => {
        console.log(res);
      });
  }, [userInfo]);

  return <div>MessageList</div>;
}
