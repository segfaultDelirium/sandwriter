import { Component } from '@angular/core';
import {MaterialModule} from "../../material.module";
import {FormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {LoginDialog} from "../../dialogs/login/login-dialog.component";
import {SignupDialog} from "../../dialogs/signup/signup-dialog.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    public dialog: MatDialog){}

  searchedText: string = '';


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
      // this.animal = result;
    });
  }

  openSignupDialog(): void {
    const dialogRef = this.dialog.open(SignupDialog, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((_result) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
