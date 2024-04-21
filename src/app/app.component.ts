import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./layout/header/header.component";
import {MaterialModule} from "./material.module";
import {SampleBackendService} from "./sample-backend-service/sample-backend.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sandwriter';

  constructor(private sampleBackendService: SampleBackendService) {}
  getUsers(){
    this.sampleBackendService.getUsers().subscribe(x => {
      console.log(x);
    })
  }
}
