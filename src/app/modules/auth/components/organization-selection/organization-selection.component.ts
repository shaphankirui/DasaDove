import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../../../../shared/Services/auth.service';
import { Organization } from '../../../../shared/interfaces/orginization.inteface';

@Component({
  selector: 'app-organization-selection',
  templateUrl: './organization-selection.component.html',
  styleUrl: './organization-selection.component.scss'
})
export class OrganizationSelectionComponent implements OnInit {
  organizations: Organization[] = [];
  logedOrg:any;
  savedOrg:any;
  selectedOrganization: Organization | null = null;
  org_code: string = ''; // Define verificationCode property
  showLogin: boolean = false;


  constructor(
    private router: Router,
    private toast: HotToastService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.getSavedOrgIdOnLocalStorage();
  }

  getAllOrg() {
    this.authService.getAllOrg().subscribe((orgs: any[]) => {
      this.organizations = orgs.map((org) => ({
        id: org.id,
        name: org.data.name,
        org_code: org.data.org_code,
        email: org.data.email,
        location: org.data.location,
        address: org.data.address,
        phone: org.data.phone
      }));

      this.logedOrg = this.organizations.find(org => org.org_code === this.org_code);
      
      if (this.logedOrg) {
        localStorage.setItem('selectedOrgId', this.logedOrg.id);
        this.getSavedOrgIdOnLocalStorage();
        // Set showLogin to true only if the organization ID is found in local storage
        if (this.savedOrg === this.logedOrg.id) {
          this.showLogin = true;
        } else {
          this.toast.error('Organization ID not found in local storage');
        }
      } else {
        this.toast.error('The organization code does not exist or is incorrect');
      }
    });
  }
  
  getSavedOrgIdOnLocalStorage(): void {
    this.savedOrg = localStorage.getItem('selectedOrgId');
    console.log('saved id on storage', this.savedOrg);
  }

  onSubmit() {
    if (this.org_code) {
      console.log('Selected organization:', this.org_code);
      this.getAllOrg();
    } else {
      this.toast.error('Please select an organization');
    }
  }
}
