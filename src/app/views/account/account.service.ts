import { Injectable } from '@angular/core';
import { SERVER_URL } from '../../consts';
import { Observable } from 'rxjs';
import { User } from '../../services/authentication.service';
import { HttpService } from '../../services/http.service';

export type PasswordChange = {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeated: string;
};

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private httpService: HttpService) {}

  updateAccountDetails(userModifiableFields: User) {
    return this.httpService.post(
      `${SERVER_URL}accounts/change-details`,
      userModifiableFields,
      {
        withCredentials: true,
      },
    ) as Observable<any>;
  }

  updatePassword(password: PasswordChange) {
    return this.httpService.post(
      `${SERVER_URL}accounts/change-password`,
      password,
      {
        withCredentials: true,
      },
    ) as Observable<any>;
  }
}
