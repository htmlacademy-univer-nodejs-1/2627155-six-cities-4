#!/usr/bin/env -S node --loader ts-node/esm

import { importData } from './cli/import.ts'
import { printVersion } from './cli/version.ts'
import { printHelp } from  './cli/help.ts'


const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Не указана команда. Для справки используйте --help');
  process.exit(1);
}

switch (args[0]) {
  case '--help':
    printHelp();
    break;

  case '--version':
    printVersion();
    break;

  case '--import':
    if (args[1]) {
      importData(args[1]);
    } else {
      console.log('Укажите путь к файлу для импорта.');
    }
    break;

  default:
    console.log('Неизвестная команда. Для справки используйте --help');
    break;
}
