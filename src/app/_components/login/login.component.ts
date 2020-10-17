import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})export class LoginComponent /*implements OnInit*/ {
  loginForm = this.fb.group({
    userName: [null, Validators.required],
    password: [null, Validators.required]
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
}

get f() { return this.loginForm.controls; }

ngOnInit() {
  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
  this.authenticationService.login(this.f.userName.value, this.f.password.value)
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

