import React, { useState, useEffect } from "react";
import { Input, Button, Flex, FormLabel, Box } from "@chakra-ui/react";
import { imageResize } from "@component/hooks/useImgResize";
import styled from "styled-components";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
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
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        img {
          width: 50p;
          height: 50px;
          object-fit: contain;
        }
      }
      display: flex;
      align-items: center;
    }
  }
`;

export default function UploadBox({ onAddUpload, uploadList, removeFile }) {
  const [fileList, setFileList] = useState();
  useEffect(() => {
    let newFileList = uploadList;
    uploadList &&
      uploadList.map((el, idx) => {
        imageResize(el, 70).then((img) => {
          newFileList[idx].thumb = typeof img === "string" ? img : "";
        });
      });
    setTimeout(() => {
      setFileList(newFileList);
    }, 200);
  }, [uploadList]);

  return (
    <div className="row_box">
      <FormLabel className="label" htmlFor="upload">
        첨부파일
      </FormLabel>
      <Box>
        <FileList>
          <input type="file" id="upload" onChange={onAddUpload} />
          <Button className="btn_add" colorScheme="teal" variant="outline">
            <FormLabel className="label" htmlFor="upload" style={{marginBottom:"0"}}>
              <FiPlus style={{ paddingTop: "2px", marginRight: "3px" }} />
              추가
            </FormLabel>
          </Button>
          <ul className="file_list">
            {fileList &&
              fileList.map((el, idx) => (
                <>
                  <li key={idx}>
                    <div className="thumb">
                      {el.thumb && <img src={el.thumb} />}
                    </div>
                    <div className="name">{el.name}</div>
                    <Button
                      colorScheme="red"
                      ml={2}
                      onClick={() => {
                        removeFile(el.lastModified);
                      }}
                    >
                      <RiDeleteBinLine />
                    </Button>
                  </li>
                </>
              ))}
          </ul>
        </FileList>
      </Box>
    </div>
  );
}
