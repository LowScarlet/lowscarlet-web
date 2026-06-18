import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visitor Social Center - LowScarlet",
  description: "Leave comments, like the page, and connect with other visitors of LowScarlet.",
};

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
