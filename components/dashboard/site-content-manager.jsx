"use client";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
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
    const [activeSection, setActiveSection] = useState(sections[0]?.key || "");
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleSlideImageChange(key, value) {
        setSlideImageValues((current) => ({ ...current, [key]: value }));
    }

    function openEditModal() {
        if (!activeSection) return;
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setStatus("");
    }

    function getSectionIcon(key) {
        if (key.startsWith("HOME_SLIDE_")) {
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                </svg>
            );
        }
        if (key === "HOME") {
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
            );
        }
        if (key === "ABOUT") {
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
            );
        }
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
        );
    }

    function getSectionSubtitle(key) {
        if (key.startsWith("HOME_SLIDE_")) {
            return "Hero slide image";
        }
        if (key === "ABOUT") {
            return "About section content";
        }
        if (key === "HOME") {
            return "Home page content";
        }
        return "Section content";
    }

    function getPreviewContent() {
        const section = items.find((item) => item.key === activeSection);
        if (!section) return null;

        const isSlide = section.key.startsWith("HOME_SLIDE_");
        const imageUrl = isSlide ? (slideImageValues[section.key] || section.content) : null;

        if (isSlide && imageUrl) {
            return <img src={imageUrl} alt={section.key} className="section-preview-image" />;
        }

        if (section.title || section.content) {
            return (
                <div className="section-preview-content">
                    {section.title && <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{section.title}</p>}
                    {section.content && <p>{section.content.slice(0, 200)}{section.content.length > 200 ? "..." : ""}</p>}
                </div>
            );
        }

        return <p className="section-preview-empty">No content available</p>;
    }

    useEffect(() => {
        function handleKeyDown(event) {
            const currentIndex = items.findIndex((item) => item.key === activeSection);

            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                setActiveSection(items[nextIndex].key);
            }

            if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
                setActiveSection(items[prevIndex].key);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [items, activeSection]);

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
        setIsModalOpen(false);
    }

    const editingSection = items.find((item) => item.key === activeSection);
    const isSlideImageSection = editingSection?.key.startsWith("HOME_SLIDE_");
    const imageValue = editingSection ? (slideImageValues[editingSection.key] ?? editingSection.content ?? "") : "";

    return (<div className={bem("components-dashboard-site-content-manager__c1")}>
      <div className="section-content-container">
        <div className="section-grid-wrapper">
          {items.map((section) => (
            <div
              key={section.key}
              className={`section-card ${activeSection === section.key ? "active" : ""}`}
              onClick={() => setActiveSection(section.key)}
            >
              <div className="section-card-header">
                <div className="section-card-icon">
                  {getSectionIcon(section.key)}
                </div>
                <div className="section-card-info">
                  <h4 className="section-card-title">{section.key}</h4>
                  <p className="section-card-subtitle">{getSectionSubtitle(section.key)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeSection && (
          <div className="section-preview-panel">
            <h5 className="section-preview-title">Preview: {activeSection}</h5>
            {getPreviewContent()}
          </div>
        )}

        {canEdit && activeSection && (
          <div className="section-actions-container">
            <button
              type="button"
              className="edit-section-button"
              onClick={openEditModal}
            >
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" fill="currentColor"/>
              </svg>
              Edit Section
            </button>
          </div>
        )}
      </div>

      <Modal
        open={isModalOpen}
        title={`Edit ${activeSection}`}
        onClose={closeModal}
        widthClass="max-w-lg"
        scrollable
      >
        {editingSection ? (
          <form onSubmit={(event) => saveSection(event, activeSection)} className="project-form-container">
            {isSlideImageSection ? (<>
                <div className="project-form-field">
                  <label className="project-form-label">Hero Slide Image</label>
                  <p style={{ fontSize: "0.85rem", color: "#71717a", marginBottom: "0.5rem" }}>Upload image file for this hero slide.</p>
                  <input type="hidden" name="title" value={editingSection.title}/>
                  <input type="hidden" name="content" value={imageValue}/>
                  <input type="hidden" name="ctaText" value={editingSection.ctaText || ""}/>
                  <input type="hidden" name="ctaLink" value={editingSection.ctaLink || ""}/>
                  <ImageUploadInput value={imageValue} onChange={(value) => handleSlideImageChange(editingSection.key, value)} section="SITE" uploadOnly/>
                </div>
              </>) : (<>
                <div className="project-form-field">
                  <label className="project-form-label">Title</label>
                  <input name="title" defaultValue={editingSection.title} className="project-form-input"/>
                </div>
                <div className="project-form-field">
                  <label className="project-form-label">Content</label>
                  <textarea name="content" defaultValue={editingSection.content} rows={4} className="project-form-textarea"/>
                </div>
                <div className="project-form-field">
                  <label className="project-form-label">CTA Text</label>
                  <input name="ctaText" defaultValue={editingSection.ctaText || ""} className="project-form-input" placeholder="Call to action text"/>
                </div>
                <div className="project-form-field">
                  <label className="project-form-label">CTA Link</label>
                  <input name="ctaLink" defaultValue={editingSection.ctaLink || ""} className="project-form-input" placeholder="Call to action URL"/>
                </div>
              </>)}

            <button type="submit" className="project-form-submit">Save Section</button>
            {status ? <p className="project-form-status">{status}</p> : null}
          </form>
        ) : null}
      </Modal>
    </div>);
}
