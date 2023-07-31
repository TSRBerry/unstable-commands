import { expect, test } from '@jest/globals'
import { runUnstableCommand } from '../src/main'
import { getShell } from '../src/shells'

test('unstable command succeeds', async () => {
    const result = await runUnstableCommand(
        ['echo "Hello world!"'],
        await getShell('default-shell'),
        process.cwd(),
        1,
        3,
        [139]
    )

    expect(result).toEqual(0)
})
