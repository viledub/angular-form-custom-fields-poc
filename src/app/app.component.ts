import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dynamic-forms';
  layout = [
  { name: 'name' },
  { name: 'description' },
  // { name: 'category' },
  ];

  schema: FieldMetaData[] = [
	  {
	  	type: 'text',
	  	label: 'Full name',
	  	name: 'name',
	  	placeholder: 'Enter your name',
	  	tooltip: 'A tooltip'
	  } as TextFieldMetaData ,
	  {
	  	type: 'text',
	  	label: 'Description',
	  	name: 'description',
	  	placeholder: 'Enter your description',
	  	tooltip: 'A tooltip'
	  } as TextFieldMetaData,
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
	  } as OptionFieldMetaData 
  ]
  data = [
    {
      name: 'name'
    },
    {
      name: 'description',
      value: 'Dunno'
    },
    {
      name: 'category',
      value: '1'
    }
  ];
  config = this.compose(this.layout, this.schema, this.data);

  compose(layout, schema, data) {
  	const schemaLayout = layout.map(chosenField => schema.find(schemaItem => schemaItem.name === chosenField.name));
  	
  	const present = schemaLayout.map((chosenField) => {
		const resolvedData = data.find(dataItem => dataItem.name === chosenField.name);
		return { ...chosenField, ...resolvedData }
	});
	console.log(present);
  	return present;
  }
}

export interface FieldMetaData {
	type: string
	label: string
	name: string
	tooltip: string
}

export interface TextFieldMetaData extends FieldMetaData {
	placeholder: string
}

export interface OptionFieldMetaData extends FieldMetaData {
	options: any[]
}