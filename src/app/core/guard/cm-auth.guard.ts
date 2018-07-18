import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

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
        // this.authService.authenticate().subscribe( result => {
            if (true && localStorage.getItem('USERTYPE') === 'CM') return true;
        // });
        
        this.router.navigate(['/' + localStorage.getItem('USERTYPE').toLowerCase()], { 
            queryParams: { 
                err: 'auth001' 
            } 
        });
        
        return false;
    }
}
