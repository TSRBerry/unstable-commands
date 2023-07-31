import os from 'os'
import {env} from 'process'
import * as io from '@actions/io'
import {argStringToArray} from '@actions/exec/lib/toolrunner'

export interface Shell {
  executable: string
  args: string[]
  scriptSuffix: string
}

// Define shells as GitHub Actions specifies for the shell keyword
// See: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsshell

async function getDefaultShell(): Promise<Shell> {
  const default_shell: Shell = {
    executable: '',
    args: [],
    scriptSuffix: ''
  }

  let shell_path = ''

  switch (os.platform()) {
    case 'linux':
    case 'darwin':
      default_shell.args = ['-e', '{0}']

      shell_path = await io.which('bash')
      if (shell_path.length > 0) {
        default_shell.executable = shell_path
        return default_shell
      }

      shell_path = await io.which('sh', true)
      default_shell.executable = shell_path
      return default_shell

    case 'win32':
      default_shell.args = ['-command', ". '{0}'"]
      default_shell.scriptSuffix = '.ps1'

      shell_path = await io.which('pwsh')
      if (shell_path.length > 0) {
        default_shell.executable = shell_path
        return default_shell
      }

      shell_path = await io.which('powershell', true)
      default_shell.executable = shell_path
      return default_shell

    default:
      throw new Error(`Couldn't find default shell for OS: ${os.platform()}`)
  }
}

export async function getShell(shellInput: string): Promise<Shell> {
  if (shellInput.length === 0 || shellInput === 'default-shell') {
    return getDefaultShell()
  }

  const shell: Shell = {
    executable: '',
    args: [],
    scriptSuffix: ''
  }

  const customShellSplit = shellInput.split(' ')

  switch (shellInput) {
    case 'bash':
      shell.executable = await io.which('bash', true)
      shell.args = ['--noprofile', '--norc', '-eo', 'pipefail', '{0}']
      break

    case 'pwsh':
      shell.executable = await io.which('pwsh', true)
      shell.args = ['-command', ". '{0}'"]
      shell.scriptSuffix = '.ps1'
      break

    case 'python':
      shell.executable = await io.which('python', true)
      shell.args = ['{0}']
      break

    case 'sh':
      shell.executable = await io.which('sh', true)
      shell.args = ['-e', '{0}']
      break

    case 'cmd':
      shell.executable = env.COMSPEC ?? (await io.which('cmd', true))
      shell.args = ['/D', '/E:ON', '/V:OFF', '/S', '/C', 'CALL "{0}"']
      shell.scriptSuffix = '.cmd'
      break

    case 'powershell':
      shell.executable = await io.which('powershell', true)
      shell.args = ['-command', ". '{0}'"]
      shell.scriptSuffix = '.ps1'
      break

    default:
      // Custom shell
      // See: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#custom-shell
      if (customShellSplit.length >= 2) {
        shell.executable = await io.which(customShellSplit[0], true)
        customShellSplit.shift()
        shell.args = argStringToArray(customShellSplit.join(' '))
        break
      }

      throw new Error("Custom shell needs to have at least one argument: '{0}'")
  }

  return shell
}
