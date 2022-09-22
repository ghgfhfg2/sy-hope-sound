import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import styled from "styled-components";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const EditorBox = styled.div`
  .sun-editor-editable {
    .container {
      display: flex;
    }
  }
`;

export default function Editor({ type, handleEditor, typeCon, initTypeCon }) {
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };



  useEffect(() => {
    let selCon;
    if (type && typeCon) {
      typeCon.forEach(el=>{
        console.log(el)
        if(el.uid === type){
          selCon = el.editor
        }
    })
      setTimeout(() => {
        inputHtml(selCon);
      }, 50);
      return;
    }
  }, [type,typeCon]);

  const inputHtml = (content) => {
    editor.current.setContents(content);
  };

  return (
    <>
      <EditorBox>
        <SunEditor
          onChange={handleEditor}
          height="70vh"
          getSunEditorInstance={getSunEditorInstance}
          setContents={initTypeCon}
        />
      </EditorBox>
    </>
  );
}
