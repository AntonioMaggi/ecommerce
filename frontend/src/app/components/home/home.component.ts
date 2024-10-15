import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [ProductService ],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  sortedProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Fetch products from the backend
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response;
        this.sortedProducts = [...this.products];
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  onSortChange(event: Event): void {
    const sortValue = (event.target as HTMLSelectElement).value;

    switch (sortValue) {
      case 'price-asc':
        this.sortedProducts = [...this.products].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.sortedProducts = [...this.products].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        this.sortedProducts = [...this.products].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        this.sortedProducts = [...this.products].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'category':
        this.sortedProducts = [...this.products].sort((a, b) => 
          a.category_name.localeCompare(b.category_name));
        break;
      default:
        this.sortedProducts = [...this.products]; // No sorting
        break;
    }
  }
  
    // Delete a product by ID
  deleteProduct(productId: number | undefined): void {
    if (productId === undefined) {
      console.error('Product ID is undefined');
      return;
    }
  
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log(`Product with ID ${productId} deleted successfully`);
          this.products = this.products.filter(product => product.id !== productId);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        },
      });
    }
  } 
}
