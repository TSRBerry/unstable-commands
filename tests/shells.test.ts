import {Shell, getShell} from '../src/shells'
import path from 'path'
import * as io from '@actions/io'
import {expect, test} from '@jest/globals'

test('shell for `default-shell` is not empty', async () => {
  const shell = await getShell('default-shell')

  expect(shell.executable).not.toHaveLength(0)
  expect(shell.args).not.toHaveLength(0)
})

test('shell for `` is not empty', async () => {
  const shell = await getShell('')

  expect(shell.executable).not.toHaveLength(0)
  expect(shell.args).not.toHaveLength(0)
})

test('io.which() finds tools (sanity check)', async () => {
  const tools = ['bash', 'sh', 'python']
  const expectedPaths = tools.map(x => path.join('/', 'usr', 'bin', x))

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i]
    const expectedPath = expectedPaths[i]

    await expect(io.which(tool)).resolves.toEqual(expectedPath)
  }
})

test('custom shell is processed correctly', async () => {
  const expected: Shell = {
    executable: path.join('/', 'usr', 'bin', 'cat'),
    args: ['--number', "'{0}'"],
    scriptSuffix: ''
  }

  const result = await getShell("cat --number '{0}'")

  expect(result).toStrictEqual(expected)
})

test('invalid custom shell throws', async () => {
  await expect(getShell('invalid')).rejects.toThrow(
    /Custom shell needs to have at least one argument/
  )
})
