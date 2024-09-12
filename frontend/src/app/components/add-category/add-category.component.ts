import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
  providers: [CategoryService]
})
export class AddCategoryComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private categoryService: CategoryService,
    private router: Router 
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.categoryService.addCategory(this.categoryForm.value).subscribe({
        next: (response) => {
          console.log('Category added successfully:', response);
          // Redirect to home page after success
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding category:', error);
        }
      });
    }
  }
}
