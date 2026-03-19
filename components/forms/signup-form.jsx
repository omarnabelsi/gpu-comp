"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { bem } from "@/lib/bem";
export function SignupForm({ callbackUrl }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setStatus("");
        setError("");
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = (await response.json());
        setLoading(false);
        if (!response.ok) {
            setError(data.message || "Could not create account.");
            return;
        }
        setStatus("Account created. Redirecting to sign in...");
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
            router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        }, 700);
    }
    return (<form onSubmit={handleSubmit} className={bem("components-forms-signup-form__c1")} style={{ borderRadius: "20px 4px 20px 4px" }}>
      <input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="Full name" className={bem("components-forms-signup-form__c2")}/>
      <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" className={bem("components-forms-signup-form__c3")}/>
      <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password (min 8 characters)" className={bem("components-forms-signup-form__c4")}/>
      {error ? <p className={bem("components-forms-signup-form__c5")}>{error}</p> : null}
      {status ? <p className={bem("components-forms-signup-form__c6")}>{status}</p> : null}
      <button type="submit" disabled={loading} className={bem("components-forms-signup-form__c7")}>
        {loading ? "Creating account..." : "Create Account"}
      </button>
      <p className={bem("components-forms-signup-form__c8")}>
        Already have an account?{" "}
        <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className={bem("components-forms-signup-form__c9")}>
          Sign in
        </Link>
      </p>
    </form>);
}
