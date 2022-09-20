import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export default function Editor() {
  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };
  useEffect(() => {}, []);

  const testComponenet = `
        <table>
          <header>
            <tr>
              <th>title</th>
            </tr>
          </header>
        </table>
  `;

  const inputHtml = () => {
    editor.current.setContents(testComponenet);
  };

  return (
    <>
      <button type="button" onClick={inputHtml}>
        html
      </button>
      <SunEditor
        height="70vh"
        getSunEditorInstance={getSunEditorInstance}
        setContents="My contents"
      />
    </>
  );
}
