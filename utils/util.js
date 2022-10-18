import data from './capital.js';

const getListofCaptial = () => {
  try {
    return data.map((dt) => {
      return { value: dt.id, name: dt.name };
    });
  } catch (error) {
    throw new Error('Error in provide captial data');
  }
};
export default getListofCaptial;
