import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECT_LIST } from './components/projects/projects.index';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'project/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return PROJECT_LIST.map(p => ({ slug: p.slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];