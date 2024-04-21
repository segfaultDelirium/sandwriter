import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SERVER_URL} from "../consts";
import {map, Observable} from "rxjs";
import {sha256} from "js-sha256";

export type SignupOrLoginResponse = {
  id: string,
  login: string,
  token: string
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
    return (this.httpClient.post(`${SERVER_URL}accounts/login`, body) as Observable<SignupOrLoginResponse>).pipe(
      map(res => {
        this.token = res.token;
        return res;
      })
    )
  }

  signup(login: string, displayName: string, password: string){
    const hashed_password = hashPassword(password)
    const body = { account: {login: login, display_name: displayName, hashed_password: hashed_password}}
    return (this.httpClient.post(`${SERVER_URL}accounts/create`, body) as Observable<SignupOrLoginResponse>).pipe(
      map(res => {
        this.token = res.token;
        return res;
      })
    )
  }
}

const hashPassword = (password: string) => {
  var hash = sha256.create()
  hash.update(password)
  return hash.hex();
}
