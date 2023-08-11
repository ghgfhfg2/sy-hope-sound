import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import React from "react";
import styled from "styled-components";
const NameBox = styled.div`
  position: relative;
  .pop_body {
    width: auto;
  }
`;

export default function NameComponent({ name, user }) {
  console.log(user);
  return (
    <NameBox>
      <Popover>
        <PopoverTrigger>
          <button type="button">{name}</button>
        </PopoverTrigger>
        <PopoverContent className="pop_body">
          <PopoverArrow />
          <PopoverBody>
            <button type="button">쪽지 보내기</button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </NameBox>
  );
}
