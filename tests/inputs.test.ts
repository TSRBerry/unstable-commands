import { expect, test } from '@jest/globals'
import { Inputs, getInputs } from '../src/inputs'

test.concurrent('valid inputs are parsed correctly', async () => {
    process.env['INPUT_COMMANDS'] = 'echo "Hello world!"'
    process.env['INPUT_SHELL'] = 'default-shell'
    process.env['INPUT_WORKING-DIRECTORY'] = process.cwd()
    process.env['INPUT_TIMEOUT-MINUTES'] = '2'
    process.env['INPUT_MAX-RETRIES'] = '3'
    process.env['INPUT_RETRY-CODES'] = '1,139'

    const expected: Inputs = {
        commands: ['echo "Hello world!"'],
        shell: {
            executable: '/usr/bin/bash',
            args: ['-e', '{0}'],
            scriptSuffix: '',
        },
        working_directory: process.cwd(),
        timeout_minutes: 2,
        max_retries: 3,
        retry_codes: [1, 139],
    }

    await expect(getInputs()).resolves.toStrictEqual(expected)
})

test.concurrent('invalid inputs throw', async () => {
    process.env['INPUT_COMMANDS'] = 'echo "Hello world!"'
    process.env['INPUT_SHELL'] = 'default-shell'
    process.env['INPUT_WORKING-DIRECTORY'] = process.cwd()
    process.env['INPUT_TIMEOUT-MINUTES'] = '2'
    process.env['INPUT_MAX-RETRIES'] = '3'
    process.env['INPUT_RETRY-CODES'] = '----,invalid'

    await expect(getInputs()).rejects.toThrow(/is not a number/)
})

test.concurrent('providing only one retry code works as well', async () => {
    process.env['INPUT_COMMANDS'] = 'echo "Hello world!"'
    process.env['INPUT_SHELL'] = 'default-shell'
    process.env['INPUT_WORKING-DIRECTORY'] = process.cwd()
    process.env['INPUT_TIMEOUT-MINUTES'] = '2'
    process.env['INPUT_MAX-RETRIES'] = '3'
    process.env['INPUT_RETRY-CODES'] = '139'

    const expected: Inputs = {
        commands: ['echo "Hello world!"'],
        shell: {
            executable: '/usr/bin/bash',
            args: ['-e', '{0}'],
            scriptSuffix: '',
        },
        working_directory: process.cwd(),
        timeout_minutes: 2,
        max_retries: 3,
        retry_codes: [139],
    }

    await expect(getInputs()).resolves.toStrictEqual(expected)
})
