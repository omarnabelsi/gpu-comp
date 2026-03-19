"use client";
import { useState } from "react";
import { bem } from "@/lib/bem";
export function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    async function onSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setStatus("");
        const response = await fetch("/api/contact-submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message, reason }),
        });
        setLoading(false);
        if (!response.ok) {
            setStatus("Something went wrong. Try again.");
            return;
        }
        setName("");
        setEmail("");
        setMessage("");
        setReason("");
        setStatus("Thanks. We received your message.");
    }
    return (<form onSubmit={onSubmit} className={bem("components-forms-contact-form__c1")} style={{ borderRadius: "20px 4px 20px 4px" }}>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className={bem("components-forms-contact-form__c2")}/>
      <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Your email" className={bem("components-forms-contact-form__c3")}/>
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Your message" rows={5} className={bem("components-forms-contact-form__c4")}/>
      <div className={bem("components-forms-contact-form__c5")}>
        <label htmlFor="contact-reason" className={bem("components-forms-contact-form__c6")}>
          Why are you requesting the demo
        </label>
        <textarea id="contact-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Tell us what you hope to learn or achieve" rows={4} className={bem("components-forms-contact-form__c7")}/>
      </div>
      {status ? <p className={bem("components-forms-contact-form__c8")}>{status}</p> : null}
      <button type="submit" disabled={loading} className={bem("components-forms-contact-form__c9")}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>);
}
