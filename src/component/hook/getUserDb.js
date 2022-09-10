import { useState, useEffect } from "react";
import { app, db } from "src/firebase";
import {
  ref,
  onValue,
  off,
  set,
  runTransaction,
  update,
} from "firebase/database";
import { useDispatch } from "react-redux";
import { setAllUser } from "@redux/actions/user_action";

export default function useGetUser() {
  const dispatch = useDispatch();
  const [userList, setUserList] = useState();
  useEffect(() => {
    const dbRef = ref(db, `user`);
    onValue(dbRef, (data) => {
      let arr = [];
      data.forEach((list) => {
        let user = {
          ...list.val(),
          uid: list.key,
        };
        arr.push(user);
      });
      setUserList(arr);
      dispatch(setAllUser(arr));
    });
    return () => {
      off(dbRef);
    };
  }, []);

  return userList;
}
