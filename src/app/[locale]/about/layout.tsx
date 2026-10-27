import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en' | 'pl' | 'es' }> }): Promise<Metadata> {
  return generatePageMetadata('about', (await params).locale);
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
