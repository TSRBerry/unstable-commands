import * as core from '@actions/core'
import { spawnSync } from 'child_process'
import { getInputs } from './inputs'
import { Shell } from './shells'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

interface UnstableResult {
  exitCode: number | null
  error?: Error
}

export async function runUnstableCommand(
  commands: string[],
  shell: Shell,
  workingDirectory: string,
  timeoutMinutes: number,
  maxRetries: number,
  retryCodes: number[]
): Promise<number | null> {
  const filepath = path.join(
    os.tmpdir(),
    `unstable-command${shell.scriptSuffix}`
  )

  if (shell.args.filter(x => x.includes("{0}")).length == 0) {
    throw new Error("Shell does not contain the required argument: '{0}'")
  }

  core.debug(`Writing commands to temporary file: ${filepath}`)
  await fs.writeFile(filepath, commands.join(os.EOL))
  core.debug('File was written successfully!')

  const shellArgs: string[] = [];
  for (const arg of shell.args) {
    if (arg.includes("{0}")) {
      shellArgs.push(arg.replace("{0}", filepath))
      continue
    }
    shellArgs.push(arg)
  }

  let result: UnstableResult | null = null

  for (let i = 1; i <= maxRetries; i++) {
    result = await core.group(
      `Attempt ${i}/${maxRetries}`,
      async (): Promise<UnstableResult> => {
        core.debug('Executing temporary script...')
        const process = spawnSync(shell.executable, shellArgs, {
          cwd: workingDirectory,
          killSignal: 'SIGKILL',
          timeout: timeoutMinutes * 60 * 1000,
          stdio: 'inherit'
        })
        core.debug('Child process exited.')

        const unstableResult: UnstableResult = {
          exitCode: process.status
        }

        if (process.error !== undefined) {
          unstableResult.error = process.error
        }

        return unstableResult
      }
    )

    if (result.exitCode === null || retryCodes.includes(result.exitCode)) {
      if (result.exitCode === null) {
        core.warning(`Process was killed due to a timeout.`)
        core.debug(`${result.error?.name}: ${result.error?.message}`)
      } else {
        core.warning(
          `Process exited with code '${result.exitCode}' which is part of the specified retry-codes.`
        )
      }
    } else {
      core.info(`Process exited with code '${result.exitCode}'.`)

      return result.exitCode
    }
  }

  core.error(`Aborting after ${maxRetries} attempts.`)
  core.setFailed(
    result?.error ??
    `Child process never returned with a good exit code. Giving up after ${maxRetries} attempts.`
  )

  return null
}

async function run(): Promise<void> {
  try {
    core.debug('Getting inputs...')
    const inputs = await getInputs()

    core.debug('Running unstable command function...')
    const result = await runUnstableCommand(
      inputs.commands,
      inputs.shell,
      inputs.working_directory,
      inputs.timeout_minutes,
      inputs.max_retries,
      inputs.retry_codes
    )

    if (result !== null && result !== 0) {
      core.setFailed(`Child process exited with code: ${result}`)
      return
    }

    core.info('Successfully completed unstable command!')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
