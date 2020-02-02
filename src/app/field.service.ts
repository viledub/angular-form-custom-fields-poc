import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  
  private _fields: BehaviorSubject<FieldMetaData[]>;
  constructor() {
  	this._fields = new BehaviorSubject([
	  {
	  	type: 'text',
	  	label: 'Full name',
	  	name: 'name',
	  	placeholder: 'Enter your name',
	  	tooltip: 'A tooltip'
	  },
	  {
	  	type: 'text',
	  	label: 'Description',
	  	name: 'description',
	  	placeholder: 'Enter your description',
	  	tooltip: 'A tooltip'
	  },
	  {
	  	type: 'dropdown',
	  	label: 'Category',
	  	name: 'category',
	  	tooltip: 'A tooltip',
	  	options: [
	  		{ value: '1', label: 'Category Amhain'},
	  		{ value: '2', label: 'Category A do'},
	  		{ value: '3', label: 'Category a tri'},
	  	]
	  } 
  ]);
  }

  get fields() {
  	return this._fields.asObservable();
  }

  
}

export class LayoutEntry {
	constructor(public name: string) {}
}

export class FieldMetaData {
	type: string
	label: string
	name: string
	tooltip: string
}