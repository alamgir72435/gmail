// const fs = require('fs');
// const readline = require('readline');
// const {google} = require('googleapis');

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Gmail API.
//   authorize(JSON.parse(content), listLabels);
// });

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// async function authorize(credentials, callback) {
//   const {client_secret, client_id, redirect_uris} = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(
//       client_id, client_secret, redirect_uris[0]);

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getNewToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });



// }

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getNewToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }

// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listLabels(auth) {
//   const gmail = google.gmail({version: 'v1', auth});
//   gmail.users.labels.list({
//     userId: 'me',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const labels = res.data.labels;
//     if (labels.length) {
//       console.log('Labels:');
//       labels.forEach((label) => {
//         console.log(`- ${label.name} : ${label.id}`);
//       });
//     } else {
//       console.log('No labels found.');
//     }
//   });

//   gmail.users.messages.list(
//       {
//         userId: 'me',
//         q: 'label:inbox subject:Hello ,I am GameOn07',
//       },
//       (err, res) => {
//         if (err) {
//            console.log(err);
//         }
//         if (!res.data.messages) {
//           // resolve([]);
//           console.log('ok');
//         }
//         console.log(res.data.messages);
//       }
//     );

// }


// async function read(){
//   const oAuth2Client = new google.auth.OAuth2(
//       '1088648390218-dciu193mb6t1kh2ggpgtc817qc3gso1h.apps.googleusercontent.com',
//        'ZJJ8Zd7JuTkXu6PHxulwgUeg', "http://localhost");
//     const messages = await listMessages(oAuth2Client, 'label:inbox subject:reminder');
//     console.log(messages)
// }

// read()

// function listMessages(auth, query) {
//   return new Promise((resolve, reject) => {
//     const gmail = google.gmail({version: 'v1', auth});
//     gmail.users.messages.list(
//       {
//         userId: 'me',
//         q: query,
//       },
//       (err, res) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         if (!res.data.messages) {
//           resolve([]);
//           return;
//         }
//         resolve(res.data.messages);
//       }
//     );
//   });
// }
// ==========================================================================================


const fs = require('fs');
const { google } = require('googleapis');
const TOKEN_PATH = 'token.json';

class ReadEmail {
  constructor(_dominio) {
    this.credentials = null;
    this.auth = null;
    this.message = null;
    this.dominio = _dominio;
  }

  async setup() {
    this.credentials = await this.getCredentials();
    this.auth = await this.getAuthorize();
    this.message = await this.getLastMessage();
    // console.log(this.message)
  }

  getCredentials() {
    return new Promise((resolve, reject) => {
      fs.readFile('credentials.json', (err, content) => {
        if (err) reject('Error loading client secret file:' + err);
        resolve(JSON.parse(content));
      });
    });
  }

  getAuthorize() {
    return new Promise((resolve, reject) => {
      const { client_secret, client_id, redirect_uris } = this.credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) reject('Erro ao pegar o Token: ' + err);
        oAuth2Client.setCredentials(JSON.parse(token));
        resolve(oAuth2Client);
      });
    });
  }

  getLastMessage() {
    return new Promise((resolve, reject) => {
      const gmail = google.gmail({ version: 'v1', auth: this.auth });
      var request = gmail.users.messages.list({
        userId: 'me',
        labelIds: 'INBOX',
        maxResults: 10,
      });
      request.then(ret => {
        ret.data.messages.forEach(message => {
          let id = message.id
            var request2 = gmail.users.messages.get({
              userId: 'me',
              id: id,
            });
            request2.then(ret2 => {
              let msg = ret2.data.payload.body.data;
              let buff = new Buffer.from(msg, 'base64');
              let text = buff.toString('ascii');
              // console.log(text)
              resolve(text);
            });
        })
        
      });
    });
  }
}
new ReadEmail('_dominio').setup();