"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      router.push("/dashboards", { scroll: false });
    } else {
      router.push("/sign-in", { scroll: false });
    }
  }, []);
  return <div></div>;
}
