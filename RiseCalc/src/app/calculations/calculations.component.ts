	import { Component, OnInit } from '@angular/core';
	import { ParserService } from '../services/parser.service';
	import { LinearyFunction, SigmoidFunction } from '../models/calculation-units.models';
	import { FunctionType } from '../models/function-types.model';



	/* Url: localhost:4200/calculations */

	@Component({
	selector: 'app-calculations',
	templateUrl: './calculations.component.html',
	styleUrls: ['./calculations.component.css']
	})
	export class CalculationsComponent implements OnInit {


	title = 'RiseCalc';

	// File must be stored in folder 'assets/docs'
	fileName = 'functions.xml'

	// Will contain the functions extracted from xml
	calculationUnits: any[] = []

	constructor(private parserService: ParserService){ }

	ngOnInit() {

		this.getJsonFromXml(this.fileName, (json: string)=>{
			this.calculationUnits = this.convertToObjects(json);
		})
	}


	private getJsonFromXml(fileName: string, onSuccess:(json:string) => void) {

		this.parserService.getJsonFromXmlFile(fileName).subscribe((json: any) => {
			console.log(json);
			onSuccess(json);
		});
	}


	private convertToObjects(json: any): any[] {

		let functionsList: any[] = [];
		const functions = json.FunctionData.Function;

		for (let i = 0; i < functions.length; i++){

			const functionType = functions[i]._Type;
			
			var fk : any;

			switch(functionType) { 
				case 'Lineary': { 
					fk = new LinearyFunction();
					fk.a = functions[i].Interval.a;
					fk.b = functions[i].Interval.b;
					fk.offset = functions[i].Interval.offset;
				   	break; 
				} 
				case 'Sigmoid': { 
					fk = new SigmoidFunction();
					fk.scale = functions[i].scale;
				   	break; 
				}
				default: { 
					console.error('No suitable function found !!!')
					break; 
				 } 
			}
			functionsList.push(fk);
		}
		return functionsList;
	}



	isLineary(functionType: any){
		return functionType.constructor.name === FunctionType.Lineary;
	}

	isSigmoid(functionType: any){
		console.log(functionType);
		return functionType.constructor.name === FunctionType.Sigmoid;
	}


	private testEval(){

		const inputs = [150, 20];

		// Structure of statement
		let statement = `({0} > {1} && {0}+{1} > 50) ? ({0}*{1}+2000) : null`;
	
		// Replace statement's variables with real values
		for (let i = 0; i < inputs.length; i++){
			statement = statement.split(`{${i}}`).join(`${inputs[i]}`);
		}
	
		console.log(statement);
	
		// Evaluate statement
		const result = eval(statement);
	
		console.log(result);		
	}

}

