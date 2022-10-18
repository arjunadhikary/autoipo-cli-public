#!/usr/bin/env node
import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
import SearchBox from 'inquirer-search-list';
import getListofCaptial from './utils/util.js';
import cliFiglet from './utils/figlet.js';
import authWithResponse from './scripts/AuthWithResponse.js';
import fs from 'fs';
import applyIpoList from './scripts/IpoList.js';
import applyForIpo from './scripts/applyIpo.js';

const greeting = chalk.green.bold('Welcome to Auto IPO Apply!');
inquirer.registerPrompt('search-list', SearchBox);

console.log(greeting);

/**
 * @TODO auto login on single click on second login attempt
 */
const login = async function () {
  try {
    const choices =
      getListofCaptial()?.length !== 0
        ? getListofCaptial()
        : [
            {
              key: 'a',
              value: 'alligator',
            },
          ];

    const answers = await inquirer.prompt([
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
    ]);
    const data = await authWithResponse(
      parseInt(answers.clientId),
      answers.username,
      answers.password,
      answers.pincode,
      answers.crn
    );
    fs.writeFileSync('.store.bin', JSON.stringify(data));
    run(true);
  } catch (error) {
    if (error.isTtyError) {
      console.log(`Prompt couldn't be rendered in the current environment`);
    } else {
      console.log(error.response.data);
    }
  }
};

const run = async (errorRun) => {
  try {
    if (!errorRun) await cliFiglet();

    const { options } = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'options',
        message: 'Press Any Options',
        choices: ['Login to Meroshare', 'List Available IPO', 'Exit'],
      },
    ]);

    if (options.includes('Login to Meroshare')) {
      await login();
    } else if (options.includes('List Available IPO')) {
      const availableList = await applyIpoList();

      availableList?.length !== 0
        ? availableList
        : [{ key: '1', value: 'No IPO available' }];

      const userChoice = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'list',
          message: 'Which IPO you want to apply. Select Multiple From List?',
          choices:
            availableList?.length !== 0
              ? availableList
              : [{ key: '1', value: 'No IPO available' }],
        },
      ]);
      const { authToken, partialApplyObject } = JSON.parse(
        fs.readFileSync('./.store.bin', { encoding: 'binary' })
      );
      for (const ipo of userChoice.list) {
        await applyForIpo(authToken, {
          ...partialApplyObject,
          companyShareId: ipo,
          appliedKitta: '10',
        });
      }
    } else {
      process.exit(1);
    }
  } catch (error) {
    if (error.isTtyError) {
      console.log(
        chalk.redBright(
          `Prompt couldn't be rendered in the current environment`
        )
      );
    } else if (error.response) {
      console.log(chalk.redBright(error.response));
    } else {
      console.log(chalk.redBright(error));
    }
    run(true);
  }
};

run(false);
