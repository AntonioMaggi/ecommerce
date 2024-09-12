import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { ProductService } from '../../services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { NgFor } from '@angular/common';  // Import NgFor

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, NgFor],  // Add NgFor to imports
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [ProductService, CategoryService],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required]],
      image_url: [''],
      category_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          // Redirect to home page after success
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
        }
      });
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }
}
