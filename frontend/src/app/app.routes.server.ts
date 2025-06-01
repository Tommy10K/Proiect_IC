import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'dashboard', renderMode: RenderMode.Prerender },
  { path: 'journal', renderMode: RenderMode.Prerender },
  { path: 'statistics', renderMode: RenderMode.Prerender },
  { path: 'info', renderMode: RenderMode.Prerender },
];
