import { Injectable } from '@angular/core';
import { SERVER_URL } from '../consts';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { sha256 } from 'js-sha256';
import { HttpService } from './http.service';
import { Timestamps } from '../types';

export type SignupOrLoginResponse = {
  id: string;
  login: string;
};

export interface User extends UserModifiableFields, Timestamps {
  id: string;
}

export interface UserModifiableFields {
  login: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  gender: string | null;
  biography: string | null;
  displayName: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  _userDataSource = new BehaviorSubject<User | null>(null);
  userDataMessage$ = this._userDataSource.asObservable();
  isLoggedIn = false;

  constructor(private httpService: HttpService) {}

  public login(login: string, password: string) {
    const hashedPassword = hashPassword(password);
    const body = {
      account: { login: login, hashedPassword: hashedPassword },
    };
    return (
      this.httpService.post(
        `${SERVER_URL}accounts/login`,
        body,
      ) as Observable<SignupOrLoginResponse>
    ).pipe(map((x) => this.queryUserDataAndSetItPipe(x)));
  }

  public signup(login: string, displayName: string, password: string) {
    const hashed_password = hashPassword(password);
    const body = {
      account: {
        login: login,
        displayName: displayName,
        hashedPassword: hashed_password,
      },
    };
    return (
      this.httpService.post(
        `${SERVER_URL}accounts/create`,
        body,
      ) as Observable<SignupOrLoginResponse>
    ).pipe(map((x) => this.queryUserDataAndSetItPipe(x)));
  }

  public logout() {
    return this.httpService
      .post(`${SERVER_URL}accounts/logout`, {})
      .pipe(map((x) => this.clearUserDataPipe(x)));
  }

  public queryUserDataAndSetItPipe(x?: any) {
    this.queryUserData().then((userData) => this.setUserData(userData));
    return x;
  }

  private clearUserDataPipe(x?: any) {
    this._userDataSource.next(null);
    this.isLoggedIn = false;
    return x;
  }

  private queryUserData() {
    const userData = this.httpService.get(
      `${SERVER_URL}accounts/details`,
    ) as Observable<User>;
    return firstValueFrom(userData);
  }

  private setUserData(userData: User) {
    this._userDataSource.next(userData);
    this.isLoggedIn = true;
  }
}

export const hashPassword = (password: string) => {
  var hash = sha256.create();
  hash.update(password);
  return hash.hex();
};
