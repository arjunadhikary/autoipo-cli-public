#!/usr/bin/env node
import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
import SearchBox from 'inquirer-search-list';
import {
  getAuthTokenFromFile,
  getUserFile,
  questionsForLogin,
} from './utils/util.js';
import cliFiglet from './utils/figlet.js';
import { authWithResponse } from './scripts/AuthWithResponse.js';
import fs from 'fs';
import applyIpoList from './scripts/IpoList.js';
import applyForIpo from './scripts/applyIpo.js';
import { homeScreenPrompt, ipoSelectPrompt } from './utils/prompts.js';

const greeting = chalk.green.bold('Welcome to Auto IPO Apply!');
inquirer.registerPrompt('search-list', SearchBox);
console.log(greeting);

/**
 * @TODO auto login on single click on second login attempt
 */
const login = async function () {
  try {
    const answers = await inquirer.prompt(questionsForLogin);
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
      console.log('Error');
      console.log(error.response.data);
    }
  }
};

const run = async (errorRun) => {
  try {
    if (!errorRun) await cliFiglet();

    const { options } = await inquirer.prompt(homeScreenPrompt);

    if (options.includes('Login to Meroshare')) await login();
    else if (options.includes('Apply From List of Available IPO')) {
      const availableList = await applyIpoList();
      availableList?.length !== 0
        ? availableList
        : [{ key: '-1', value: 'No IPO available' }];

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
      console.log(availableList);
      const { authToken, partialApplyObject } = getUserFile();
      for (let [index, val] of userChoice.list.entries()) {
        const res = await applyForIpo(authToken, {
          ...partialApplyObject,
          companyShareId: val,
          appliedKitta: '10',
        });
        console.log(
          chalk.red(
            `Hurray!!!! Applied ${10} units of share in ${
              availableList[index].name
            }${res.message} `
          )
        );
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
      console.log(error.response);
      console.log(chalk.redBright(error.response));
    } else {
      console.log(chalk.redBright(error));
    }
    run(true);
  }
};

run(false);
