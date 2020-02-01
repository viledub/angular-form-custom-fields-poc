import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-option-field',
  templateUrl: './option-field.component.html',
  styleUrls: ['./option-field.component.scss']
})
export class OptionFieldComponent implements OnInit {
  config;
  group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
