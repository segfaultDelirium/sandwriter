import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MaterialModule, FormsModule, AsyncPipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent {
  constructor(
    private auth: AuthenticationService,
    public router: Router,
  ) {}

  goToAccountDetails() {
    this.router.navigateByUrl('account');
  }

  logout() {
    this.auth.logout().subscribe((x) => {});
  }
}
