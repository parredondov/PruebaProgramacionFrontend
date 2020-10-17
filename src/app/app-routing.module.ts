import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './_components/login/login.component';
import { PeliculasComponent } from './_components/peliculas/peliculas.component';
import { SignupComponent } from './_components/signup/signup.component';
import { WelcomeComponent } from './_components/welcome/welcome.component';
import { AuthGuard } from './_helpers/auth.guard';


const routes: Routes = [
  { path: '', component: PeliculasComponent, canActivate: [AuthGuard] },
  { path: 'peliculas', component: PeliculasComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
