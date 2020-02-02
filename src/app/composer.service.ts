import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComposerService {

  constructor() { }

  compose(layout, schema, data) {
  	const schemaLayout = layout.map(chosenField => schema.find(schemaItem => schemaItem.name === chosenField.name))
      .filter(foundItem => foundItem !== null && typeof(foundItem) !== 'undefined');
  	
  	const present = schemaLayout.map((chosenField) => {
		const resolvedData = data.find(dataItem => dataItem && dataItem.name === chosenField.name);
		return { ...chosenField, ...resolvedData }
	});
  	return present;
  }
}
