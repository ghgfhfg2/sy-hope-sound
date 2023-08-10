import React, { useState } from "react";
import MessageList from "@component/mypage/MessageList";
import { Tab, TabIndicator, TabList, Tabs } from "@chakra-ui/react";
import MessageSendList from "@component/mypage/MessageSendList";

export default function Message_list() {
  const [listType, setListType] = useState(0);
  const onChangeType = (e) => {
    setListType(e);
  };
  return (
    <>
      <Tabs
        onChange={onChangeType}
        position="relative"
        variant="soft-rounded"
        colorScheme="teal"
        mb={7}
      >
        <TabList>
          <Tab _selected={{ color: "white", bg: "teal.500" }}>받은쪽지</Tab>
          <Tab _selected={{ color: "white", bg: "teal.500" }}>보낸쪽지</Tab>
        </TabList>
      </Tabs>
      {listType == 0 ? <MessageList /> : <MessageSendList />}
    </>
  );
}
