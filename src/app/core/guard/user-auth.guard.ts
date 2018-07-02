import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {

    constructor(
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (localStorage.getItem('currentUser') === 'validUser') {
            if (localStorage.getItem('userType') === 'user') return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url}});
        return false;
    }
}
