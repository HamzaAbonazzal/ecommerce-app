import { useEffect } from "react";
import { useRouter } from "next/router";

// /admin → /login (موحّد)
export default function AdminIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}
