import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MaterialModule} from "../../material.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup-dialog.component.html',
  styleUrl: './signup-dialog.component.scss'
})
export class SignupDialog {
  login: string = '';
  password: string = '';

  submit(){
    console.log("submitting")
    // TODO: implement
  }
}
