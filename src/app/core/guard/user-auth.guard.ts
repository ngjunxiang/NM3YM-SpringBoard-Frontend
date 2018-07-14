import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class UserAuthGuard implements CanActivate {

    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // this.authService.authenticate(localStorage.getItem('JSESSIONID')).subscribe( result => {
            if (true && localStorage.getItem('USERTYPE') === 'user') return true;
        // });
        this.router.navigate(['/login'], { 
            queryParams: { 
                returnUrl: state.url,
                err: 'auth001' 
            } 
        });
        return false;
    }
}
