const NOTION_TOKEN = `${PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN')}`;
const DATABASE_ID = `${PropertiesService.getScriptProperties().getProperty('DATABASE_ID')}`;
const SPREADSHEET_ID = `${PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')}`;

const onRowAdd = () => {
  // const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheets()[0];
  const lastRow = sheet.getLastRow();

  const question = sheet.getRange(lastRow, 1).getValue();
  const answer = sheet.getRange(lastRow, 2).getValue();
  const payload = createPayload(question, answer);

  postNotion(payload);
};

const postNotion = (payload: any) => {
  const url = 'https://api.notion.com/v1/pages';
  UrlFetchApp.fetch(url, {
    'method': 'post',
    'headers': {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2021-05-13',
    },
    'payload': JSON.stringify(payload)
  });
};

const createPayload = (question: string, answer: string) => {
  return {
    'parent': {
      'database_id': DATABASE_ID
    },
    'properties': {
      'Question': {
        'title': [
          {
            'text': {
              'content': question
            }
          }
        ]
      },
      'Answer': {
        'rich_text': [
          {
            'text': {
              'content': answer
            }
          }
        ]
      }
    }
  }
}
