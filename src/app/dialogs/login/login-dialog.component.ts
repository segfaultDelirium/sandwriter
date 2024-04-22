import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
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
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialog {
  login: string = '';
  password: string = '';
  errorMessage = '';

  constructor(
    private auth: AuthenticationService,
    private dialogRef: MatDialogRef<LoginDialog>,
  ) {}

  canSubmit(): boolean {
    return this.login.trim() !== '' && this.password !== '';
  }

  submit() {
    this.auth
      .login(this.login, this.password)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage = 'Wrong username or password.';
          }
          throw error;
        }),
      )
      .subscribe((response) => {
        console.log(response);
        this.dialogRef.close();
      });
  }
}
