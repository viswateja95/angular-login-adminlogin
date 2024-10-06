import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  private loginStatusSubscription: Subscription | undefined;
  userRole: string| null = '';
  constructor(private authService: AuthServiceService,
    private router: Router
  ) {
    console.log(this.isLoggedIn);
   }

   ngOnInit():void{
    this.loginStatusSubscription = this.authService.loginStatus$.subscribe((isLoggedIn)=>{
      this.isLoggedIn = isLoggedIn;
      console.log("login status updated: ", this.isLoggedIn);
      })
     }
     login(){
      this.router.navigate(['/login']);
     }
  logout(){
    console.log("logout Initiated");
    this.authService.logout().subscribe({next:() =>{
      this.isLoggedIn = false;
      this.userRole
      this.router.navigate(['/login']);
    },
    error:(err)=>{
      console.log("failed logout", err);
    }
  })

  }
  ngDestroy():void{
    this.loginStatusSubscription?.unsubscribe();
  }



}

