import chalk from 'chalk';


export const printHelp = () => {
  console.log(`
Программа для подготовки данных для REST API сервера.

Пример: cli.ts --<${chalk.blue('command')}> [${chalk.green('--arguments')}]

Команды:

 ${chalk.green('--version')}:                   ${chalk.magenta('# выводит номер версии')}
 ${chalk.green('--help')}:                      ${chalk.magenta('# печатает этот текст')}
 ${chalk.green('--import')} <path>:             ${chalk.magenta('# импортирует данные из TSV')}
 ${chalk.green('--generate')} <n> <path> <url> ${chalk.magenta('# генерирует произвольное количество тестовых данных')}
`);
};
