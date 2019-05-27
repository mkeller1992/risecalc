
export interface IRule<T> {

	ruleId: string;
	addParentRules(rule: IRule<T>);
	addChildRules(rule: IRule<T>);
	getResult():T;	
}


/* T denotes the result-type */

export class Rule<T> implements IRule<T> {

	public ruleId: string;
	private _statement: string;
	private _parentRules: IRule<T>[];
	private _childRules: IRule<T>[];

	public set Statement(statement: string){
		this._statement = statement;
	}
	public addParentRules(rule: IRule<T>) {
		this._parentRules.push(rule);
		rule.addChildRules(this);
	}
	public addChildRules(rule: IRule<T>) {
		this._childRules.push(rule);
	}


	public getResult():T {
		const statement = this.transformStatementIntoCode();

		try {
			const result = eval(statement);
			return result;
		}
		catch(err){
			return null;
		}
	}


	private transformStatementIntoCode(): string {
		
		let convertedStatement = '';

		for(let i = 0; i < this._parentRules.length; i++){

			const parentResult = this._parentRules[i].getResult();

			if(parentResult === null){
				convertedStatement = this._statement.split(`{${i}}`).join('null');
			}
			else {
				convertedStatement = this._statement.split(`{${i}}`).join(`${parentResult}`);
			}		
		}
		return convertedStatement;
	}

}