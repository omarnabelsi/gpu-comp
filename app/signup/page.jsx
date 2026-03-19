import { SignupForm } from "@/components/forms/signup-form";
import { Container } from "@/components/ui/container";
import { bem } from "@/lib/bem";
export default async function SignupPage({ searchParams }) {
    const params = await searchParams;
    const callbackUrl = params.callbackUrl || "/dashboard";
    return (<Container className={bem("app-signup-page__c1")}>
      <div className={bem("app-signup-page__c2")}>
        <h1 className={bem("app-signup-page__c3")}>Create Account</h1>
        <p className={bem("app-signup-page__c4")}>Set up your account to access the dashboard.</p>
        <SignupForm callbackUrl={callbackUrl}/>
      </div>
    </Container>);
}
