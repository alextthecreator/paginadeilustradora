import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-config";

export function generateMetadata({ params }: { params: { locale: 'en' | 'pl' | 'es' } }): Metadata {
  return generatePageMetadata('work', params.locale);
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
