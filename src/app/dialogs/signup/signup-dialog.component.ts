import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MaterialModule} from "../../material.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup-dialog.component.html',
  styleUrl: './signup-dialog.component.scss'
})
export class SignupDialog {
  login: string = '';
  displayName: string = '';
  password: string = '';
  errorMessage = '';

  constructor(private auth: AuthenticationService, private dialogRef: MatDialogRef<SignupDialog>) {}

  canSubmit(): boolean{
    return this.login.trim() !== "" && this.displayName !== "" && this.password !== ""
  }

  submit(){
    this.auth.signup(this.login, this.displayName, this.password).pipe(catchError( (error: HttpErrorResponse) => {
      if(error.status === 409){
        this.errorMessage = error.error
      }
      throw error;
    })).subscribe(response => {
      console.log(response)
      // TODO: update the login status on header
      this.dialogRef.close()
    })
  }
}
