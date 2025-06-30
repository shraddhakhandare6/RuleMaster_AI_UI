"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BrainCircuit } from "lucide-react";

export default function LoginPage() {
  const [orgName, setOrgName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate the org name
    // and then redirect to the tenant-specific login or dashboard.
    if (orgName) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-3 text-primary">
          <BrainCircuit className="h-10 w-10 text-logo" />
          <h1 className="text-4xl font-headline font-semibold text-foreground">
            RuleMaster AI
          </h1>
      </div>
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold tracking-tight">Enter Your Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name" className="sr-only">Organization Name</Label>
              <Input
                id="org-name"
                type="text"
                placeholder="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
