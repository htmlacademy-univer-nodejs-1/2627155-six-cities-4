#!/usr/bin/env -S node --loader ts-node/esm

import { importData } from './cli/import.ts';
import { printVersion } from './cli/version.ts';
import { printHelp } from './cli/help.ts';
import { generateRandomOffersTSV } from './cli/generate.ts';

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    return;
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

    case '--generate':
      if (args[1] && args[2] && args[3]) {
        await generateRandomOffersTSV(parseInt(args[1], 10), args[2], new URL(args[3]));
      } else {
        console.log('Укажите аргументы в формате <n> <path> <url>');
      }
      break;

    default:
      console.log('Неизвестная команда. Для справки используйте --help');
      break;
  }
};

main();
