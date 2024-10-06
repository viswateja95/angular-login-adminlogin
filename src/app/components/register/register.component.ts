import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registrationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthServiceService
  ) {
    // Define form controls with proper synchronous validators (inside arrays)
    this.registrationForm = this.formBuilder.group({
      id:['admin'],
      username: ['', [Validators.required, Validators.minLength(5)]],
      fullname: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      role: ['admin'],
      isActive: [false]
    }, {
      // Custom validator to check if passwords match
      validator: this.confirmedValidators('password', 'confirmPassword')
    });
  }

  // Custom validator function to compare password and confirmPassword
  confirmedValidators(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mismatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mismatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Submit handler
  confirmRegistration() {
    // Destructure confirmPassword out of form value
    const { confirmPassword, ...userDetails } = this.registrationForm.value;

    // If form is valid, submit data
    if (this.registrationForm.valid) {
      this.authService.createUser(userDetails).subscribe(
        (res) => {
          console.log('User created successfully!');
          this.router.navigate(['/login']);
        },
        (err) => {
          console.log('Error creating user:', err);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
