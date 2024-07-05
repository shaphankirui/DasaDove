import { Component } from '@angular/core';
import { UserInterface } from '../../../../shared/interfaces/auth.interface';
import { AuthService } from '../../../../shared/Services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  users: UserInterface[] = [];
  constructor(private authService: AuthService) {}
  ngOnInit(): void {}
}
