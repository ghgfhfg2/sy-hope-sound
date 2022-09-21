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

export default function Editor({ type, handleEditor }) {
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  const typeList = {
    payment: `
    <table>
      <header>
        <tr>
          <th>title</th>
        </tr>
      </header>
    </table>
`,
  };

  useEffect(() => {
    if (type && typeList) {
      let typeObj = type.split("_");
      setTimeout(() => {
        inputHtml(typeList[typeObj[0]]);
      }, 50);
      return;
    }
  }, [type]);

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
          setContents="My contents"
        />
      </EditorBox>
    </>
  );
}
