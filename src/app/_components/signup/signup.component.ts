import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map, startWith } from 'rxjs/operators';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})export class SignupComponent /*implements OnInit*/ {
  loginForm = this.fb.group({
    userName: [null, Validators.required],
    password: [null, Validators.required],
    confirmPassword: [null, Validators.required]
  });
  loading = false;
  submitted = false;
  returnUrl: string;

  hasUnitNumber = false;

constructor(
  private fb: FormBuilder,
  private route: ActivatedRoute,
  private router: Router,
  private authenticationService: AuthenticationService,
  private alertService: AlertService
) {
  // redirect to home if already logged in
  if (this.authenticationService.currentUserValue) {
    this.router.navigate(['/']);
  }


  this.f.confirmPassword.valueChanges.pipe(
    startWith(null),
    map(value => {
        if(value != this.f.password.value){
          this.f.confirmPassword.setErrors({valido: true});
      }})
  );

}

get f() { return this.loginForm.controls; }

ngOnInit() {
}

onSubmit() {
  this.loading = true;
  this.submitted = true;

  // reset alerts on submit
  this.alertService.clear();

  // stop here if form is invalid
  if (this.loginForm.invalid) {
      return;
  }

  this.loading = true;
  this.authenticationService.signup(this.f.userName.value, this.f.password.value)
      .pipe(first())
      .subscribe(
          data => {
              this.router.navigate([this.returnUrl]);
          },
          error => {
              //this.alertService.snack("Error de usuario y/o contraseña");
              this.alertService.snack(error);
              this.loading = false;
          });
}

}

