// Google Apps Script Code - Copy this to your Apps Script project

function doPost(e) {
  const sheet = SpreadsheetApp.openById('12O-DauPegla2pqR_2T7dUvXdwXSV0vUXZWNWzmL3qTQ');
  const data = JSON.parse(e.postData.contents);
  
  try {
    if (data.action === 'register') {
      let userSheet = sheet.getSheetByName('Users');
      if (!userSheet) {
        userSheet = sheet.insertSheet('Users');
        userSheet.getRange(1, 1, 1, 5).setValues([['Username', 'Email', 'Password', 'Gamertag', 'Timestamp']]);
      }
      
      userSheet.appendRow([data.username, data.email, data.password, data.gamertag, data.timestamp]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'User registered successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (data.action === 'match') {
      let matchSheet = sheet.getSheetByName('Matches');
      if (!matchSheet) {
        matchSheet = sheet.insertSheet('Matches');
        matchSheet.getRange(1, 1, 1, 4).setValues([['Username', 'Gamertag', 'Match Type', 'Applied At']]);
      }
      
      matchSheet.appendRow([data.username, data.gamertag, data.matchType, data.appliedAt]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Match application saved'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.openById('12O-DauPegla2pqR_2T7dUvXdwXSV0vUXZWNWzmL3qTQ');
  const action = e.parameter.action;
  
  try {
    if (action === 'getUsers') {
      const userSheet = sheet.getSheetByName('Users');
      if (!userSheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          users: []
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = userSheet.getDataRange().getValues();
      const users = [];
      
      for (let i = 1; i < data.length; i++) {
        users.push({
          username: data[i][0],
          email: data[i][1],
          password: data[i][2],
          gamertag: data[i][3],
          timestamp: data[i][4]
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        users: users
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}