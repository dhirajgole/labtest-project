import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LabtestComponent } from '../labtest/labtest.component';

@Component({
  selector: 'app-small-navbar',
  standalone: true,
  imports: [LabtestComponent],
  templateUrl: './small-navbar.component.html',
  styleUrl: './small-navbar.component.css'
})
export class SmallNavbarComponent {

  constructor(private router: Router) {

  }
  
  lab() {
    this.router.navigate(['/labtest']);
  }
  med() {
    this.router.navigate(['/medicines']);
  }
  insur() {
    this.router.navigate(['/insurance']);
  }
}
