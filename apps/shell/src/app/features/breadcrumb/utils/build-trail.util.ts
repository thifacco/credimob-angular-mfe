import { ActivatedRoute } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

export function buildTrail(route: ActivatedRoute): BreadcrumbItem[] {
  const trail: BreadcrumbItem[] = [];
  let current: ActivatedRoute | null = route.root;
  let url = '';

  while (current) {
    const segments = current.snapshot.url.map(segment => segment.path);
    if (segments.length > 0) {
      url += `/${segments.join('/')}`;
    }

    const label = current.snapshot.data['breadcrumb'] as string | undefined;
    if (label) {
      trail.push({ label: label.toLowerCase(), url });
    }

    current = current.firstChild;
  }

  return trail;
}
