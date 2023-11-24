import { Box, Button, Flex, Image, Select, useToast } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import "react-calendar-heatmap/dist/styles.css";
import styled from "styled-components";

export const MainWrapper = styled.div``;

export default function Main() {
  const userInfo = useSelector((state) => state.user.currentUser);
  const toast = useToast();

  return (
    <>
      <MainWrapper></MainWrapper>
    </>
  );
}
