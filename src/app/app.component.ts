import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonThumbnail, IonPopover, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, personOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonMenu, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonNote, IonRouterOutlet, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonThumbnail, IonPopover, IonAvatar],
})
export class AppComponent {

  isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService) {
    authService.isAuthenticated.subscribe(x => {
      this.isAuthenticated = x;
      if (!this.isAuthenticated) {
        this.router.navigate(['login'], { replaceUrl: true });
      }
    })

    addIcons({ personOutline, logOutOutline });
  }

  Logout() {
    this.authService.logout();
  }
}
