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
import globals from "ajan-editor/helpers/global-parameters";
import nodeDefs from "ajan-editor/helpers/RDFServices/node-definitions/node-defs";

let $ = Ember.$;

let labelToNodeHeightFactor = 2;
let paddingScaleUnitHeight = 1.5;
let paddingScaleUnitWidth = 2;
let unitDim;
let nodeHeight;
let sizeMult = 1; // increase the scale to increase accuracy w.r.t. zoomed text

export default {
	computeLabelDimensions,
	getNodeHeight,
	// getUnitDimensions,
	setEachNodeDimensions,
	setNodeDimensions,
	printNodes,
	printEdges
};

function computeLabelDimensions(ele, text = "o") {
	// If no ele is given, get dimensions from dummy
	ele = ele || getDummyNode();

	let div = getEmptyDiv();
	let divStyle = div.style;
	setDivStyle(divStyle, ele);
	div.textContent = text;
	let divDimensions = getDivDimensions(div);
	$(div).remove();
	return divDimensions;
}

function getDummyNode() {
	return globals.cy
		.add({
			/*Empty node*/
		})
		.remove();
}

function getEmptyDiv() {
	let div = document.createElement("div");
	document.body.appendChild(div);
	return div;
}

function setDivStyle(divStyle, ele) {
	setDivStyleFromEle(divStyle, ele);
	setForcedDivStyle(divStyle);
	setDivWhitespace(divStyle, ele);
}

function setDivStyleFromEle(divStyle, ele) {
	divStyle.fontFamily = ele.pstyle("font-family").strValue;
	divStyle.fontStyle = ele.pstyle("font-style").strValue;
	divStyle.fontSize = sizeMult * ele.pstyle("font-size").pfValue + "px";
	divStyle.fontWeight = ele.pstyle("font-weight").strValue;
}

function setForcedDivStyle(divStyle) {
	divStyle.position = "absolute";
	divStyle.left = "-9999px";
	divStyle.top = "-9999px";
	divStyle.zIndex = "-1";
	divStyle.visibility = "hidden";
	divStyle.pointerEvents = "none";
	divStyle.padding = "0";
	divStyle.lineHeight = "1";
}

function setDivWhitespace(divStyle, ele) {
	if (ele.pstyle("text-wrap").value === "wrap") {
		divStyle.whiteSpace = "pre"; // so newlines are taken into account
	} else {
		divStyle.whiteSpace = "normal";
	}
}

function getDivDimensions(div) {
	let width = Math.ceil(div.clientWidth / sizeMult);
	let height = Math.ceil(div.clientHeight / sizeMult);
	return {width, height};
}

function getNodeHeight() {
	nodeHeight = nodeHeight || labelToNodeHeightFactor * getUnitHeight();
	return nodeHeight;
}

function getUnitDimensions() {
	unitDim = unitDim || computeLabelDimensions();
	return unitDim;
}

function getUnitHeight() {
	return getUnitDimensions().height;
}

function getUnitWidth() {
	return getUnitDimensions().width;
}

function setEachNodeDimensions(cy) {
	cy.nodes().forEach(node => setNodeDimensions(node));
}

function setNodeDimensions(node) {
	if (breakNodeWidthFunction(node)) return;

	let labelWidth = computeLabelDimensions(node, node.data("label")).width;
	// Adjust padding according to whether the node has an icon or not
	let padding = node.data("icon") ? getIconPadding() : getUnitWidth();
	node.style("width", labelWidth + padding + "px");
	node.style("height", getNodeHeight() + "px");
}

function getIconPadding() {
	return (
		paddingScaleUnitHeight * getUnitHeight() +
		paddingScaleUnitWidth * getUnitWidth()
	);
}

function breakNodeWidthFunction(node) {
	// Do not resize nodes with fixed labels
	let typeDef = nodeDefs.getTypeDef(node.data("type"));
	return (typeDef) ? typeDef.fixedLabel : undefined;
}


// Helpers; for debugging
function printNodes(cy, eles) {
	let labels = [];
	eles.forEach(ele => {
		if (ele.isNode()) {
			labels.push(ele._private.data.label);
		}
	});
	console.warn(labels);
}

function printEdges(cy, eles) {
	let labels = [];
	eles.forEach(ele => {
		if (ele.isEdge()) {
			let src = cy.$id(ele._private.data.source)._private.data.label;
			let trg = cy.$id(ele._private.data.target)._private.data.label;
			labels.push(src + "___" + trg);
		}
	});
	console.warn(labels);
}
