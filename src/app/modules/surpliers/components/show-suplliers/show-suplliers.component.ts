import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SuppliersService } from '../../../../shared/Services/suppliers.service';
import { Supplier } from '../../../../shared/interfaces/supplier.interface';

@Component({
  selector: 'app-show-suplliers',
  templateUrl: './show-suplliers.component.html',
  styleUrl: './show-suplliers.component.scss',
})
export class ShowSuplliersComponent implements OnInit {
  suppliers: Supplier[] = [];
  query: string = '';
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  supllierIdToEdit: string = '';
  @Output() editStudent = new EventEmitter<string>();
  constructor(private suppliersService: SuppliersService) {}
  ngOnInit(): void {
    this.getAllSupplier();
  }
  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
    this.getAllSupplier();
  }
  toggleEditModal(id: string) {
    this.supllierIdToEdit = id;
    this.isEditModalVisible = !this.isEditModalVisible;
    if (id !== null) {
      this.editStudent.emit(id); // Emit event with student ID
    }
    this.getAllSupplier(); // Refresh products after editing
  }
  getAllSupplier(searchQuery?: string) {
    this.suppliersService.getAllSupplier().subscribe(
      (data: Supplier[]) => {
        if (searchQuery && searchQuery.trim() !== '') {
          this.suppliers = data.filter(supplier =>
            supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            supplier.phone.toLowerCase().includes(searchQuery.toLowerCase())
            );
            } else {
              this.suppliers = data;
            }
          },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onInputChange(): void {
    console.log("Query changed", this.query);
    this.getAllSupplier(this.query);
  }
}
