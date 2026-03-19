"use client";
import { useState } from "react";
import { bem } from "@/lib/bem";
export function ImageUploadInput({ value, onChange, section, uploadOnly = false }) {
    const [status, setStatus] = useState("");
    const [uploading, setUploading] = useState(false);
    async function handleFileChange(file) {
        if (!file) {
            return;
        }
        setUploading(true);
        setStatus("");
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`/api/upload?section=${section}`, {
            method: "POST",
            body: formData,
        });
        setUploading(false);
        if (!response.ok) {
            setStatus("Upload failed.");
            return;
        }
        const data = await response.json();
        onChange(data.url);
        setStatus("Image uploaded.");
    }
    return (<div className={bem("components-forms-image-upload-input__c1")}>
            {uploadOnly ? null : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Image URL or uploaded file path" className={bem("components-forms-image-upload-input__c2")}/>}
      <input type="file" accept="image/*" onChange={(event) => handleFileChange(event.target.files?.[0])} className={bem("components-forms-image-upload-input__c3")}/>
      {uploading ? <p className={bem("components-forms-image-upload-input__c4")}>Uploading...</p> : null}
      {status ? <p className={bem("components-forms-image-upload-input__c5")}>{status}</p> : null}
    </div>);
}
