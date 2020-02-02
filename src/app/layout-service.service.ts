import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FieldMetaData } from './app.component';
import { FieldService } from './field.service';
@Injectable({
  providedIn: 'root'
})
export class LayoutServiceService {

  
  private _fields: BehaviorSubject<LayoutEntry[]>;

  constructor(private fieldService: FieldService) {
  	this._fields = new BehaviorSubject([
	  { name: 'name' },
	  { name: 'description' },
      { name: 'category' },
  ]);
  }

  get fields() {
  	return this._fields.asObservable();
  }

  addField(field: FieldMetaData) {
  	const cur = this._fields.value;
  	if (! cur.find(item => field.name === item.name)) {
	  	const nextVal = cur.concat([new LayoutEntry(field.name)]);
	  	this._fields.next(nextVal)
  	}
  }

  removeField(field: FieldMetaData) {
  	const cur = this._fields.value;
  	const nextVal = cur.filter(currentField => currentField.name !== field.name)
  	this._fields.next(nextVal);
  }
}

export class LayoutEntry {
	constructor(public name: string) {}
}