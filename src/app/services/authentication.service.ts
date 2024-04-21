import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SERVER_URL} from "../consts";
import {firstValueFrom, map, Observable} from "rxjs";
import {sha256} from "js-sha256";
import {Option} from 'effect';

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
  deleted_at: string | null,
  phone_number: string | null,
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  token: string = '';
  userData: Option.Option<User> = Option.none();

  constructor(private httpClient: HttpClient) { }

  login(login: string, password: string){
    const hashed_password = hashPassword(password)
    const body = { account: {login: login, hashed_password: hashed_password}};
    return (this.httpClient.post(`${SERVER_URL}accounts/login`, body, {withCredentials: true}) as Observable<SignupOrLoginResponse>).pipe(
      map(res => {
        this.token = res.token;
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
        return res;
      })
    )
  }

  isLoggedIn(){
    return this.token !== '';
  }

  async getUserData(){
    if(Option.isNone(this.userData)){
      const token = this.token;
      const headers = {'Authorization': `Bearer ${token}`};
      const userData = await firstValueFrom(this.httpClient.get(`${SERVER_URL}accounts/details`, {headers, withCredentials: true} ) as Observable<User>)
      this.userData = Option.some(userData);
    }
    return this.userData;
  }
}

const hashPassword = (password: string) => {
  var hash = sha256.create()
  hash.update(password)
  return hash.hex();
}
