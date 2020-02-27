import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs'
import { map, filter, startWith } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ValidationManagerService {

  constructor() {
  	const c = new Condition('maturity', '1', ComparisonType.equals);
  	const d: Condition = JSON.parse('{"field": "foul", "logic": "Equals", "value": "2"}') as Condition; 
  	const e = new Condition();
  	e.field='already'
  	e.logic=ComparisonType.equals;
  	e.value='1'

  	expect(d.logic === ComparisonType.equals)
  	const eff1 = {applyValues: [new ValueDeclaration('category', '2', '')]}
  	const eff2: Effect = { validation: [new ValidationRule(['category'], 'required'), new ValidationRule(['category'], 'required')] }
  	const r = new Rule(eff2, [c,d,e], )

  	const form = new FormGroup({
  		
  		already: new FormControl('1'),
  		category: new FormControl(''),
  		maturity: new FormControl(''),
  		foul: new FormControl(''),
  	});

  	const ruleProcessor = new RuleProcessor(form, [r]);
  	console.log(form.valid)
  	form.controls.maturity.setValue('1');
  	console.log(form.valid)
  	form.controls.foul.setValue('2');
  	console.log(form.valid)
  	form.controls.foul.setValue('1');
  	// form.controls.category.setValue('1');
  	console.log(form.valid)
  	form.controls.foul.setValue('2');
  	console.log(form.valid)
  }
}

export class WatchedControl {
	control: FormControl;
	check: Check;
	stream: Observable<boolean>
	constructor(control: FormControl, check: Check) {
		this.control = control;
		this.check = check;
		this.stream = this.control.valueChanges.pipe(
			startWith(this.control.value),
			map(value => check.checkLogic(value))
		);
	}
}

export class Check {
	public checkLogic: (query: string) => boolean = (x => false);
	constructor(logic, targetValue) {
		switch(logic) {
			default:
				this.checkLogic = (args) => args === targetValue;
				break;
		}
	}
}

export interface EffectType {
	rule: ValidatorFn,
	fields: string[]
}

export interface Signal {
	active: boolean,
	effects: EffectType[]
}

export class RuleInstance {
	
	conditionStream: Observable<Signal>;
	
	constructor(public rule: Rule, public form: FormGroup, private heartbeat: Observable<boolean>) {
		
		const logicType = this.parseLogic(rule.logic)
		const conditionWatchList: WatchedControl[]  = [];
		const effectList = [];
		
		rule.grant.validation.forEach(vr => {
			const {fields, parameter, ruleName} = vr;
			const actualRule = this.parseValidationRuleName(ruleName, parameter);
			effectList.push({ rule: actualRule, fields });
		});
		let conditionStream: Observable<boolean>;
		if (!rule.when.length) {
			// always case
			conditionStream = heartbeat;
		} else {
			rule.when.forEach(cond => {
				const {field, logic, value} = cond;
				conditionWatchList.push(new WatchedControl(
					this.form.controls[field] as FormControl, 
					new Check(logic, value)
				));	
			});
			const streams: Observable<boolean>[] = conditionWatchList.map(watcher => watcher.stream)
			conditionStream = combineLatest(streams).pipe(
				map((watchArray: boolean[]) => logicType(watchArray))
			);

		}
		
		this.conditionStream = conditionStream.pipe(
			map((signal: boolean) => {
				return {
					active: signal,
					effects: effectList
				} as Signal
			})
		);
	}

	private parseValidationRuleName(ruleName: string, parameter: number) {
		if (ruleName.toLowerCase() === 'required') {
			return Validators.required;
		}
		return Validators.required;
	}
	private parseLogic(logic: RuleLogicType): (signals: boolean[]) => boolean {
		if (logic === RuleLogicType.xor) {
			return ((signals: boolean[]) => signals.some(x=>x) && !signals.every(x=>x))
		}
		if (logic === RuleLogicType.nand) {
			return ((signals: boolean[]) => !signals.some(x=>x))
		}
		if (logic === RuleLogicType.or) {
			return ((signals: boolean[]) => signals.some(x=>x))
		}
		return ((signals: boolean[]) => signals.every(x=>x))
	}
}

export class RuleProcessor {
	
	rules: RuleInstance[];
	heartbeat: BehaviorSubject<boolean>;

	constructor(public form: FormGroup, public ruleSet: Rule[]) {
		this.heartbeat = new BehaviorSubject(true);
		this.rules = ruleSet.map((rule) => new RuleInstance(rule, form, this.heartbeat.asObservable()));
		const coordinator: Observable<Signal[]> = combineLatest(this.rules.map(rule=>rule.conditionStream));
		const subs = coordinator.subscribe((signals: Signal[]) => {
			const controlMap = {}
			const actives = signals.filter(signal => signal.active);
			const effects = actives.map(active=>active.effects).forEach(effectList => {
				effectList.forEach(effect => {
					effect.fields.forEach(field => {
						if(!(field in controlMap)) {
							controlMap[field] = []
						}
						if (controlMap[field].indexOf(effect.rule) === -1) {
							controlMap[field].push(effect.rule);
						}
					});
				});
			});
			Object.keys(controlMap).forEach(key => {
				form.controls[key].setValidators(controlMap[key]);
				form.controls[key].updateValueAndValidity({emitEvent:false});
			});
			// For all controls not in control map - clear validators
			Object.keys(form.controls).forEach(controlName => {
				if (!(controlName in controlMap)) {
					form.controls[controlName].clearValidators();
					form.controls[controlName].updateValueAndValidity({emitEvent:false});
				}
			});

		});
	}

}

export enum ComparisonType {
	equals = 'Equals',
}
export enum RuleLogicType {
	and = 'All',
	or = 'Any',
	nand = 'None',
	xor = 'Some',
}
export class Condition {
	constructor(
		public field?: string,
		public value?: string,
		public logic?: ComparisonType,
		) {}
}

export class Rule {
	constructor(
		public grant: Effect,
		public when: Condition[] = [],
		public logic: RuleLogicType = RuleLogicType.and,
	){}

}

export class Effect {
	constructor(
		public trigger?: Rule[],
		public applyValues?: ValueDeclaration[],
		public validation?: ValidationRule[]
	) {}
}

export class ValueDeclaration {
	constructor(
		public field: string,
		public value: string,
		public unsetValue: string,
		public toDefault: boolean = false
	) {}
}

export class ValidationRule {
	constructor(
		public fields: string[],
		public ruleName: string,
		public parameter?: number
	) {}
}

