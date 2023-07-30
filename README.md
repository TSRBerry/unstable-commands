<p align="center">
  <a href="https://github.com/TSRBerry/unstable-commands/actions"><img alt="unstable-commands status" src="https://github.com/TSRBerry/unstable-commands/workflows/Test/badge.svg"></a>
</p>

# Unstable commands action

An action to retry commands if weird things happen.

## Inputs

### `commands`

**Required** The commands to run. Use this like the `run` keyword for steps.

### `timeout-minutes`

**Required** Maximum number of minutes to wait for the commands to finish execution. Use this like the `timeout-minutes` keyword for steps.

### `retry-codes`

**Required** A comma-separated value containing the exit codes which should cause a retry.

### `shell`

The shell to use to run the commands. Use this like the `shell` keyword for steps. Default `"default-shell"`.

### `working-directory`

The working directory where the commands are executed in. Use this like the `working-directory` keyword for steps. Default `${{ github.workspace }}`.

### `max-retries`

Maximum amount of times the specified commands should be tried before giving up. Default `"3"`.

## Example usage

```yaml
uses: TSRBerry/unstable-commands@v1
with:
  commands: |
    echo "Hello!"
    sleep 2m
    echo "Bye!"
  timeout-minutes: "3"
  retry-codes: "1,2,139"
```
