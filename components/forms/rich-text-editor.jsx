"use client";
import { useRef } from "react";
import { bem } from "@/lib/bem";
export function RichTextEditor({ value, onChange }) {
    const editorRef = useRef(null);
    function runCommand(command) {
        document.execCommand(command);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }
    return (<div className={bem("components-forms-rich-text-editor__c1")}>
      <div className={bem("components-forms-rich-text-editor__c2")}>
        <button type="button" onClick={() => runCommand("bold")} className={bem("components-forms-rich-text-editor__c3")}>
          Bold
        </button>
        <button type="button" onClick={() => runCommand("italic")} className={bem("components-forms-rich-text-editor__c4")}>
          Italic
        </button>
        <button type="button" onClick={() => runCommand("insertUnorderedList")} className={bem("components-forms-rich-text-editor__c5")}>
          Bullet List
        </button>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning className={bem("components-forms-rich-text-editor__c6")} style={{ borderRadius: "12px 2px 12px 2px" }} onInput={(event) => onChange(event.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: value }}/>
    </div>);
}
