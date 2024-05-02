import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../../dialogs/login/login-dialog.component';
import { SignupDialog } from '../../dialogs/signup/signup-dialog.component';
import {
  AuthenticationService,
  User,
} from '../../services/authentication.service';
import { Option } from 'effect';
import { Observable, of } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, FormsModule, AsyncPipe, MenuComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  // encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() userData: Observable<User | null> = of(null);
  searchedText: string = '';
  protected readonly Option = Option;

  constructor(
    public dialog: MatDialog,
    private auth: AuthenticationService,
    public router: Router,
  ) {}

  async ngOnInit() {
    this.userData = this.auth.userDataMessage$;
  }

  search() {
    console.log(`searching ${this.searchedText}`);
    // TODO: implement
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((_result) => {
      console.log('The dialog was closed');
      this.setUserData();
      // this.animal = result;
    });
  }

  openSignupDialog(): void {
    const dialogRef = this.dialog.open(SignupDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((_result) => {
      console.log('The dialog was closed');
      this.setUserData();
      // this.animal = result;
    });
  }

  async setUserData() {
    // this.userData = await this.auth.getUserData();
    // this.use
  }
}
