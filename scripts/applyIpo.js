import axios from 'axios';

/**
 *
 * @TODO make promise
 */
const applyForIpo = async function (auth, data) {
  try {
    var config = {
      method: 'post',
      url: 'https://webbackend.cdsc.com.np/api/meroShare/applicantForm/share/apply',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        Authorization: auth,
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
        DNT: '1',
        Origin: 'https://meroshare.cdsc.com.np',
        Referer: 'https://meroshare.cdsc.com.np/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36 Edg/106.0.1370.42',
        'sec-ch-ua':
          '"Chromium";v="106", "Microsoft Edge";v="106", "Not;A=Brand";v="99"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
      },
      data,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response.data);
  }
};

export default applyForIpo;
