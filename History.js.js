function copyRowsToSheet(sourceSheetName, sourceRange, targetSheetName) {
  // Get the spreadsheet and sheets by name
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = spreadsheet.getSheetByName(sourceSheetName);
  var targetSheet = spreadsheet.getSheetByName(targetSheetName);
  var lastUsedRow = targetSheet.getLastRow();
  // Get the values from the source range
  var values = sourceSheet.getRange(sourceRange).getValues();

  //separator
  targetSheet.appendRow(["-"]);

  // Append the row using the values array
  for (let i = 1; i < 12; i++) {
    var rowRange = sourceSheet.getRange("A"+i+":G"+i).getValues()[0];
    targetSheet.appendRow(rowRange);

    //copy carrier log and working ticket link
    if(i>4){
      sourceSheet.getRange("A"+(i)).copyTo(targetSheet.getRange("A"+(lastUsedRow+i)), {contentsOnly:true});   
      sourceSheet.getRange("F"+(i)).copyTo(targetSheet.getRange("F"+(lastUsedRow+i)));
      
      targetSheet.getRange("F"+(lastUsedRow+i)).setBorder(false,false,false,false,false,false);
    }
    
  }
  targetSheet.getRange("G"+(lastUsedRow+2)).setValue("Timestamp");
  targetSheet.getRange("G"+(lastUsedRow+3)).setValue(new Date());
  targetSheet.getRange("A"+(lastUsedRow+2)+":G"+((lastUsedRow+4))).setFontWeight("bold");
  //targetSheet.getRange("A"+(lastUsedRow+3)+":G"+((lastUsedRow+3))).setFontWeight("bold");

}
function saveExtraction(){
  Logger.log("saveExtraction: start execution");
  // Example usage:
  var sourceSheetName = "voli";
  var sourceRange = "A1:G13"; // Replace with your desired range
  var targetSheetName = "History";
  copyRowsToSheet(sourceSheetName, sourceRange, targetSheetName);
  
  Logger.log("saveExtraction: end execution");
}
function test(){
  Logger.log(findLastPriceFromId("10413-2402150950--32356,-30598,-32289-2-14355-2402152111"));
}
function findLastPriceFromId(value) {
  
  Logger.log("findLastPriceFromId: start execution");
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var targetSheet = spreadsheet.getSheetByName("History");
  var lastUsedRow = targetSheet.getLastRow();

  //check if sheet is empty
  if(lastUsedRow==0) {
    Logger.log("findLastPriceFromId: end execution");
    return 0;
  }
  try{
    const data = targetSheet.getRange("G1:G"+lastUsedRow).getValues();
    const matchIndex = data.map(row => row[0] === value).lastIndexOf(true) + 1;
  
    Logger.log("findLastPriceFromId: end execution");
    return matchIndex>0?(targetSheet.getRange("E"+matchIndex)).getValue().replace("€",""):0;
    
  } catch(err) {
    Logger.log("findLastPriceFromId: end execution with err: "+err);
    return 0;
  }
}

