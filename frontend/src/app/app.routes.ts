import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'add-product', component: AddProductComponent },
    { path: 'edit-product/:id', component: AddProductComponent },
    { path: 'add-category', component: AddCategoryComponent }
];
