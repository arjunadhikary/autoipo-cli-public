import axios from 'axios';
import BASEURL from '../utils/constants.js';

const getBankDetails = async (authToken, code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(`${BASEURL}/api/meroShare/bank/${code}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
      });
      resolve(res);
    } catch (error) {
      reject(error.response.data);
    }
  });
};

const ownDetailForBoidAndDemat = async (authToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await axios.get(`${BASEURL}/api/meroShare/ownDetail/`, {
        headers: {
          Authorization: authToken,
        },
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
const auth = async (clientId, username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(`${BASEURL}/api/meroShare/auth/`, {
        clientId,
        username,
        password,
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

const getBankCode = async (authToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await axios.get(`${BASEURL}/api/meroShare/bank/`, {
        headers: {
          Authorization: authToken,
        },
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const authWithResponse = async (clientId, username, password, pincode, crn) => {
  try {
    let finalData = {};
    const data = await auth(clientId, username, password);
    const authToken = data.headers.authorization;

    const ownDetail = await ownDetailForBoidAndDemat(authToken);

    const bankCodeResponse = await getBankCode(authToken);

    const bankDetails = await getBankDetails(
      authToken,
      bankCodeResponse.data[0].id
    );

    finalData = {
      authToken,
      authData: {
        clientId,
        username,
        password,
      },
      partialApplyObject: {
        customerId: bankDetails.data.id,
        accountNumber: bankDetails.data.accountNumber,
        accountBranchId: bankDetails.data.branchID,
        demat: ownDetail.data.demat,
        boid: ownDetail.data.boid,
        bankId: bankDetails.data.bankId,
        transactionPIN: pincode,
        crnNumber: crn,
      },
    };
    return finalData;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const loginForAuthOnly = async (clientId, username, password) => {
  try {
    const data = await auth(clientId, username, password);
    return data.headers.authorization;
  } catch (error) {
    console.log(error.response.data);
    return null;
  }
};

export { authWithResponse, loginForAuthOnly };
