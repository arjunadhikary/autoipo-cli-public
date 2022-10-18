import axios from 'axios';
import fs from 'fs';
const applyIpoList = async () => {
  const savedInfo = JSON.parse(
    fs.readFileSync('./.store.bin', {
      encoding: 'binary',
    })
  );
  //if no authorization throw error
  /**
   * @TODO handel error file no found
   */
  try {
    if (!savedInfo) throw new Error('Authenticate first');
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
        Authorization: savedInfo.authToken,
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
    throw new Error(error.response.data.message + ' Authenticate First');
  }
};

export default applyIpoList;
