import { Component, OnInit, Input } from '@angular/core';
import { LayoutServiceService } from '../layout-service.service'
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { FieldMetaData } from '../app.component'
import { ComposerService } from '../composer.service'
import { FieldService } from '../field.service'
import { LayoutEntry } from '../layout-service.service'

@Component({
  selector: 'app-page-layout-editor',
  templateUrl: './page-layout-editor.component.html',
  styleUrls: ['./page-layout-editor.component.scss']
})
export class PageLayoutEditorComponent implements OnInit {


  @Input() availableFields: FieldMetaData[];
  
  visibleView: Observable<FieldMetaData[]>;

  constructor(private layoutService: LayoutServiceService, private composerService: ComposerService, private fieldService: FieldService) {
  	this.visibleView = combineLatest(this.layoutService.fields, this.fieldService.fields).pipe(map(([layout, fields]) => {
  		console.log(layout)
  		console.log(fields)
  		return this.composerService.compose(layout, fields, []);
  	}));
  }

  ngOnInit() {
  	
  }

  addField(field) {
  	this.layoutService.addField(field);
  }

  removeField(field) {
  	this.layoutService.removeField(field);
  }

}
