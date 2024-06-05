import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Category } from '../../../../../shared/interfaces/categories';
import { CategoryService } from '../../../../../shared/Services/category.service';

@Component({
  selector: 'app-show-categories',
  templateUrl: './show-categories.component.html',
  styleUrl: './show-categories.component.scss'
})
export class ShowCategoriesComponent implements OnInit {
  categories: Category[] = [];
  query: string = '';
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  categoryToEdit: string = '';
  studentIdToEdit: number | null = null;
  @Output() categoryId = new EventEmitter<string>(); // Event emitter for edit

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
  }
  toggleEditModal(id: string) {
    this.categoryToEdit = id;
    this.isEditModalVisible = !this.isEditModalVisible;
    if (id !== null) {
      this.categoryId.emit(id);
    }
    this.getAllCategories();
  }
  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    this.getAllCategories(this.query);
  }
  onInputChange() {
    console.log(this.query);
    this.getAllCategories(this.query);
  }

  getAllCategories(searchQuery?: string): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      if (searchQuery && searchQuery.trim() !== '') {
        this.categories = categories.filter((category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        this.categories = categories;
      }
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this Category?')) {
      this.categoryService.deleteCategory(id).subscribe((res) => {
        this.getAllCategories(this.query);
      });
    }
  }
}
