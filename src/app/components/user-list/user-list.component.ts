import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { User } from '../../types/user';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  constructor(private authService: AuthServiceService,
    private router: Router
  ){}
users: User[] =[];
ngOnInit():void{
  this.authService.getAllUsers().subscribe((users: User[])=>{
    this.users = users;
  },
  (error:any)=>{
    console.error("error fetching user list:", error);
  }
);
}
goHome(){
  this.router.navigate(['/home']);

}

}
