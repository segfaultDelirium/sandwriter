import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string){

  }

  signup(username: string, password: string){
    this.httpClient.post(`${SERVER_URL}signup`, {username: username, password: password})
  }
}
