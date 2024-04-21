import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./layout/header/header.component";
import {MaterialModule} from "./material.module";
import {SampleBackendService} from "./sample-backend-service/sample-backend.service";
import {AuthenticationService} from "./services/authentication.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'sandwriter';
  // userData: User | null = null;

  constructor(private sampleBackendService: SampleBackendService, private authService: AuthenticationService) {}
  getUsers(){
    this.sampleBackendService.getUsers().subscribe(x => {
      console.log(x);
    })
  }

  ngOnInit() {
    this.getTokenFromBackend();
  }

  async getTokenFromBackend(){
    // const res = this.authService.getTokenFromBackend().pipe(map(token => {
    //   return this.authService.getUserData(token)
    // }));
    const res = await this.authService.getTokenFromBackend().then(token => this.authService.getUserData(token))
    this.authService.setUserData(res);
    // this.userData = res;
  }
}
