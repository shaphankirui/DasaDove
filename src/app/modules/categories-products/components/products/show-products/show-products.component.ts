import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product } from '../../../../../shared/interfaces/products';
import { ProductService } from '../../../../../shared/Services/product.service';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrl: './show-products.component.scss'
})
export class ShowProductsComponent implements OnInit {
  products:Product [] = [];
  query: string = '';
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  productIdToEdit: string = '';
  @Output() editStudent = new EventEmitter<string>(); 
  constructor(
    private productService: ProductService
  ) { }
  ngOnInit(): void {
    this.getAllProducts(); // Initially load all products
  }
  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
  }
  toggleEditModal(id: string) {
    this.productIdToEdit = id;
    this.isEditModalVisible = !this.isEditModalVisible;
    if (id !== null) {
      this.editStudent.emit(id); // Emit event with student ID
    }
    this.getAllProducts(); // Refresh products after editing
  }
  getAllProducts(searchQuery?: string): void {
    this.productService.getAllProducts().subscribe(products => {
      if (searchQuery && searchQuery.trim() !== '') {
        this.products = products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        this.products = products;
      }
      console.log("Filtered products", this.products);
    });
  }
  onInputChange(): void {
    console.log("Query changed", this.query);
    this.getAllProducts(this.query);
  }

  deleteProduct(id: string): void {
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.deleteProduct(id).subscribe(res => {
        this.getAllProducts(this.query); // Refresh products after deletion
      });
    }
  }
}

