/*
 * Created on Tue Nov 10 2020
 *
 * The MIT License (MIT)
 * Copyright (c) 2020 André Antakli, Alex Grethen (German Research Center for Artificial Intelligence, DFKI).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import Ember from "ember";
import {TriplestoreListing} from "ajan-editor/helpers/home/triplestore-listing";

let $ = Ember.$;

class TriplestoreCollection {
	constructor(parentComponent) {
		this.parentComponent = parentComponent;
		this.getTripleStores();
		this.insertTriplestores();
	}

	getTripleStores() {
		try {
			this.triplestores = JSON.parse(localStorage.triplestores);
			console.log("22222-" + this.triplestores.length);
			/*for (var i = 0; i < this.triplestores.length; i++) {
				console.log(this.triplestores[i].get('label'));
			}*/
		} catch (err) {
			this.triplestores = [];
		}
	}

	insertTriplestores() {
		this.$list = $("#triplestore-list");
		this.triplestores.forEach(triplestore => {
			new TriplestoreListing(triplestore, this.parentComponent);
		});
	}

	insertNewTriplestore() {
		console.log("3333");
		//TODO: Check whether it already exists?
		let triplestore = getNewTriplestore();
		console.log("4444-" + triplestore);
		console.log("4444-" + triplestore.label);
		new TriplestoreListing(triplestore, this.parentComponent);
		this.triplestores.push(triplestore);
		localStorage.triplestores = JSON.stringify(this.triplestores);
		console.log("55555-"+localStorage.triplestores.length);
		//localStorage.myrepos = JSON.stringify(this.triplestores);
		console.log("6666-"+localStorage.myrepos.length);
		/*while(this.availableLogs.length > 0){
			this.availableLogs.popObject();
		}*/
		console.log("7777-"+localStorage.myrepos);
	}
}

function getNewTriplestore() {
	return {
		label: getLabel(),
		uri: getURI()
	};
}

function getLabel() {
	return $("#label").val();
}

function getURI() {
	return $("#uri").val();
}

export {TriplestoreCollection};
