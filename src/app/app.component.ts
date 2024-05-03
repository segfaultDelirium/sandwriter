import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { MaterialModule } from './material.module';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'sandwriter';

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    this.authService.queryUserDataAndSetItPipe();
  }
}
