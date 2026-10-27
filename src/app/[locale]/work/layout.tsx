import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en' | 'pl' | 'es' }> }): Promise<Metadata> {
  return generatePageMetadata('work', (await params).locale);
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
