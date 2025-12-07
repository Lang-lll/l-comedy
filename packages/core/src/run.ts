import { Command } from 'commander'
import { dev } from './commands/dev'
import { build } from './commands/build'

const program = new Command()

program
  .command('dev')
  .description('Start development server')
  .option('-c, --config <path>', '指定配置文件路径')
  .action(dev)

program
  .command('build')
  .description('Build app')
  .option('-c, --config <path>', '指定配置文件路径')
  .action(build)

program.parse(process.argv)
