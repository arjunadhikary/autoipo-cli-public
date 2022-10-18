const ipoSelectPrompt = [
  {
    type: 'checkbox',
    name: 'list',
    message: 'Which IPO you want to apply. Select Multiple From List?',
  },
];

const homeScreenPrompt = [
  {
    type: 'rawlist',
    name: 'options',
    message: 'Press Any Options',
    choices: ['Login to Meroshare', 'Apply From List of Available IPO', 'Exit'],
  },
];

export { ipoSelectPrompt, homeScreenPrompt };
