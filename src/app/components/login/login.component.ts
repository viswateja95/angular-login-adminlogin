import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthServiceService
  ){}
loginForm = this.formBuilder.group({
  id:['',[Validators.required, Validators.minLength(5)]],
  password:['',[Validators.required, Validators.minLength(5)]],
})

confirmLogin(){
  console.log("logging in");
  if(this.loginForm.valid){
    const loginId = this.loginForm.value.id!;
    const loginPassword = this.loginForm.value.password!;
    this.authService.login(loginId, loginPassword).subscribe(
      (res)=>{
      if(res.success){

        this.router.navigate(['/home']);
      }else{
        console.log(res.message);
      }
    }),(error:any)=>{
      console.log(error);
    }
  }

}

}
