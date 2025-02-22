import * as fs from 'node:fs';
import { join, dirname } from 'node:path';


export const printVersion = () => {
  const packageJsonPath = join(dirname(new URL(import.meta.url).pathname), '..', '..', 'package.json');

  fs.readFile(packageJsonPath, 'utf-8', (err, data) => {
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
