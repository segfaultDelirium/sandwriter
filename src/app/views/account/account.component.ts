import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AuthenticationService,
  hashPassword,
  User,
} from '../../services/authentication.service';
import { catchError, Subscription } from 'rxjs';
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
  // userData: Observable<User | null> = of(null);
  userData: User | null = null;
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

  isOldPasswordCleartext: boolean = false;
  isNewPasswordCleartext: boolean = false;
  isNewPasswordRepeatedCleartext: boolean = false;
  @ViewChild('oldPasswordInput') oldPasswordInput!: ElementRef;
  @ViewChild('newPasswordInput') newPasswordInput!: ElementRef;
  @ViewChild('newPasswordRepeatedInput') newPasswordRepeatedInput!: ElementRef;

  constructor(
    private authService: AuthenticationService,
    private accountService: AccountService,
    private _snackBar: MatSnackBar,
  ) {}

  showOldPassword() {
    showPassword(this.oldPasswordInput);
    this.isOldPasswordCleartext = true;
  }

  hideOldPassword() {
    hidePassword(this.oldPasswordInput);
    this.isOldPasswordCleartext = false;
  }

  showNewPassword() {
    showPassword(this.newPasswordInput);
    this.isNewPasswordCleartext = true;
  }

  hideNewPassword() {
    hidePassword(this.newPasswordInput);
    this.isNewPasswordCleartext = false;
  }

  showNewPasswordRepeated() {
    showPassword(this.newPasswordRepeatedInput);
    this.isNewPasswordRepeatedCleartext = true;
  }

  hideNewPasswordRepeated() {
    hidePassword(this.newPasswordRepeatedInput);
    this.isNewPasswordRepeatedCleartext = false;
  }

  ngOnInit() {
    // console.log('in AccountComponent onInit');
    // this.userData = this.authService.userDataMessage$;
    const userData = this.authService._userDataSource.getValue();
    this.handleUserDataChange(userData);
    this.userDataSubscription = this.authService.userDataMessage$.subscribe(
      (userData) => {
        this.handleUserDataChange(userData);
      },
    );
  }

  handleUserDataChange(userData: User | null) {
    this.userData = userData;
    // console.log(
    //   `hello from handleUserDataChange, userData: ${JSON.stringify(userData)}`,
    // );
    if (userData === null) return;
    // debugger;
    this.accountDetailsFormGroup.controls.login.setValue(userData.login);
    this.accountDetailsFormGroup.controls.displayName.setValue(
      userData.displayName,
    );
    this.accountDetailsFormGroup.controls.biography.setValue(
      userData.biography,
    );
    this.accountDetailsFormGroup.controls.email.setValue(userData.email);
    this.accountDetailsFormGroup.controls.fullName.setValue(userData.fullName);
    this.accountDetailsFormGroup.controls.gender.setValue(userData.gender);
    this.accountDetailsFormGroup.controls.phoneNumber.setValue(
      userData.phoneNumber,
    );
    this.accountDetailsFormGroup.markAsPristine();
    this.onAccountDetailsFormValueChange();
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
    this.accountService
      .updateAccountDetails(payload)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          if (e.status === 409) {
            this.openSnackBar(e.error, 'ok');
          }
          throw e;
        }),
      )
      .subscribe((x) => {
        this.openSnackBar('update successful', 'ok');
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
      oldPassword: hashPassword(
        this.passwordFormGroup.controls.oldPassword.value!,
      ),
      newPassword: hashPassword(
        this.passwordFormGroup.controls.newPassword.value!,
      ),
      newPasswordRepeated: hashPassword(
        this.passwordFormGroup.controls.newPasswordRepeated.value!,
      ),
    };
    return this.accountService
      .updatePassword(passwordChange)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.openSnackBar(e.error.errors, 'ok');
          throw e;
        }),
      )
      .subscribe((x) => {
        console.log(x);
        this.openSnackBar('updating password successful', 'ok');
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}

function showPassword(input: ElementRef) {
  const inputElement: HTMLInputElement = input.nativeElement;
  inputElement.type = 'text';
}

function hidePassword(input: ElementRef) {
  const inputElement: HTMLInputElement = input.nativeElement;
  inputElement.type = 'password';
}
