<p align="center">
  <a href="https://github.com/TSRBerry/unstable-commands/actions"><img alt="unstable-commands status" src="https://github.com/TSRBerry/unstable-commands/workflows/Test/badge.svg"></a>
</p>

# Unstable commands

A GitHub Action to retry commands if weird things happen.

## Inputs

### `commands`

**Required** The commands to run. Use this like the `run` keyword for [steps](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsrun).

### `timeout-minutes`

**Required** Maximum number of minutes to wait for the commands to finish execution. Use this like the `timeout-minutes` keyword for [steps](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepstimeout-minutes).

### `retry-codes`

**Required** A comma-separated value containing the exit codes which should cause a retry.

### `shell`

**Optional** The shell to use to run the commands. Use this like the `shell` keyword for [steps](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsshell). Default `"default-shell"`.

### `working-directory`

**Optional** The working directory where the commands are executed in. Use this like the `working-directory` keyword for steps. Default `${{ github.workspace }}`.

### `max-retries`

**Optional** Maximum amount of times the specified commands should be tried before giving up. Default `"3"`.

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
