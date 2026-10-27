export const workSections = ['graphic', 'pottery', 'macrame'] as const;
export type WorkSection = typeof workSections[number];
// Graphic design and illustration share one existing portfolio section.
export const skillSections: readonly WorkSection[] = ['graphic', 'graphic', 'pottery', 'macrame'];
export function workSectionFromHash(hash: string): WorkSection | null {
  const value = hash.replace(/^#/, '');
  return workSections.includes(value as WorkSection) ? value as WorkSection : null;
}

export function selectWorkSection(section: WorkSection) {
  const hash = `#${section}`;
  if (window.location.hash !== hash) window.history.pushState(window.history.state, '', hash);
  // Also reopens a section when its current hash is selected again.
  window.dispatchEvent(new Event('hashchange'));
}
