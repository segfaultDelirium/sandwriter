import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../material.module";
import {FormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {LoginDialog} from "../../dialogs/login/login-dialog.component";
import {SignupDialog} from "../../dialogs/signup/signup-dialog.component";
import {AuthenticationService, User} from "../../services/authentication.service";
import {Option} from "effect";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  userData: Option.Option<User> = Option.none();
  searchedText: string = '';

  constructor(
    public dialog: MatDialog,
    private auth: AuthenticationService
    ){}

  async ngOnInit() {
    if(this.isLoggedIn()){
      this.userData = await this.auth.getUserData();
      console.log(this.userData)
    }
    console.log(this.userData)
  }


  search(){
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

  isLoggedIn(){
    return this.auth.isLoggedIn()
  }

  async setUserData(){
    this.userData = await this.auth.getUserData();
  }

  protected readonly Option = Option;
}
