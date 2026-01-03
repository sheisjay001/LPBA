import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment | LPBA Consulting",
  description: "Take the free LPBA Assessment to evaluate your leadership influence and revenue potential.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
