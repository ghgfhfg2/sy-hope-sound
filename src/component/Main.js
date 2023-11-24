import { Box, Button, Flex, Image, Select, useToast } from "@chakra-ui/react";
import GoogleAd from "./GoogleAd";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { textArr } from "@component/textDb";
import { createApi } from "unsplash-js";

import "react-calendar-heatmap/dist/styles.css";
import styled from "styled-components";
export const MainWrapper = styled.div`
  .bg_shadow {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: #111;
    opacity: 0.5;
  }
  min-height: calc(100vh - 60px);
  background: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  .main_con {
    padding: 50px;
    background: rgba(255, 255, 255, 0.85);
    z-index: 10;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .btn {
      width: 200px;
      height: 50px;
    }
  }
`;

export default function Main() {
  const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS,
    //...other fetch options
  });

  const [bgImg, setBgImg] = useState();

  // useEffect(() => {
  //   if (unsplash) {
  //     unsplash.photos.getRandom({}).then((res) => {
  //       setBgImg(res.response.urls.full);
  //     });
  //   }
  // }, [unsplash]);

  const audioRef = useRef();
  const userInfo = useSelector((state) => state.user.currentUser);
  const toast = useToast();

  const [selectText, setSelectText] = useState();

  const onSound = () => {
    let src = "/sound/";
    let ran = Math.floor(Math.random() * 97) + 1;
    setSelectText(textArr[ran - 1]);
    if (ran < 10) {
      ran = `0${ran}`;
    }
    audioRef.current.src = `${src}/sound_${ran}.mp3`;
    audioRef.current.play();
  };
  return (
    <>
      <GoogleAd />
      <MainWrapper
        style={{
          background: `url(https://images.unsplash.com/photo-1499946981954-e7f4b234d7fa?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D) center no-repeat`,
          backgroundSize: "cover",
        }}
      >
        <div className="bg_shadow"></div>
        <div className="main_con">
          <audio hidden ref={audioRef}>
            <source src="" type="audio/mpeg" />
          </audio>
          <div className="text_box">{selectText && `"${selectText}"`}</div>
          <Button colorScheme="blue" className="btn" onClick={onSound}>
            한마디 해줄래?
          </Button>
        </div>
      </MainWrapper>
    </>
  );
}
