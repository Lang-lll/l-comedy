import { Command } from 'commander'
import { dev } from './commands/dev'
import { build } from './commands/build'
import { test } from './commands/test'
import { runTsup } from './commands/tsup'

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

program
  .command('test')
  .description('Run test')
  .option('-c, --config <path>', '指定配置文件路径')
  .option('-t, --type <type>', '指定测试类型（unit/components/all）', 'all')
  .action(test)

program
  .command('tsup')
  .description('Run tsup build')
  .option('-c, --config <path>', '指定配置文件路径')
  .action(runTsup)

program.parse(process.argv)
