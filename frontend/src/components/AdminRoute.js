import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Loader from "./Loader";

export default function AdminRoute({ children }) {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!isAdmin) {
      router.replace("/login?redirect=" + router.pathname);
    } else {
      setChecked(true);
    }
  }, [isAdmin, loading, router]);

  if (loading || !checked) return <Loader />;
  return children;
}
