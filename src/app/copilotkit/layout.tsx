
import "@copilotkit/react-ui/styles.css";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  // The CopilotKit provider is now in the main app layout (src/app/(app)/layout.tsx),
  // so we just render the children here.
  return <>{children}</>;
}
