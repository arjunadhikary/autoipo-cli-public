import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs';
import { getUserFile } from '../utils/util.js';
import applyForIpo from './applyIpo.js';
import { loginForAuthOnly } from './AuthWithResponse.js';
const applyIpoList = async () => {
  //if no authorization throw error
  /**
   * @TODO handel error file no found
   */
  try {
    const { authToken } = getUserFile();
    var data = JSON.stringify({
      filterFieldParams: [
        {
          key: 'companyIssue.companyISIN.script',
          alias: 'Scrip',
        },
        {
          key: 'companyIssue.companyISIN.company.name',
          alias: 'Company Name',
        },
        {
          key: 'companyIssue.assignedToClient.name',
          value: '',
          alias: 'Issue Manager',
        },
      ],
      page: 1,
      size: 10,

      searchRoleViewConstants: 'VIEW_APPLICABLE_SHARE',
      filterDateParams: [
        {
          key: 'minIssueOpenDate',
          condition: '',
          alias: '',
          value: '',
        },
        {
          key: 'maxIssueCloseDate',
          condition: '',
          alias: '',
          value: '',
        },
      ],
    });

    var config = {
      method: 'post',
      url: 'https://webbackend.cdsc.com.np/api/meroShare/companyShare/applicableIssue/',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        Authorization: authToken,
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
        DNT: '1',
        Origin: 'https://meroshare.cdsc.com.np',
        Referer: 'https://meroshare.cdsc.com.np/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Mobile Safari/537.36 Edg/105.0.1343.50',
        'sec-ch-ua':
          '"Microsoft Edge";v="105", " Not;A Brand";v="99", "Chromium";v="105"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
      },
      data: data,
    };

    const response = await axios(config);
    return response.data.object.map((dt) => {
      return {
        value: dt.companyShareId,
        name: `${dt.companyName}\t[${dt.shareTypeName}]\t[${dt.shareGroupName}]`,
      };
    });
  } catch (error) {
    try {
      if (error.message.includes('No file available')) {
        throw new Error('Login First');
      }
      console.log('Trying to authenticated from the user file');
      const userFile = getUserFile();
      if (userFile) {
        const { clientId, username, password } = userFile.authData;
        console.log('Getting new Auth token.....');
        const newauthToken = await loginForAuthOnly(
          clientId,
          username,
          password
        );
        console.log(newauthToken);
        if (newauthToken !== null) {
          userFile.authToken = newauthToken;
          fs.writeFileSync('.store.bin', JSON.stringify(userFile));
          console.log('Authenticated ');
          applyIpoList();
        } else {
          console.log(
            chalk.redBright(
              'Using this system for the first time? Press Option 1 to login first'
            )
          );
          throw new Error(
            'Using this system for the first time? Press Option 1 to login first'
          );
        }
      }
    } catch (error) {
      if (error.response) console.log(error.response.message);
      throw new Error(
        'Using this system for the first time? Press Option 1 to login first'
      );
    }
  }
};

export default applyIpoList;
