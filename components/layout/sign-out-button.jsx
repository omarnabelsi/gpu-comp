import { signOut } from "@/lib/auth";
import { bem } from "@/lib/bem";
export function SignOutButton() {
    return (<form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
        }}>
      <button type="submit" className={bem("components-layout-sign-out-button__c1")}>
        Logout
      </button>
    </form>);
}
