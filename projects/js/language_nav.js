var jsonData = [];
var instructionRecordMap = {};
var numberPerPage = 50;
var numberOfPages = 0;
var currentPage = 1;
var pageList = new Array();
var allHitMeta = {};


function loadJSON(callback, path) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    //xobj.setRequestHeader('Access-Control-Allow-Origin', '*');

    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && (xobj.status === 200 || xobj.status === 0)) {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);
        }
    }
    xobj.send(null);

}

function getNumberOfPages() {
    var selectedInstruction = document.getElementById("instructionList").value;
    var selectedScene = document.getElementById("sceneList").value;
    return Math.ceil(instructionRecordMap[selectedScene][selectedInstruction].length / numberPerPage);
}

function sampleObservations(records) {
    var observationsMap = {};

    for (let record in records) {
        var category = records[record]["object_category"];
        observationsMap[category] = {
            "instructions": records[record]["instructions"],
            "object_goals": records[record]["object_goals"]
        }
    }
    return observationsMap;
}

function loadDataset(records) {
    var count = Object.keys(observationsMap).length;
    numberOfPages = getNumberOfPages();

    console.log('Total training examples ' + count);
    console.log('Number of pages: ' + numberOfPages);
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function getObservationPath(path) {
    return "https://habitat-on-web.s3.amazonaws.com/ovon/language_goals/" + path;
}

function drawList(observationsMap) {
    var page = document.getElementById("main-container");
    console.log(observationsMap);
    for (let category in observationsMap) {
        var row = document.createElement("div");
        row.className = "row";

        var col = document.createElement("div");
        col.className = "col-md-1";
        col.innerHTML = "<span> " + category + " </span>"
        row.appendChild(col);

        var col = document.createElement("div");
        col.className = "col-md-3";

        col.innerHTML = "";
        for (let idx in observationsMap[category]["instructions"]) {
            col.innerHTML += "<span> " + observationsMap[category]["instructions"][idx] + " </span> <br>";
        }
        row.appendChild(col);

        for (let idx in observationsMap[category]["object_goals"]) {
            if (idx > 2) {
                break;
            }
            var col = document.createElement("div");
            col.className = "col-md-4";
            var obsPath = getObservationPath(observationsMap[category]["object_goals"][idx]);
            var img = getImageElement(obsPath);
            col.appendChild(img);
            row.appendChild(col);
        }
        page.appendChild(row);

        page.appendChild(document.createElement("hr"))
    }
}


function getImageElement(path) {
    var img = document.createElement("img");
    img.src = path;
    img.width = 500;
    img.height = 300;
    return img;
}

function nextPage() {
    currentPage += 1;
    loadList();
}

function previousPage() {
    currentPage -= 1;
    loadList();
}

function firstPage() {
    currentPage = 1;
    loadList();
}

function lastPage() {
    currentPage = numberOfPages;
    loadList();
}


function load() {
    // populateScenes();
    loadJSON(function (data) {
        jsonData = JSON.parse(data);
        console.log(jsonData)
        observationsMap = sampleObservations(jsonData);
        drawList(observationsMap);
    }, "https://habitat-on-web.s3.amazonaws.com/ovon/language_goals/language_goals.json");
}

window.onload = load;