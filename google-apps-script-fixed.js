// Updated Google Apps Script Code - Copy this to replace your existing code

function doPost(e) {
  try {
    console.log('doPost called');
    const sheet = SpreadsheetApp.openById('12O-DauPegla2pqR_2T7dUvXdwXSV0vUXZWNWzmL3qTQ');
    const data = JSON.parse(e.postData.contents);
    console.log('Received data:', data);
    
    if (data.action === 'register') {
      let userSheet = sheet.getSheetByName('Users');
      if (!userSheet) {
        userSheet = sheet.insertSheet('Users');
        userSheet.getRange(1, 1, 1, 5).setValues([['Phone', 'Email', 'Password', 'Gaming Tag', 'Timestamp']]);
      }
      
      userSheet.appendRow([data.phone, data.email, data.password, data.gamertag, data.timestamp]);
      console.log('User registered successfully');
      
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
      console.log('Match application saved');
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Match application saved'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    console.log('doGet called');
    const sheet = SpreadsheetApp.openById('12O-DauPegla2pqR_2T7dUvXdwXSV0vUXZWNWzmL3qTQ');
    const action = e.parameter.action;
    console.log('Action:', action);
    
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
          phone: data[i][0],
          email: data[i][1],
          password: data[i][2],
          gamertag: data[i][3],
          timestamp: data[i][4]
        });
      }
      
      console.log('Users retrieved:', users.length);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        users: users
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'getMatches') {
      const matchSheet = sheet.getSheetByName('Matches');
      if (!matchSheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          matches: []
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = matchSheet.getDataRange().getValues();
      const matches = [];
      
      for (let i = 1; i < data.length; i++) {
        matches.push({
          username: data[i][0],
          gamertag: data[i][1],
          matchType: data[i][2],
          appliedAt: data[i][3]
        });
      }
      
      console.log('Matches retrieved:', matches.length);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        matches: matches
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}