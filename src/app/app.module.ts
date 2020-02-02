import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { TextFieldComponent } from './text-field/text-field.component';
import { DynamicFieldDirective } from './dynamic-field.directive';

import { OptionFieldComponent } from './option-field/option-field.component';
import { PageLayoutEditorComponent } from './page-layout-editor/page-layout-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    TextFieldComponent,
    DynamicFieldDirective,
    OptionFieldComponent,
    PageLayoutEditorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  entryComponents: [TextFieldComponent, OptionFieldComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
