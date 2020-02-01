import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit {
  config;
  group: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
