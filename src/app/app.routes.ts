import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';

export const routes: Routes = [
    {   
        path: '',
        redirectTo: 'produtos',
        pathMatch: 'full'
    },
    {
        path: 'produtos',
        component: ProductList
    }
];
