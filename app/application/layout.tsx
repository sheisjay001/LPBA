import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Programs | LPBA Consulting",
  description: "Apply for our elite leadership and business automation programs. Take the next step in your professional journey.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
