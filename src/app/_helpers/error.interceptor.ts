import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { AlertService } from '../_services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router, private alertService: AlertService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log('NEXT', next);
            console.log('REQUEST', request);
            console.log('ERROR INTERCEPTOR', err);
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                //this.authenticationService.logout();
                //this.router.navigate(['/login']);
                this.alertService.snack("El token no es válido o ha expirado");
            }else if(err.status === 0){
                this.alertService.snack("Ocurrió un error.");
            }else{
                if(err.error.message)
                    return throwError(err.error.message);
                    if(err.error)
                    return throwError(err.error);
                    if(err)
                    return throwError(err);
            }
        }))
    }
}