import { Command } from 'commander'
import { dev } from './commands/dev'

const program = new Command()

program
  .command('dev')
  .description('Start development server')
  .option('-c, --config <path>', '指定配置文件路径')
  .action(dev)

program.parse(process.argv)
