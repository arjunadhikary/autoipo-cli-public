import data from './capital.js';
import fs from 'fs';
const getListofCaptial = () => {
  try {
    return data.map((dt) => {
      return { value: dt.id, name: dt.name };
    });
  } catch (error) {
    throw new Error('Error in provide captial data');
  }
};

const choices =
  getListofCaptial()?.length !== 0
    ? getListofCaptial()
    : [
        {
          key: '-1',
          value: 'no capital list available',
        },
      ];

const questionsForLogin = [
  {
    type: 'search-list',
    message: 'Select ClientID',
    name: 'clientId',
    choices,
  },
  {
    name: 'username',
    message: 'Enter username',
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter password',
  },
  {
    name: 'pincode',
    message: 'Enter pincode',
  },
  {
    name: 'crn',
    message: 'Enter crn number',
  },
];

const getUserFile = () => {
  try {
    return JSON.parse(fs.readFileSync('.store.bin', { encoding: 'binary' }));
  } catch (error) {
    throw new Error('No file available');
  }
};

const getAuthTokenFromFile = () => {
  try {
    const { authToken } = JSON.parse(
      fs.readFileSync('.store.bin', { encoding: 'binary' })
    );
    return authToken;
  } catch (error) {
    throw new Error(
      'Couldnot get auth token from file.either it is invalid or not present.please login again'
    );
  }
};
export {
  getListofCaptial,
  questionsForLogin,
  getUserFile,
  getAuthTokenFromFile,
};
