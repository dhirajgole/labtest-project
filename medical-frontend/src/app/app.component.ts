import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SmallNavbarComponent } from './small-navbar/small-navbar.component';
import { MainpageComponent } from "./mainpage/mainpage.component";
import { FooterComponent } from './footer/footer.component';
import { LabtestComponent } from './labtest/labtest.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SmallNavbarComponent, MainpageComponent, FooterComponent, LabtestComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'medical-frontend';

  showfooter : boolean = true;
  constructor(private router : Router){
    this.router.events.subscribe((event)=>{
      const currentroute = this.router.url;
      this.showfooter = !(currentroute.includes("login") || currentroute.includes("register"))
    })
  }
}
