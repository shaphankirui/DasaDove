import { Component, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class MainLayoutComponent {
  showSidebar = true;
  // activeNavLinks: { [key: string]: boolean } = {};
  isMenuOpen: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMenuOpen = window.innerWidth >= 768;
  }
  activeNavLinks: { [key: string]: boolean } = {
    Sales: false,
    inventory: false,
    reports: false,
    // Add other nav links here if needed
  };

  toggleSublinks(link: string) {
    this.activeNavLinks[link] = !this.activeNavLinks[link];
  }
  // toggleSublinks(navLink: any) {
  //   if (navLink.sublinks) {
  //     this.activeNavLinks[navLink.navName] = !this.activeNavLinks[navLink.navName];
  //   }
  // }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    console.log(this.showSidebar);
  }
}
