"use client";
import { useState } from "react";
import { ImageUploadInput } from "@/components/forms/image-upload-input";
import { bem } from "@/lib/bem";
export function SiteContentManager({ sections, canEdit }) {
    const [items, setItems] = useState(sections);
    const [slideImageValues, setSlideImageValues] = useState(() => sections
        .filter((section) => section.key.startsWith("HOME_SLIDE_"))
        .reduce((accumulator, section) => {
        accumulator[section.key] = section.content || "";
        return accumulator;
    }, {}));
    const [status, setStatus] = useState("");
    function handleSlideImageChange(key, value) {
        setSlideImageValues((current) => ({ ...current, [key]: value }));
    }
    async function saveSection(event, key) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            title: String(formData.get("title") || ""),
            content: String(formData.get("content") || ""),
            ctaText: String(formData.get("ctaText") || ""),
            ctaLink: String(formData.get("ctaLink") || ""),
        };
        const response = await fetch(`/api/site-sections/${key}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            setStatus("Could not save content.");
            return;
        }
        const updated = await response.json();
        setItems(items.map((item) => (item.key === updated.key ? updated : item)));
        setStatus("Content saved.");
    }
    return (<div className={bem("components-dashboard-site-content-manager__c1")}>
            {items.map((section) => {
                        const isSlideImageSection = section.key.startsWith("HOME_SLIDE_");
                        const imageValue = slideImageValues[section.key] ?? section.content ?? "";
                        return (<form key={section.key} onSubmit={(event) => saveSection(event, section.key)} className={bem("components-dashboard-site-content-manager__c2")} style={{ borderRadius: "18px 3px 18px 3px" }}>
                            <h3 className={bem("components-dashboard-site-content-manager__c3")}>{section.key}</h3>
                            {isSlideImageSection ? (<>
                                    <p className={bem("components-dashboard-site-content-manager__c9")}>Upload image file for this hero slide.</p>
                                    <input type="hidden" name="title" value={section.title}/>
                                    <input type="hidden" name="content" value={imageValue}/>
                                    <input type="hidden" name="ctaText" value={section.ctaText || ""}/>
                                    <input type="hidden" name="ctaLink" value={section.ctaLink || ""}/>
                                    <ImageUploadInput value={imageValue} onChange={(value) => handleSlideImageChange(section.key, value)} section="SITE" uploadOnly/>
                                </>) : (<>
                                    <input name="title" defaultValue={section.title} className={bem("components-dashboard-site-content-manager__c4")} disabled={!canEdit}/>
                                    <textarea name="content" defaultValue={section.content} rows={4} className={bem("components-dashboard-site-content-manager__c5")} disabled={!canEdit}/>
                                    <input name="ctaText" defaultValue={section.ctaText || ""} className={bem("components-dashboard-site-content-manager__c6")} placeholder="CTA text" disabled={!canEdit}/>
                                    <input name="ctaLink" defaultValue={section.ctaLink || ""} className={bem("components-dashboard-site-content-manager__c7")} placeholder="CTA link" disabled={!canEdit}/>
                                </>)}
                            {canEdit ? <button className={bem("components-dashboard-site-content-manager__c8")}>Save Section</button> : null}
                        </form>);
                })}
      {status ? <p className={bem("components-dashboard-site-content-manager__c9")}>{status}</p> : null}
    </div>);
}
