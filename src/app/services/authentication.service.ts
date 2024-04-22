import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from '../consts';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { sha256 } from 'js-sha256';

export type SignupOrLoginResponse = {
  id: string;
  login: string;
  token: string;
};

export interface User extends UserModifiableFields {
  inserted_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserModifiableFields {
  login: string;
  display_name: string | null;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  gender: string | null;
  biography: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  _userDataSource = new BehaviorSubject<User | null>(null);
  userDataMessage$ = this._userDataSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  login(login: string, password: string) {
    const hashed_password = hashPassword(password);
    const body = {
      account: { login: login, hashed_password: hashed_password },
    };
    return (
      this.httpClient.post(`${SERVER_URL}accounts/login`, body, {
        withCredentials: true,
      }) as Observable<SignupOrLoginResponse>
    ).pipe(
      map((res) => {
        // this.token = res.token;
        this.getUserData().then((userData) => this.setUserData(userData));
        return res;
      }),
    );
  }

  signup(login: string, displayName: string, password: string) {
    const hashed_password = hashPassword(password);
    const body = {
      account: {
        login: login,
        display_name: displayName,
        hashed_password: hashed_password,
      },
    };
    return (
      this.httpClient.post(`${SERVER_URL}accounts/create`, body, {
        withCredentials: true,
      }) as Observable<SignupOrLoginResponse>
    ).pipe(
      map((res) => {
        this.getUserData().then((userData) => this.setUserData(userData));
        return res;
      }),
    );
  }

  logout() {
    return this.httpClient
      .post(`${SERVER_URL}accounts/logout`, {}, { withCredentials: true })
      .pipe(
        map((x) => {
          this._userDataSource.next(null);
          return x;
        }),
      );
  }

  getUserData() {
    const userData = this.httpClient.get(`${SERVER_URL}accounts/details`, {
      withCredentials: true,
    }) as Observable<User>;
    return firstValueFrom(userData);
  }

  setUserData(userData: User) {
    this._userDataSource.next(userData);
  }
}

export const hashPassword = (password: string) => {
  var hash = sha256.create();
  hash.update(password);
  return hash.hex();
};
