import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SERVER_URL} from "../consts";
import {firstValueFrom, map, Observable, Subject} from "rxjs";
import {sha256} from "js-sha256";

export type SignupOrLoginResponse = {
  id: string,
  login: string,
  token: string
}

export type User = {
  login: string,
  email: string | null,
  display_name: string | null,
  full_name: string | null,
  gender: string | null,
  biography: string | null,
  inserted_at: string,
  updated_at: string,
  deleted_at: string | null,
  phone_number: string | null,
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  token: string = '';

  constructor(private httpClient: HttpClient) { }

  login(login: string, password: string){
    const hashed_password = hashPassword(password)
    const body = { account: {login: login, hashed_password: hashed_password}};
    return (this.httpClient.post(`${SERVER_URL}accounts/login`, body, {withCredentials: true}) as Observable<SignupOrLoginResponse>).pipe(
      map(res => {
        this.token = res.token;
        this.getUserData(res.token).then(userData => this.setUserData(userData));
        return res;
      })
    )
  }

  signup(login: string, displayName: string, password: string){
    const hashed_password = hashPassword(password)
    const body = { account: {login: login, display_name: displayName, hashed_password: hashed_password}}
    return (this.httpClient.post(`${SERVER_URL}accounts/create`, body, {withCredentials: true}) as Observable<SignupOrLoginResponse>).pipe(
      map(res => {
        this.token = res.token;
        this.getUserData(res.token).then(userData => this.setUserData(userData));
        return res;
      })
    )
  }

  getTokenFromBackend(){
    const res = (this.httpClient.get(`${SERVER_URL}accounts/get-token`, {withCredentials: true}) as Observable<string>).pipe(
      map(token => {
        this.token = token;

        return token;
    }));
    return firstValueFrom(res)
  }

  getUserData(token: string){
    const headers = {'Authorization': `Bearer ${token}`};
    const userData = this.httpClient.get(`${SERVER_URL}accounts/details`, {headers, withCredentials: true} ) as Observable<User>
    return firstValueFrom(userData);
    // return userData;
  }

  private _userDataSource = new Subject<User>();
  userDataMessage$ =
    this._userDataSource.asObservable();

  setUserData(userData: User) {
    this._userDataSource.next(userData);
  }
}

const hashPassword = (password: string) => {
  var hash = sha256.create()
  hash.update(password)
  return hash.hex();
}
