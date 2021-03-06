/*
 * Created on Tue Nov 10 2020
 *
 * The MIT License (MIT)
 * Copyright (c) 2020 André Antakli, Xueting Li (German Research Center for Artificial Intelligence, DFKI).
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

let callback = null;
let elem = null;

export default {
  createImportModal: createImportModal
};

function createImportModal(matches, callbackFunct, info) {
  callback = callbackFunct;
  console.log("Ask for import AJAN-models");
  $("#modal-header-title").text("Import AJAN-models");
  let $body = $("#modal-body"),
    $modal = $("#universal-modal");
  $body.empty();
  $modal.show();

  if (info) {
    getInfoHTML(info, $body);
  }
  if (matches) {
    getMatchesHTML(matches, $body);
  }

  // Listen for the confirm event
  elem = document.getElementById("universal-modal");
  elem.addEventListener("modal:confirm", onConfirm);
  elem.addEventListener("modal:cancel", onCancel);
}

function onConfirm() {
  callback();
  elem.removeEventListener("modal:confirm", onConfirm);
}

function onCancel() {
  elem.removeEventListener("modal:confirm", onConfirm);
  elem.removeEventListener("modal:cancel", onCancel);
}

function getInfoHTML(info, $body) {
  let $info = $("<div>", {});
  $info.append($("<h2>Package Information</h2>"));
  $info.append($("<p>", {
    class: "modal-p"
  }).append("<b>Author:</b> " + info.author));
  $info.append($("<p>", {
    class: "modal-p"
  }).append("<b>Vendor:</b> " + info.vendor));
  $info.append($("<p>", {
    class: "modal-p"
  }).append("<b>Domain:</b> " + info.vendorDomain));
  $info.append($("<p>", {
    class: "modal-p"
  }).append("<b>Date:</b> " + info.date));
  $info.append($("<p>", {
    class: "modal-p"
  }).append("<b>Version:</b> " + info.version));
  $info.append($("<p>", {
    class: "modal-p"
  }).append("<b>Comment:</b> " + info.comment));

  setContainsHTML(info.contains, $info);
  setOptionalsHTML(info.optionals, $info);

  let $infoDiv = $("<div>", {
    class: "modal-body-div"
  }).append($info);
  // Append to modal body
  $body.append($infoDiv);
}

function setContainsHTML(contains, $info) {
  if (contains.length > 0) {
    let $contains = $("<div>", {});
    $contains.append($("<p><b>Contains:</b>"));
    let $list = $("<ul>", {});
    contains.forEach((item) => {
      $list.append($("<li>", {
        class: "modal-p"
      }).append("<i>" + item.type + "</i> | <b>" + item.name + "</b> | " + item.uri));
    });
    $info.append($contains.append($list));
  }
}

function setOptionalsHTML(optionals, $info) {
  if (optionals && optionals.length > 0) {
    let $optionals = $("<div>", {});
    $optionals.append($("<p><b>Further Information:</b>"));
    let $list = $("<ul>", {});
    optionals.forEach((item) => {
      $list.append($("<li>", {
        class: "modal-p"
      }).append("<b>" + item.name + "</b> | " + item.value));
    });
    $info.append($optionals.append($list));
  }
}

function getMatchesHTML(matches, $body) {
  let $matches = $("<div>", {});
  $matches.append($("<hr><h3>Following matches will be overwritten!</h3>"));
  if (Array.isArray(matches))
    getTypeMatches(matches, $matches);
  else {
    if (matches.agents.length > 0)
      getTypeMatches(matches.agents, $matches);
    if (matches.behaviors.length > 0)
      getTypeMatches(matches.behaviors, $matches);
  }
  let $matchesDiv = $("<div>", {
    class: "modal-body-div"
  }).append($matches);
  // Append to modal body
  $body.append($matchesDiv);
}

function getTypeMatches(matches, $matches) {
  console.log(matches);
  matches.forEach((item) => {
    if (item != undefined) {
      if (item.label != undefined) {
        $matches.append($("<p>", {
          style: 'color: #c92306',
          class: "modal-p"
        }).append("<i>" + item.name + "</i> | <b>" + item.label + "</b> | " + item.uri));
      } else {
        $matches.append($("<p>", {
          style: 'color: #c92306',
          class: "modal-p"
        }).append("<i>BT</i> | <b>" + item.name + "</b> | " + item.uri));
      }
    }
  });
}
