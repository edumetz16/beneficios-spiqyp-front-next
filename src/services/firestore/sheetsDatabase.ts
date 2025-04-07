import {google} from "googleapis";
import moment from "moment";

type User = {
  affiliateNumber: number,
                  name: string,
                  relationship: string,
                  govId: string,
                  company: string,
}
export default class sheetsDatabase {
  serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT || '{}');
  clientAuth = new google.auth.JWT(
      this.serviceAccount.client_email, undefined, this.serviceAccount.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
  );
  sheetsAPI = google.sheets({version: "v4"});
  spreadsheetId = "1pbkmSTdSdhtvYZrhm2VDZAEfrvWhYNmlCy5-WN20DJ8";

  getAllUsers() {
    return new Promise(async (resolve, reject)=>{
      try {
        const response = await this.sheetsAPI.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "Afiliados!A:Z",
          key: "AIzaSyBvIzOhe_imZAQtXWq3UVolFp8QoCjXXvA",
          auth: this.clientAuth,
        });
        if (response.data.values) {
          resolve(response.data.values);
        } else {
          reject(new Error("No values for queried data"));
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  async getUserByField(value: string, field: number) {
    try {
      const response = await this.sheetsAPI.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Afiliados!A:Z",
        key: "AIzaSyBvIzOhe_imZAQtXWq3UVolFp8QoCjXXvA",
        auth: this.clientAuth,
      });
      if (response.data.values) {
        const fields = response.data.values[0];
        for (const row of response.data.values) {
          if (row[field] === value) {
            const user: any = {};
            for (let i = 0; i < fields.length; i++) {
              const fieldName = new String(fields[i]).valueOf();
              user[fieldName] = row[i];
            }
            return user;
          }
        }
        throw new Error("No user matches the search");
      } else {
        throw new Error("No user matches the search");
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  getUsersByAffiliateNumber(affiliateNumber: string) {
    return new Promise(async (resolve, reject)=>{
      try {
        const users: User[] = [];

        const response = await this.sheetsAPI.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "Afiliados!A:Z",
          key: "AIzaSyBvIzOhe_imZAQtXWq3UVolFp8QoCjXXvA",
          auth: this.clientAuth,
        });
        if (response.data.values) {
          const rows = response.data.values;
          let affiliateGroupNumber;
          for (const user of rows) {
            if (user[3] === affiliateNumber && user[6] === "Afiliado") {
              affiliateGroupNumber = user[0];
              break;
            }
          }
          for (const user of rows) {
            if (user[0] === affiliateGroupNumber) {
              const age = moment().diff(moment(user[9], "DD/MM/YYYY"), "years");
              if (user[6] !== "Hijo/a" || age < 19) {
                users.push({
                  affiliateNumber: user[0],
                  name: user[1],
                  relationship: user[6],
                  govId: user[3],
                  company: user[10],
                });
              }
            }
          }
          resolve(users);
        } else {
          reject(new Error("No values for queried data"));
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  isValidAfiiliate =  async (affiliateNumber: string, govId: string) => {
      try {
        let isValid = false;
        const users: User[] = [];

        const response = await this.sheetsAPI.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "Afiliados!A:Z",
          key: "AIzaSyBvIzOhe_imZAQtXWq3UVolFp8QoCjXXvA",
          auth: this.clientAuth,
        });
        if (response.data.values) {
          const rows = response.data.values;
          for (const user of rows) {

            if (user[3] === govId) {
              isValid = true;
              break;
            }
            // Uncomment to validate affiliate number
            // if (user[0] === affiliateNumber && user[3] === document) {
            //   isValid = true;
            //   break;
            //   // const age = moment().diff(moment(user[9], "DD/MM/YYYY"), "years");
            //   // if (user[6] !== "Hijo/a" || age < 19) {
                
            //   // }
            // }
          }
          return isValid;
        } else {
          throw(new Error("No values for queried data"));
        }
      } catch (e) {
        console.log(e);
        throw(e);
      }
  }
}
