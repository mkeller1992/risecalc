import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

declare var require: any;
var parser = require('fast-xml-parser');
var he = require('he');


@Injectable()
export class ParserService {

	private _baseUrlForDocs = 'assets/docs/'

	private _parserOptions = {
		attributeNamePrefix : "_",
		attrNodeName: false /*"attr"*/, //default is 'false'
		textNodeName : "#text",
		ignoreAttributes : false,
		ignoreNameSpace : false,
		allowBooleanAttributes : false,
		parseNodeValue : true,
		parseAttributeValue : true,
		trimValues: true,
		cdataTagName: "__cdata", //default is 'false'
		cdataPositionChar: "\\c",
		localeRange: "", //To support non english character in tag/attribute values.
		parseTrueNumberOnly: false,
		attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
		tagValueProcessor : a => he.decode(a) //default is a=>a
	};


	constructor(private http: HttpClient){ }


	/* Xml-Files need to be stored in folder 'assets/docs' */

	public getJsonFromXmlFile(documentName: string): Observable<any> | null {

		const requestUrl = `${this._baseUrlForDocs}${documentName}`;

		return this.http.get(requestUrl, { responseType: 'text' })
		.pipe(
			map((xmlData: string) => {
				if (xmlData) {
					if (parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)

						return parser.parse(xmlData, this._parserOptions);
					}
					else {
						throw new Error('XML Syntax Error (Xml invalid)');
					}
				}
				else {
					throw new Error('Parsing of xml-file failed');
				}
			})
		);
	}


	/*
	// Intermediate obj
	var tObj = parser.getTraversalObj(xmlData,options);
	var jsonObj = parser.convertToJson(tObj,options);
	*/

	/*
	public getTextDocument(){

		this.http.get(this._baseUrlForDocs + 'text.xml', { responseType: 'text' }).subscribe(data => {
			console.log(data);
		})
	}
*/


}