/*
var ss = SpreadsheetApp.getActiveSpreadsheet(); //get active spreadsheet
var sheet = ss.getSheetByName('test'); //get sheet by name from active spreadsheet

// GET DATA FROM HISTORY, THEN SAVE ON A HIDDEN COLUMN ON MAIN PAGE?
var data1 = [
  ["26/02/2024", "99"],
  ["27/02/2024", "100"],
  ["28/02/2024", "100"],
  ["29/02/2024", "102"]
];
const data = [
  ["Month", "Sales", "Expenses"],
  ["Jan", 100, 80],
  ["Feb", 120, 90],
  ["Mar", 150, 100],
];

function insertChart() {
  Logger.log("insertChart: start execution");

  var range = sheet.getRange("A1:B3");
newChart(range);
 
      
  Logger.log("insertChart: end execution");
  
}
function newChart() {
  var chartBuilder = sheet.newChart();
  chartBuilder
      //.addRange(sheet.getRange("A1:B4"))
      .addRange(sheet.getRange("A1:B4"))
      .setChartType(Charts.ChartType.LINE)
      .setPosition(7, 1, 1, 1)
      .setOption('title', 'My Line Chart!');
  sheet.insertChart(chartBuilder.build());
}
function test() {
  try {
    var Data = [{ID:1, X:2, Y:2},{ID:2, X:3, Y:3},{ID:3, X:4, Y:4}];
    let spread = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spread.getSheetByName("test");
    let values = [["ID","X","Y"]];
    Data.forEach( object => {
        values.push([object.ID,object.X,object.Y]);
      }
    );
    console.log(values);
    sheet.getRange(1,1,values.length,3).setValues(values);
    let range = sheet.getRange(1,2,values.length,2)
    let chart = sheet.newChart()
                  .setChartType(Charts.ChartType.SCATTER)
                  .addRange(range)
                  .setNumHeaders(1)
                  .setPosition(5,5,0,0)
                  .setOption("hAxis",{title:"X"})
                  .setOption("vAxis",{title:"Y"})
                  .build();

    sheet.insertChart(chart);
  }
  catch(err) {
    console.log(err);
  }
}

function deleteAllCharts(){
  Logger.log("deleteAllCharts: start execution");
const charts = SpreadsheetApp.getActiveSheet().getCharts();

if (charts.length > 0) {
  // Delete the first chart (modify index for specific deletion)
  charts[0].remove();
} else {
  // No charts found
  console.log("No charts found to delete.");
}
  Logger.log("deleteAllCharts: end execution");
}


*/