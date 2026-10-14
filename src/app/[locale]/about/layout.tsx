import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-config";

export function generateMetadata({ params }: { params: { locale: 'en' | 'pl' | 'es' } }): Metadata {
  return generatePageMetadata('about', params.locale);
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
