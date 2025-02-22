import * as fs from 'node:fs';


export const printVersion = () => {
  fs.readFile('package.json', 'utf-8', (err, data) => {
    if (err) {
      console.log('Не удалось прочитать файл package.json');
      process.exit(1);
    }
    try {
      const packageJson = JSON.parse(data);
      console.log(packageJson.version);
    } catch (parseError) {
      console.log('Ошибка при парсинге файла package.json');
      process.exit(1);
    }
  });
};
