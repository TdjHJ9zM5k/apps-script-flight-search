const API_KEY = '1447da5a9emsh3667c0c6018e3bep192adbjsn77fc4f0e26f0';
const API_HOST = 'skyscanner80.p.rapidapi.com/api';

/*const airportTokens2 = {  // NOW IN Airport.gs FILE
  "CPH": "eyJlIjoiOTU2NzM1MTkiLCJzIjoiQ1BIIiwiaCI6IjI3NTM5OTAyIiwidCI6IkFJUlBPUlQifQ==",
  "TRN": "eyJlIjoiOTU2NzM1ODAiLCJzIjoiVFJOIiwiaCI6IjI3NTQ3MjQ4IiwidCI6IkFJUlBPUlQifQ==", 
  "MXP": "eyJlIjoiOTU1NjUwNzAiLCJzIjoiTVhQIiwiaCI6IjI3NTQ0MDY4IiwidCI6IkFJUlBPUlQifQ==", 
  "PMO": "eyJlIjoiOTU2NzM2NDciLCJzIjoiUE1PIiwiaCI6IjI3NTQ1OTg5IiwidCI6IkFJUlBPUlQifQ==",
  "CTA": "eyJlIjoiOTU2NzM4OTMiLCJzIjoiQ1RBIiwiaCI6IjI3NTQwNTYyIiwidCI6IkFJUlBPUlQifQ=="
};*/

const ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
const sheet = ss.getSheetByName('Flights'); //get sheet by name from active spreadsheet

function testimage(){
 var url = 'https://logos.skyscnr.com/images/airlines/favicon/BF.png';
 let image = SpreadsheetApp.newCellImage().setSourceUrl(url).setAltTextDescription("French Bee").toBuilder().build();
    sheet.getRange("G"+(5)).setValue(image);
}

function doGet(){
  Logger.log("main: start execution");
  clearSheet();
  var size = sheet.getRange("E2").getValue();
  var airportFromCode = sheet.getRange("A2").getValue().substring(sheet.getRange("A2").getValue().length-3, sheet.getRange("A2").getValue().length);
  var airportToCode = sheet.getRange("C2").getValue().substring(sheet.getRange("C2").getValue().length-3, sheet.getRange("C2").getValue().length);

  var airportFromToken = airportTokens[airportFromCode];
  var airportToToken = airportTokens[airportToCode];
  var usDate = getUsDate();
  Logger.log("Query: from: "+airportFromCode+"; to: "+airportToCode+"; when: "+sheet.getRange("D2").getDisplayValue());
  var jsonResponse = callAPI(airportFromToken, airportToToken, usDate);
  extractData(jsonResponse,size);
  saveExtraction();
  Logger.log("main: end execution");
}

function getUsDate(){
  var usDate = sheet.getRange("D2").getDisplayValue().split("/");
  return usDate[2]+"-"+usDate[1]+"-"+usDate[0];
}

function getAirportFromToken(){
  var airportCode = sheet.getRange("A2").getValue().substring(sheet.getRange("A2").getValue().length-3, sheet.getRange("A2").getValue().length);
  return airportTokens[value];
}

function clearSheet(){
  
  Logger.log(sheet.getRange("A5:H11").getValues());
  sheet.getRange("A5:H11").clearContent();
  sheet.getRange("L2:L3").clearContent();
  Logger.log("sheet cleared");
}
function extractData(json, limit){
  Logger.log("extractData: start execution");
  var token = json.token;
  Logger.log(json.itineraries);
  for (let i = 0; i < limit; i++) {
    try{
        var itinerario = json.itineraries[i];
        
        var itineraryId = itinerario.id; 
        var flight  = itinerario.legs[0];
        var carrier = flight.carriers.marketing[0].name;
        var timeFrom = flight.departure;
        var timeTo = flight.arrival;
        var durationMinutes  = flight.durationInMinutes;
        var minutes = durationMinutes % 60;
        var hours = Math.floor(durationMinutes / 60);
        var stops = flight.stopCount;
        var stopsString = stops == 0? 'Direct' : (stops+(stops==1?' Stop':' Stops'));
        var timeFromFormatted = timeFrom.substring(timeFrom.length-8, timeFrom.length-3);
        var timeToFormatted = timeTo.substring(timeTo.length-8, timeTo.length-3);
        //var duration = getHourDifference(timeFromFormatted.substring(0,2), timeFromFormatted.substring(3,5), timeToFormatted.substring(0,2), timeToFormatted.substring(3,5));

        var from = flight.origin.id;
        var to = flight.destination.id;
        var price = itinerario.price.raw;
        var lastPrice = findLastPriceFromId(itineraryId);
    } catch(err) {
      Logger.log(err);
      continue;
    }
    var textColor = 'black';
    //check stored price
    Logger.log("price "+ price+ " last price "+lastPrice+" difference "+(price-lastPrice));
    if(lastPrice==0 || lastPrice=="0" || price==lastPrice)
      textColor = 'blue';
    else if(price>lastPrice)
      textColor = 'red';
    else if(price<lastPrice)
      textColor = 'green';
    sheet.getRange("B"+(i+5)).setValue(carrier);
    sheet.getRange("C"+(i+5)).setValue(timeFromFormatted+" - "+timeToFormatted+ " ("+String(hours).padStart(2, '0')+":"+String(minutes).padStart(2, '0')+"h)");
    sheet.getRange("D"+(i+5)).setValue(stopsString);
    sheet.getRange("E"+(i+5)).setValue(price+"€");
    sheet.getRange("E"+(i+5)).setValue(price+"€").setFontColor(textColor);
    sheet.getRange("E"+(i+5)).setNumberFormat('@STRING@');
    
    sheet.getRange("G"+(i+5)).setValue(itineraryId);
    Logger.log(carrier);
    
    var tags = itinerario.tags;
    sheet.getRange("H"+(i+5)).setValue(tags);

    var agent = getPrice(token, itineraryId, (i+5));
    if(agent != undefined){
      var richValue = SpreadsheetApp.newRichTextValue()
        .setText("Buy Ticket")
        .setLinkUrl(agent.url)
        .build();
      sheet.getRange("F"+(i+5)).setRichTextValue(richValue);
    }
    // insert carrier logo
    try {
      var imageUrl = flight.carriers.marketing[0].logoUrl;
      let image = SpreadsheetApp.newCellImage().setSourceUrl(imageUrl).setAltTextDescription(carrier).toBuilder().build();
      sheet.getRange("A"+(i+5)).setValue(image);
    } catch(err) {
      Logger.log(err);
    }
  }
  Logger.log("extractData: end execution");
}

function insertImageWithBuilder(range, url, title, description) {
  var imageBuilder = sheet.newCellImageBuilder()
      .setSourceUrl(url)
      .setAltTextTitle(title)
      .setAltTextDescription(description);

  // Build and insert the image
  sheet.getRange(range).setValue(imageBuilder.build());
}

function callAPI(from, to, when){
  
  Logger.log("callAPI: start execution");
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    },
    muteHttpExceptions: true
  };
  var url = 'https://skyscanner80.p.rapidapi.com/api/v1/flights/search-one-way?fromId='+encodeURI(from)+'&toId='+encodeURI(to)+'&departDate='+when+'&currency=EUR';
  Logger.log(url);
  var response = UrlFetchApp.fetch(url, options); // get api endpoint
  sheet.getRange("L2").setValue(response.getResponseCode());
  sheet.getRange("L3").setValue(new Date);
  var json = response.getContentText(); // get the response content as text
  var data = JSON.parse(json); //parse text into json
  Logger.log(json);
  Logger.log("message: "+data.message);
  Logger.log("callAPI: end execution");
  return data.data;
}
function getPrice(token, itineraryId, row){
  Logger.log("getPrice: start execution");
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'sky-scanner3.p.rapidapi.com'
    },
    muteHttpExceptions: true
  };
  var url = 'https://sky-scanner3.p.rapidapi.com/flights/detail?token='+encodeURI(token)+'&itineraryId='+encodeURI(itineraryId)+'&market=IT&locale=en-US&currency=EUR';
  var response = UrlFetchApp.fetch(url, options); // get api endpoint
  Logger.log("getPrice: "+response.getResponseCode())
  var json = response.getContentText(); // get the response content as text
  
  try {
    var data = JSON.parse(json); //parse text into json
    var pricingOptions = data.data.itinerary.pricingOptions;
    var legs = data.data.itinerary.legs[0];
    var scali = legs.layovers;
    var scaliString = " (";
    for (let i = 0; i < scali.length; i++) {
      var airport = scali[i].origin.displayCode;
      if(i==scali.length-1)
        scaliString += airport+")";
      else
        scaliString += airport+", ";
    }
    sheet.getRange("D"+row).setValue(sheet.getRange("D"+row).getValue()+scaliString);
  }
  catch(err) {
    Logger.log(err);
  }
  for (let i = 0; i < pricingOptions.length; i++) {
    var carrier = pricingOptions[i];
    var agent = carrier.agents[0];
    if(agent.isCarrier == true){
      Logger.log("getPrice: end execution");
      return agent;
    }
  }

}
function getHourDifference(hour1, minute1, hour2, minute2) {
  // Convert minutes to hours and add them to their respective hours
  var time1 = hour1 + minute1 / 60;
  var time2 = hour2 + minute2 / 60;

  // Calculate the absolute difference in hours
  var difference = Math.abs(time1 - time2);

  // Handle situations where the second time is before the first time
  if (time1 > time2) {
    difference = 24 - difference;
  }

  // Return the difference rounded to the nearest whole hour
  return Math.round(difference);
}