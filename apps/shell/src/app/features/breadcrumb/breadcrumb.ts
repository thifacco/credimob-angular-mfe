import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

import { buildTrail } from './utils/build-trail.util';

@Component({
  selector: 'shl-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly items = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => buildTrail(this.route)),
    ),
    { initialValue: buildTrail(this.route) },
  );
}
