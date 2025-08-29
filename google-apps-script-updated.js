// Updated Google Apps Script for 24/7 Data Collection
// Copy this to Google Apps Script and deploy as Web App

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    if (action === 'register') {
      return handleRegistration(e.parameter);
    } else if (action === 'login') {
      return handleLogin(e.parameter);
    } else if (action === 'getUsers') {
      return getAllUsers();
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  return doGet(e);
}

function handleRegistration(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Add headers if first row is empty
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 6).setValues([['Timestamp', 'Name', 'Email', 'Phone', 'Game ID', 'Password']]);
  }
  
  // Add new registration
  const timestamp = new Date();
  const newRow = [
    timestamp,
    params.name || '',
    params.email || '',
    params.phone || '',
    params.gameId || '',
    params.password || ''
  ];
  
  sheet.appendRow(newRow);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true, 
      message: 'Registration successful!',
      timestamp: timestamp
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleLogin(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const email = row[2]; // Email column
    const password = row[5]; // Password column
    
    if (email === params.email && password === params.password) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          user: {
            name: row[1],
            email: row[2],
            phone: row[3],
            gameId: row[4]
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: false, message: 'Invalid credentials'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllUsers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const users = [];
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    users.push({
      timestamp: row[0],
      name: row[1],
      email: row[2],
      phone: row[3],
      gameId: row[4]
      // Don't send password for security
    });
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, users: users}))
    .setMimeType(ContentService.MimeType.JSON);
}