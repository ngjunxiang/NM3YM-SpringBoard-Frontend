import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class CMAuthGuard implements CanActivate {

    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.authenticate('CM').then(res => {
            if (res.results === 'success' &&  localStorage.getItem('USERTYPE') === 'CM') {
                return true;
            }
            if (res.error === 'Invalid Token' || res.error === 'Token has expired') {
                this.router.navigate(['/login'], {
                    queryParams: {
                        err: 'auth001'
                    }
                });
                return false;
            }

            if (res.error === 'Invalid userType') {
                this.router.navigate(['/' + localStorage.getItem('USERTYPE').toLowerCase() + '/dashboard'], {
                    queryParams: {
                        err: 'auth001'
                    }
                });
                return false;
            }
        });
    }
}
