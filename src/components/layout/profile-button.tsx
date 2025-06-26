"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";

export function ProfileButton() {
  const { firstName } = useUser();

  return (
    <Button asChild variant="ghost" className="h-10 w-full justify-start gap-3 px-2 hover:text-primary">
      <Link href="/settings">
        <UserCircle className="size-6" />
        <span>{firstName}</span>
      </Link>
    </Button>
  );
}
