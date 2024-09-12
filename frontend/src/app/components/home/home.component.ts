import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NgFor, CommonModule, HttpClientModule],
  providers: [ProductService ],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Fetch products from the backend
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }
}
