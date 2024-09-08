import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <nav>
    <a routerLink="/">Home</a>
    <a routerLink="/add-product">Add Product</a>
    <a routerLink="/add-category">Add Category</a>
  </nav>
  <router-outlet></router-outlet>
`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce-frontend';
}
