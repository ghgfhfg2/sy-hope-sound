import React, { useState } from "react";
import {
  Flex,
  FormLabel,
  Stack,
  HStack,
  useRadioGroup
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import AlertBox from "@component/popup/Alert";
import OffWrite from "@component/schedule/OffWrite";
import RadioCard from "@component/RadioCard"

export default function Write() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertState, setAlertState] = useState(false);

  const [writeType, setWriteType] = useState();
  const options = ["휴가", "양식2", "양식3"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "writeType",
    onChange: setWriteType
  });

  const group = getRootProps();

  return (
    <>
      {alertState && <AlertBox text={alertMessage} />}
      <Flex justifyContent="center" marginTop={10}>
        <Flex
          maxWidth={1000}
          width="100%"
          alignItems="center"
          gap={2}
        >
          <Flex alignItems='center'>
            <HStack>
              <FormLabel flexShrink='0' mb='0' htmlFor='type'>양식</FormLabel>
              <HStack {...group}>
                {options.map((value) => {
                  const radio = getRadioProps({ value });
                  return (
                    <RadioCard key={value} {...radio}>
                      {value}
                    </RadioCard>
                  );
                })}
              </HStack>
            </HStack>
          </Flex>
        </Flex>
      </Flex>
      {
        writeType && writeType === '휴가' &&
        <>
          <OffWrite userInfo={userInfo} />
        </>
      }
    </>
  );
}
