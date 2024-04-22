import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModifiableFields } from '../../services/authentication.service';
import { SERVER_URL } from '../../consts';
import { Observable } from 'rxjs';

export type PasswordChange = {
  old_password: string;
  new_password: string;
  new_password_repeated: string;
};

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private httpClient: HttpClient) {}

  updateAccountDetails(userModifiableFields: UserModifiableFields) {
    return this.httpClient.post(
      `${SERVER_URL}accounts/change-details`,
      userModifiableFields,
      {
        withCredentials: true,
      },
    ) as Observable<any>;
  }

  updatePassword(password: PasswordChange) {
    return this.httpClient.post(
      `${SERVER_URL}accounts/change-password`,
      password,
      {
        withCredentials: true,
      },
    ) as Observable<any>;
  }
}
