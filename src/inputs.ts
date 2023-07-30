import * as core from '@actions/core'
import { Shell, getShell } from './shells'

export interface Inputs {
  commands: string[]
  shell: Shell
  working_directory: string
  timeout_minutes: number
  max_retries: number
  retry_codes: number[]
}

function parseIntOrThrow(input: string) {
  const result = parseInt(input)
  if (isNaN(result)) {
    throw new Error(`'${input}' is not a number.`)
  }
  return result
}

export async function getInputs(): Promise<Inputs> {
  return {
    commands: core.getMultilineInput('commands', { required: true }),
    shell: await getShell(core.getInput('shell')),
    working_directory: core.getInput('working-directory'),
    timeout_minutes: parseIntOrThrow(
      core.getInput('timeout-minutes', { required: true })
    ),
    max_retries: parseIntOrThrow(core.getInput('max-retries')),
    retry_codes: core
      .getInput('retry-codes', { required: true })
      .split(',')
      .map(x => parseIntOrThrow(x))
  }
}
