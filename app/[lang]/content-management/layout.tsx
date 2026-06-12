import { ReactNode } from "react";

export const metadata = {
  title: "Content Management - MentivisOS",
  robots: { index: false, follow: false },
};

export default function ContentManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f3f0", paddingTop: 80 }}>
      {children}
    </div>
  );
}
