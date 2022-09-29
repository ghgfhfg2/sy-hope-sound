import React, { useState, useEffect } from "react";
import { Input, Button, Flex, FormLabel, Box } from "@chakra-ui/react";
import { imageResize } from "@component/hooks/useImgResize";
import styled from "styled-components";
const FileList = styled.div`
  input {
    width: 0;
    height: 0;
    position: absolute;
    z-index: -1;
    opacity: 0;
    display: block;
    overflow: hidden;
  }
  .btn_add {
    padding: 0;
    label {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .file_list {
    li {
      margin-top: 10px;
      .thumb {
        width: 100px;
      }
      display: flex;
      align-items: center;
    }
  }
`;

export default function UploadBox({ onAddUpload, uploadList }) {
  const [fileList, setFileList] = useState();
  useEffect(() => {
    let newFileList = uploadList;
    uploadList &&
      uploadList.map((el, idx) => {
        imageResize(el, 100).then((img) => {
          newFileList[idx].thumb = typeof img === "string" ? img : "";
        });
      });
    setTimeout(() => {
      setFileList(newFileList);
    }, 100);
  }, [uploadList]);

  return (
    <div className="row_box">
      <FormLabel className="label" htmlFor="upload">
        첨부파일
      </FormLabel>
      <Box>
        <FileList>
          <input type="file" id="upload" onChange={onAddUpload} />
          <Button className="btn_add">
            <FormLabel className="label" htmlFor="upload">
              추가하기
            </FormLabel>
          </Button>
          <ul className="file_list">
            {fileList &&
              fileList.map((el, idx) => (
                <>
                  <li>
                    <div className="thumb">
                      {el.thumb && <img src={el.thumb} />}
                    </div>
                    <div className="name">{el.name}</div>
                  </li>
                </>
              ))}
          </ul>
        </FileList>
      </Box>
    </div>
  );
}
