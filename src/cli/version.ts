import * as fs from 'node:fs';
import { join, dirname } from 'node:path';


export const printVersion = () => {
  const packageJsonPath = join(dirname(new URL(import.meta.url).pathname), '..', '..', 'package.json');

  fs.readFile(packageJsonPath, 'utf-8', (err, data) => {
    if (err) {
      throw new Error('Не удалось прочитать файл package.json');
    }
    try {
      const packageJson = JSON.parse(data);
      console.log(packageJson.version);
    } catch (parseError) {
      throw new Error('Ошибка при парсинге файла package.json');
    }
  });
};
