import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { ProductService } from '../../services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, NgFor],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [ProductService, CategoryService],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  selectedImage: File | null = null;
  productId: number | null = null; // To track if we're editing
  isEditMode = false; // Track if we're editing a product

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
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

    // Check if we're editing a product
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });
  }

    // Load product details if we're in edit mode
    loadProduct(id: number): void {
      this.productService.getProduct(id).subscribe(product => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          category_id: product.category_id
        });
      });
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
  
  // Handle the form submission for both add and update
  onSubmit(): void {
    // Create a FormData object to handle form submission, including file uploads
    const formData = new FormData();
  
    // Append form fields to FormData
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('category_id', this.productForm.get('category_id')?.value);
  
    // Append image if it's present
    const image = this.productForm.get('image')?.value;
    if (image) {
      formData.append('image', image);
    }
  
    // Check if the form is in "edit" mode or "add" mode
    if (this.isEditMode && this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.router.navigate(['/']); // Redirect to home page after update
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    } else {
      // Add new product
      this.productService.addProduct(formData).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          this.router.navigate(['/']); // Redirect to home page after addition
        },
        error: (error) => {
          console.error('Error adding product:', error);
        }
      });
    }
  }  
}
