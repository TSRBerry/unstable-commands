import * as core from '@actions/core'
import {getInputs} from './inputs'
import {runUnstableCommand} from './run'

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
