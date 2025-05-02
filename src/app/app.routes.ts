import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductService } from './product-table/product.service';

export const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
    },
    {
      path: 'product-table',
      loadChildren: () => import('./product-table/product.routes').then((m) => m.routes),
      providers: [
        ProductService
      ]
    }
  ];
  
