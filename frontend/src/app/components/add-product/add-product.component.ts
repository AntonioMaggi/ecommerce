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
  selectedImage: File | null = null;

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
      image: [null],
      category_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
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

  // Handle file input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')?.updateValueAndValidity();
    }
  }  

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('category_id', this.productForm.get('category_id')?.value);
  
      // Check and append the image file
      const image = this.productForm.get('image')?.value;
      if (image) {
        formData.append('image', image); // Make sure the 'image' is coming from file input
      }
  
      this.productService.addProduct(formData).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
        },
        error: (error) => {
          console.error('Error adding product:', error);
        }
      });
    }
  }
  
}
