import { Routes } from '@angular/router';

import { GalleryComponent } from './main/gallery/gallery.component';

export const routes: Routes = [
    {
        path: "",
        component: GalleryComponent,
        canActivate: [],
        children: [            
            {
                path: '',
                loadChildren: () => import('./main/gallery/gallery.module').then(m => m.GalleryModule)
            }
        ]
    }
];
