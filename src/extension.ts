// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { workspace, commands, ExtensionContext, window } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "diff-hour" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand('diff-hour.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    window.showInformationMessage('Hello World from Diff Hour!');
  });
  workspace.onDidChangeTextDocument(e => handleHours(e.document.getText()));
  workspace.onDidChangeTextDocument(e => handleHours(e.document.getText()));
  window.onDidChangeActiveTextEditor(e => handleHours(e?.document.getText() ?? ''));
  handleHours(window.activeTextEditor?.document.getText() ?? '');
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function handleHours(text: string) {
  const pattern =
    /(?:[0-9]{2}\/[0-9]{2} - )\[(?:([0-9]{2}:[0-9]{2})[\s]*[\| | \- | \/ | \t]+[\s]*([0-9]{2}:[0-9]{2}))+(?:[\s]*[\| | \- | \/ | \t]*[\s]*)(?:([0-9]{2}:[0-9]{2})[\s]*[\| | \- | \/ | \t]+[\s]*([0-9]{2}:[0-9]{2}))*(?:[\s]*[\| | \- | \/ | \t]*[\s]*)(?:([0-9]{2}:[0-9]{2})[\s]*[\| | \- | \/ | \t]+[\s]*([0-9]{2}:[0-9]{2}))*(?:[\s]*[\| | \- | \/ | \t]*[\s]*)(?:([0-9]{2}:[0-9]{2})[\s]*[\| | \- | \/ | \t]+[\s]*([0-9]{2}:[0-9]{2}))*\]/;
  const regex = new RegExp(pattern, 'gm');
  if (pattern.test(text)) {
    const result = regex
      .exec(text)
      ?.filter(items => !!items)
      .slice(1);

    const diffHour = result?.reduce((previous, value, index) => {
      if (index % 2 === 1) {
        const hour1 = getSecondsFromString(value);
        const hour2 = getSecondsFromString(result[index - 1]);
        const diff = hour1 - hour2;
        return previous + diff;
      }
      return previous;
    }, 0);
    const hour = secondsToHours(diffHour ?? 0);
    console.log(hour);
  }
}

function getSecondsFromString(value: string) {
  return value
    .split(':')
    .reduce(
      (previous, current, index) => (index === 0 ? +current * 3600 : +current * 60 + previous),
      1
    );
}

function secondsToHours(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
