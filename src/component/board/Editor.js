import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import styled from "styled-components";
import { basicForm } from "@component/BasicForm"
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const EditorBox = styled.div`
  .sun-editor-editable {
    .form_wrapper {
      display: flex;
      justify-content: center;
    }
    .form_content {
      width: 95vw;
      max-width: 1000px;
      border: 2px solid #ddd;
      padding: 2.5rem;
    }
    .top_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 120px;
      margin-bottom: 2rem;
      h2 {
        flex: 1;
        height: 100%;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .manager_box {
        display: flex;
        height: 100%;
        .dl {
          min-width: 80px;
          height: 100%;
          border: 1px solid #aaa;
          margin-left: -1px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .dt {
          border-bottom: 1px solid #aaa;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .dd {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .con_box {
      width: 100%;
      margin-bottom: 2rem;
    }

    .con_table {
    }

    .footer_box {
      display: flex;
      justify-content: center;
      span {
        margin: 1rem;
      }
    }
  }
`;

export default function Editor({ type, handleEditor, typeCon, initTypeCon, disable, insertHtml }) {
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    let selCon;
    if (type && typeCon) {
      typeCon.forEach((el) => {
        if (el.uid === type) {
          selCon = el.editor;
        }
      });
      setTimeout(() => {
        inputHtml(selCon);
      }, 100);
      return;
    }
  }, [type, typeCon]);

  useEffect(() => {
    if(insertHtml){
      setTimeout(() => {
        inputHtml(insertHtml);
      }, 100);
    }
  }, [insertHtml])
  

  const inputHtml = (content) => {
    editor.current?.setContents(content);
  };

  return (
    <>
      <EditorBox>
        <SunEditor
          disable={disable || false}
          onChange={handleEditor}
          height="70vh"
          getSunEditorInstance={getSunEditorInstance}
          defaultValue={initTypeCon || basicForm}
        />
      </EditorBox>
    </>
  );
}
