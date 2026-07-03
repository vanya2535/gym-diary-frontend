import { spawnSync } from 'node:child_process'

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  return result.status ?? 1
}

let exitCode = 0

exitCode |= run('eslint', ['.'])
exitCode |= run('prettier', ['--check', '.'])

process.exit(exitCode)
