import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})

export class RMAuthGuard implements CanActivate {

    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // this.authService.authenticate().subscribe( result => {
            if (true && localStorage.getItem('USERTYPE') === 'RM') return true;
        // });
        
        this.router.navigate(['/' + localStorage.getItem('USERTYPE').toLowerCase() + '/dashboard'], { 
            queryParams: { 
                err: 'auth001' 
            } 
        });
        
        return false;
    }
}
