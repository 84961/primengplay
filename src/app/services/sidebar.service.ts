import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
    interface Window {
        sidebarManager: any;
        openProductSidebar: (data: any) => void;
    }
}

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    constructor(private router: Router) {
        // Listen to route changes
        this.router.events.pipe(
            filter(event => event instanceof NavigationStart)
        ).subscribe(() => {
            this.closeSidebar();
        });
    }

    openSidebar(data: any): void {
        if (window.sidebarManager) {
            window.sidebarManager.openSidebar(data);
        }
    }

    closeSidebar(): void {
        if (window.sidebarManager) {
            window.sidebarManager.closeSidebar();
        }
    }
}