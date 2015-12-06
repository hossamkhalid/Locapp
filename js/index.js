/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var storedCards = [];
var currentCard = {};

function scan() {
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    scanner.scan(function (result) {
        //if (result.format == "QR_CODE" || result.format == "DATA_MATRIX" || result.format == "PDF417" || result.format == "RSS_EXPANDED")
        document.getElementById('txt_Add_BarCode').value = result.text;
		currentCard = {
			name: "",
			data: result.text,
			dataType: result.format,
			isRecent: false
		}
		console.log(result);
    }, function (error) {
        //$.mobile.changePage("#scanError", { role: "dialog" });
    });
}

function saveCard() {
	currentCard.name = document.getElementById('txt_Add_CardName').value;
	//currentCard.data = document.getElementById('txt_Add_BarCode').value;
	storedCards.push(currentCard);
	if(currentCard != null) {
		window.localStorage.setItem("locapp_cards", JSON.stringify(storedCards));
	}
}

function compareCards(a,b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function setCurrentCard(name, data, dataType) {
	currentCard.name = name;
	currentCard.data = data;
	currentCard.dataType = dataType;
	
	$(':mobile-pagecontainer').pagecontainer('change', '#page_CardDetails', {
        transition: 'slide',
        changeHash: true,
        reverse: false,
        showLoadMsg: true
    });
}

function loadCurrentCard() {
	alert(JSON.stringify(currentCard));
	$('#txt_Details_Name').text(currentCard.name);
	$('#txt_Details_Data').text(currentCard.data);
	$('#img_Details_Barcode').empty();
	
	var settings = {
          barWidth: 2,
          barHeight: 200          
        };
	if(currentCard.dataType.contains("QR")) {
		$('#img_Details_Barcode').ClassyQR({
		   create: true, // signals the library to create the image tag inside the container div.
		   type: 'text', // text/url/sms/email/call/locatithe text to encode in the QR. on/wifi/contact, default is TEXT
		   text: currentCard.data // the text to encode in the QR. 
		});
	} else {
		$("#img_Details_Barcode").barcode(
			currentCard.data, // Value barcode (dependent on the type of barcode)
			currentCard.dataType, // type (string)
			settings
		);
	}
}

function deleteCurrentCard() {
	var index = -1;
	for (i = 0; i < storedCards.length; i++) { 
		if(storedCards[i].name == currentCard.name && storedCards.data == currentCard.data) {
			index = i;
		}
	}
	
	if(index > -1) {
		storedCards.splice(index, 1);
		window.localStorage.setItem("locapp_cards", JSON.stringify(storedCards));
	}
	
	history.back();
	
	
}

function deleteAllCards() {
	window.localStorage.setItem("locapp_cards", JSON.stringify(storedCards));
}

function getStoredCards() {
	var cards = window.localStorage.getItem("locapp_cards");
	if(cards != null && cards != "") {
		storedCards = eval(cards);
		storedCards = storedCards.sort(compareCards);
		$('#lst_Search_AllCards').empty();
		for (i = 0; i < storedCards.length; i++) { 
			$('#lst_Search_AllCards').append("<li><a href=\"#\" class=\"ui-btn ui-btn-icon-right ui-icon-carat-r\" onclick=\"setCurrentCard('"+storedCards[i].name+"','"+storedCards[i].data+"','"+storedCards[i].dataType+"')\">" +
							"<h2>"+storedCards[i].name+"</h2>"+
							"<p>"+storedCards[i].data+"</p>"+
							"</a></li>").listview('refresh');;
		}
	}	
	/*
	$("#demo").barcode(
		"1234567890128", // Value barcode (dependent on the type of barcode)
		"ean13" // type (string)
	);
	
	$('#qr').ClassyQR({
	   create: true, // signals the library to create the image tag inside the container div.
	   type: 'text', // text/url/sms/email/call/locatithe text to encode in the QR. on/wifi/contact, default is TEXT
	   text: 'Welcome to jQueryScript!' // the text to encode in the QR. 
	});
	*/
}

