import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AuthenticationService,
  hashPassword,
  User,
  UserModifiableFields,
} from '../../services/authentication.service';
import { catchError, Observable, Subscription } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AccountService, PasswordChange } from './account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    AsyncPipe,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AccountComponent implements OnInit, OnDestroy {
  userData: Observable<User> | null = null;
  userDataSubscription?: Subscription;

  accountDetailsFormGroup = new FormGroup({
    login: new FormControl<string>(''),
    displayName: new FormControl<string>(''),
    fullName: new FormControl<string>(''),
    email: new FormControl<string>(''),
    phoneNumber: new FormControl<string>(''),
    gender: new FormControl<string>(''),
    biography: new FormControl<string>(''),
  });

  hasAccountDetailsChanged: boolean = false;
  accountDetailsFormGroupSubscription?: Subscription;

  passwordFormGroup = new FormGroup({
    oldPassword: new FormControl<string>(''),
    newPassword: new FormControl<string>(''),
    newPasswordRepeated: new FormControl<string>(''),
  });

  passwordChangeResponseMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private accountService: AccountService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.userData = this.authService.userDataMessage$;
    this.userDataSubscription = this.userData.subscribe((userData) => {
      this.accountDetailsFormGroup.controls.login.setValue(userData.login);
      this.accountDetailsFormGroup.controls.displayName.setValue(
        userData.display_name,
      );
      this.accountDetailsFormGroup.controls.biography.setValue(
        userData.biography,
      );
      this.accountDetailsFormGroup.controls.email.setValue(userData.email);
      this.accountDetailsFormGroup.controls.fullName.setValue(
        userData.full_name,
      );
      this.accountDetailsFormGroup.controls.gender.setValue(userData.gender);
      this.accountDetailsFormGroup.controls.phoneNumber.setValue(
        userData.phone_number,
      );
      this.accountDetailsFormGroup.markAsPristine();
      this.onAccountDetailsFormValueChange();
    });
  }

  ngOnDestroy() {
    this.accountDetailsFormGroupSubscription?.unsubscribe();
  }

  onAccountDetailsFormValueChange() {
    const initialValue = this.accountDetailsFormGroup.value;
    this.accountDetailsFormGroupSubscription =
      this.accountDetailsFormGroup.valueChanges.subscribe((value) => {
        this.hasAccountDetailsChanged = Object.keys(initialValue).some(
          // @ts-ignore
          (key) => this.accountDetailsFormGroup.value[key] != initialValue[key],
        );
      });
  }

  updateAccountDetails() {
    const payload = JSON.parse(
      JSON.stringify(this.accountDetailsFormGroup.value),
    );
    console.log(payload);
    const payloadSnakeCase: UserModifiableFields = {
      login: payload.login,
      display_name: payload.displayName,
      full_name: payload.fullName,
      email: payload.email,
      phone_number: payload.phoneNumber,
      gender: payload.gender,
      biography: payload.biography,
    };
    this.accountService
      .updateAccountDetails(payloadSnakeCase)
      .subscribe((x) => {
        console.log(x);
      });
  }

  canUpdateAccountDetails() {
    // return this.accountDetailsFormGroup.pristine;
    return this.hasAccountDetailsChanged;
  }

  canUpdatePassword() {
    const isOldPasswordFilled =
      this.passwordFormGroup.controls.oldPassword.value !== '';
    const isNewPasswordFilled =
      this.passwordFormGroup.controls.newPassword.value !== '';
    const areNewPasswordsEqual =
      this.passwordFormGroup.controls.newPassword.value ===
      this.passwordFormGroup.controls.newPasswordRepeated.value;
    // debugger;
    return isOldPasswordFilled && isNewPasswordFilled && areNewPasswordsEqual;
  }

  updatePassword() {
    const passwordChange: PasswordChange = {
      old_password: hashPassword(
        this.passwordFormGroup.controls.oldPassword.value!,
      ),
      new_password: hashPassword(
        this.passwordFormGroup.controls.newPassword.value!,
      ),
      new_password_repeated: hashPassword(
        this.passwordFormGroup.controls.newPasswordRepeated.value!,
      ),
    };
    return this.accountService
      .updatePassword(passwordChange)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          // this.passwordChangeResponseMessage = e.error.errors;
          this.openSnackBar(e.error.errors, 'ok');
          throw e;
        }),
      )
      .subscribe((x) => {
        console.log(x);
        // this.passwordChangeResponseMessage = 'updating password successful';
        this.openSnackBar('updating password successful', 'ok');
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
