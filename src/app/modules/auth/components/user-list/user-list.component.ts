import { Component } from '@angular/core';
import {
  UserInterface,
  UserRolesEnum,
} from '../../../../shared/interfaces/auth.interface';
import { AuthService } from '../../../../shared/Services/auth.service';
import { initFlowbite } from 'flowbite';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  users: UserInterface[] = [];
  isModalOpen: boolean = false;
  userDetails: UserInterface = {
    fullName: '',
    id: '',
    email: '',
    username: '',
    phone: '',
    role: '', // Assuming you have a default role
    createdBy: '',
    // Initialize other required fields
  };
  constructor(
    private authService: AuthService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngAfterViewInit() {
    initFlowbite();
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  getAllUsers() {
    this.authService.getAllUsers().subscribe((users: UserInterface[]) => {
      this.users = users;
    });
  }
  addUser() {
    console.log('user details', this.userDetails);
    this.authService.createUser(this.userDetails).subscribe(
      (user: UserInterface) => {
        this.toast.success('User created successfully');
        this.toggleModal();
        this.getAllUsers();
        this.resetForm();
      },
      (error) => {
        this.toast.error('Error creating user');
        console.log(error);
      }
    );

  }
  resetForm() {
    this.userDetails = {
      fullName: '',
      id: '',
      email: '',
      username: '',
      phone: '',
      role: '',
      createdBy: '',
      // Reset other fields as needed
    };
  }
}
