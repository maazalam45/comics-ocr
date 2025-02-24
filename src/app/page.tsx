"use client";
import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      router.push("/dashboards", { scroll: false });
    } else {
      router.push("/sign-in", { scroll: false });
    }
  }, [status]);
  return <></>;
}
