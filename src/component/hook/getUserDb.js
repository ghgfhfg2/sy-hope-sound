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

export default function useGetUser(uid) {
  const [userList, setUserList] = useState();
  useEffect(() => {
    const dbRef = ref(db, `user`);
    let arr = [];
    onValue(dbRef, (data) => {
      data.forEach((list) => {
        let user = {
          ...list.val(),
          uid: list.key,
        };
        arr.push(user);
      });
      setUserList(arr);
    });

    return () => {
      off(dbRef);
    };
  }, []);
  return userList;
}
