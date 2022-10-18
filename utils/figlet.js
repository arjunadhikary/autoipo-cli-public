import figlet from 'figlet';
import gradient from 'gradient-string';

const cliFiglet = async () => {
  return new Promise((resolve, reject) => {
    figlet('Arjun Adhikari', function (err, data) {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        reject();
        return;
      }
      console.log(gradient.pastel.multiline(data));
      resolve(data);
    });
  });
};

export default cliFiglet;
