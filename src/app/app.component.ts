import { Component } from '@angular/core';
import { LayoutServiceService } from './layout-service.service'
import { FieldService } from './field.service'
import { ComposerService } from './composer.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dynamic-forms';
  layout = [];

  schema: FieldMetaData[] = []
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
  config = [];
  constructor(private layoutService: LayoutServiceService,
  			private fieldService: FieldService,
  			private composerService: ComposerService) {
  	this.config = this.composerService.compose(this.layout, this.schema, this.data);
  	this.layoutService.fields.subscribe(onUpdate => {
  		this.layout = onUpdate
  		this.config = this.composerService.compose(this.layout, this.schema, this.data);
  	});
  	this.fieldService.fields.subscribe(onUpdate => {
  		this.schema = onUpdate
  		this.config = this.composerService.compose(this.layout, this.schema, this.data);
  	});
  }
  
}


// Think these should all be classes/model classes isntead of interfaces
// Would be more useful to be able to instantiate them
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