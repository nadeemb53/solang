import * as assert from 'assert';

import * as vscode from 'vscode';
import { getDocUri, activate } from './helper';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as myExtension from '../../extension';

suite('Extension Test Suite', function () {
  vscode.window.showInformationMessage('Start all tests.');

  this.timeout(20000);
  const diagnosdoc1 = getDocUri('one.sol');
  test('Testing for Row and Col pos.', async () => {
    await testdiagnos(diagnosdoc1, [
      {
        message: `unrecognised token 'aa', expected "(", ";", "="`,
        range: toRange(5, 0, 5, 2),
        severity: vscode.DiagnosticSeverity.Error,
        source: 'solidity',
      },
    ]);
  });

  this.timeout(20000);
  const diagnosdoc2 = getDocUri('two.sol');
  test('Testing for diagnostic errors.', async () => {
    await testdiagnos(diagnosdoc2, [
      {
        message:
          `unrecognised token '}', expected "!", "(", "+", "++", "-", "--", "[", "address", "bool", "byte", "bytes", "case", "default", "delete", "false", "function", "leave", "mapping", "new", "payable", "revert", "string", "switch", "true", "type", "~", Bytes, Int, Uint, address, hexnumber, hexstring, identifier, number, rational, string`,
        range: toRange(13, 1, 13, 2),
        severity: vscode.DiagnosticSeverity.Error,
        source: 'solidity',
      },
    ]);
  });

  this.timeout(20000);
  const diagnosdoc3 = getDocUri('three.sol');
  test('Testing for diagnostic info.', async () => {
    await testdiagnos(diagnosdoc3, []);
  });

  this.timeout(20000);
  const diagnosdoc4 = getDocUri('four.sol');
  test('Testing for diagnostics warnings.', async () => {
    await testdiagnos(diagnosdoc4, [
      {
        message: `unknown pragma 'foo' with value 'bar' ignored`,
        range: toRange(0, 0, 0, 14),
        severity: vscode.DiagnosticSeverity.Warning,
        source: `solidity`,
      },
      {
        message: `function can be declared 'pure'`,
        range: toRange(3, 5, 3, 40),
        severity: vscode.DiagnosticSeverity.Warning,
        source: `solidity`,
      },
    ]);
  });

  // Tests for hover.
  this.timeout(20000);
  const hoverdoc1 = getDocUri('hover1.sol');
  test('Testing for Hover', async () => {
    await testhover(hoverdoc1);
  });

  // Tests for goto-definitions.
  this.timeout(20000);
  const defdoc1 = getDocUri('defs.sol');
  test('Testing for GotoDefinitions', async () => {
    await testdefs(defdoc1);
  });

  // Tests for goto-type-definitions.
  this.timeout(20000);
  const typedefdoc1 = getDocUri('defs.sol');
  test('Testing for GotoTypeDefinitions', async () => {
    await testtypedefs(typedefdoc1);
  });

  // Tests for goto-impls
  this.timeout(20000);
  const implsdoc1 = getDocUri('impls.sol');
  test('Testing for GotoImplementations', async () => {
    await testimpls(implsdoc1);
  });

  // Tests for goto-references
  this.timeout(20000);
  const refsdoc1 = getDocUri('defs.sol');
  test('Testing for GotoReferences', async () => {
    await testrefs(refsdoc1);
  });

});

function toRange(lineno1: number, charno1: number, lineno2: number, charno2: number) {
  const start = new vscode.Position(lineno1, charno1);
  const end = new vscode.Position(lineno2, charno2);
  return new vscode.Range(start, end);
}

async function testdefs(docUri: vscode.Uri) {
  await activate(docUri);

  const pos1 = new vscode.Position(38, 16);
  const actualdef1 = (await vscode.commands.executeCommand(
    'vscode.executeDefinitionProvider',
    docUri,
    pos1
  )) as vscode.Definition[];
  const loc1 = actualdef1[0] as vscode.Location;
  assert.strictEqual(loc1.range.start.line, 27);
  assert.strictEqual(loc1.range.start.character, 24);
  assert.strictEqual(loc1.range.end.line, 27);
  assert.strictEqual(loc1.range.end.character, 25);
  assert.strictEqual(loc1.uri.path, docUri.path);

  const pos2 = new vscode.Position(33, 18);
  const actualdef2 = (await vscode.commands.executeCommand(
    'vscode.executeDefinitionProvider',
    docUri,
    pos2
  )) as vscode.Definition[];
  const loc2 = actualdef2[0] as vscode.Location;
  assert.strictEqual(loc2.range.start.line, 27);
  assert.strictEqual(loc2.range.start.character, 50);
  assert.strictEqual(loc2.range.end.line, 27);
  assert.strictEqual(loc2.range.end.character, 55);
  assert.strictEqual(loc2.uri.path, docUri.path);

  const pos3 = new vscode.Position(32, 31);
  const actualdef3 = (await vscode.commands.executeCommand(
    'vscode.executeDefinitionProvider',
    docUri,
    pos3
  )) as vscode.Definition[];
  const loc3 = actualdef3[0] as vscode.Location;
  assert.strictEqual(loc3.range.start.line, 19);
  assert.strictEqual(loc3.range.start.character, 8);
  assert.strictEqual(loc3.range.end.line, 19);
  assert.strictEqual(loc3.range.end.character, 12);
  assert.strictEqual(loc3.uri.path, docUri.path);

  const pos4 = new vscode.Position(29, 18);
  const actualdef4 = (await vscode.commands.executeCommand(
    'vscode.executeDefinitionProvider',
    docUri,
    pos4
  )) as vscode.Definition[];
  const loc4 = actualdef4[0] as vscode.Location;
  assert.strictEqual(loc4.range.start.line, 23);
  assert.strictEqual(loc4.range.start.character, 8);
  assert.strictEqual(loc4.range.end.line, 23);
  assert.strictEqual(loc4.range.end.character, 15);
  assert.strictEqual(loc4.uri.path, docUri.path);

  const pos5 = new vscode.Position(28, 14);
  const actualdef5 = (await vscode.commands.executeCommand(
    'vscode.executeDefinitionProvider',
    docUri,
    pos5
  )) as vscode.Definition[];
  const loc5 = actualdef5[0] as vscode.Location;
  assert.strictEqual(loc5.range.start.line, 24);
  assert.strictEqual(loc5.range.start.character, 8);
  assert.strictEqual(loc5.range.end.line, 24);
  assert.strictEqual(loc5.range.end.character, 14);
  assert.strictEqual(loc5.uri.path, docUri.path);
}

async function testtypedefs(docUri: vscode.Uri) {
  await activate(docUri);

  const pos0 = new vscode.Position(28, 12);
  const actualtypedef0 = (await vscode.commands.executeCommand(
    'vscode.executeTypeDefinitionProvider',
    docUri,
    pos0,
  )) as vscode.Definition[];
  const loc0 = actualtypedef0[0] as vscode.Location;
  assert.strictEqual(loc0.range.start.line, 22);
  assert.strictEqual(loc0.range.start.character, 11);
  assert.strictEqual(loc0.range.end.line, 22);
  assert.strictEqual(loc0.range.end.character, 15);
  assert.strictEqual(loc0.uri.path, docUri.path);

  const pos1 = new vscode.Position(32, 18);
  const actualtypedef1 = (await vscode.commands.executeCommand(
    'vscode.executeTypeDefinitionProvider',
    docUri,
    pos1,
  )) as vscode.Definition[];
  const loc1 = actualtypedef1[0] as vscode.Location;
  assert.strictEqual(loc1.range.start.line, 7);
  assert.strictEqual(loc1.range.start.character, 4);
  assert.strictEqual(loc1.range.end.line, 21);
  assert.strictEqual(loc1.range.end.character, 5);
  assert.strictEqual(loc1.uri.path, docUri.path);
}

async function testimpls(docUri: vscode.Uri) {
  await activate(docUri);

  const pos0 = new vscode.Position(0, 9);
  const actualimpl0 = (await vscode.commands.executeCommand(
    'vscode.executeImplementationProvider',
    docUri,
    pos0,
  )) as vscode.Definition[];
  assert.strictEqual(actualimpl0.length, 2);
  const loc00 = actualimpl0[0] as vscode.Location;
  assert.strictEqual(loc00.range.start.line, 1);
  assert.strictEqual(loc00.range.start.character, 4);
  assert.strictEqual(loc00.range.end.line, 1);
  assert.strictEqual(loc00.range.end.character, 42);
  assert.strictEqual(loc00.uri.path, docUri.path);
  const loc01 = actualimpl0[1] as vscode.Location;
  assert.strictEqual(loc01.range.start.line, 6);
  assert.strictEqual(loc01.range.start.character, 4);
  assert.strictEqual(loc01.range.end.line, 6);
  assert.strictEqual(loc01.range.end.character, 61);
  assert.strictEqual(loc01.uri.path, docUri.path);


  const pos1 = new vscode.Position(0, 14);
  const actualimpl1 = (await vscode.commands.executeCommand(
    'vscode.executeImplementationProvider',
    docUri,
    pos1,
  )) as vscode.Definition[];
  assert.strictEqual(actualimpl1.length, 2);
  const loc10 = actualimpl1[0] as vscode.Location;
  assert.strictEqual(loc10.range.start.line, 12);
  assert.strictEqual(loc10.range.start.character, 4);
  assert.strictEqual(loc10.range.end.line, 12);
  assert.strictEqual(loc10.range.end.character, 52);
  assert.strictEqual(loc10.uri.path, docUri.path);
  const loc11 = actualimpl1[1] as vscode.Location;
  assert.strictEqual(loc11.range.start.line, 16);
  assert.strictEqual(loc11.range.start.character, 4);
  assert.strictEqual(loc11.range.end.line, 16);
  assert.strictEqual(loc11.range.end.character, 53);
  assert.strictEqual(loc11.uri.path, docUri.path);


  const pos2 = new vscode.Position(21, 19);
  const actualimpl2 = (await vscode.commands.executeCommand(
    'vscode.executeImplementationProvider',
    docUri,
    pos2,
  )) as vscode.Definition[];
  assert.strictEqual(actualimpl2.length, 2);
  const loc20 = actualimpl2[0] as vscode.Location;
  assert.strictEqual(loc20.range.start.line, 22);
  assert.strictEqual(loc20.range.start.character, 4);
  assert.strictEqual(loc20.range.end.line, 22);
  assert.strictEqual(loc20.range.end.character, 52);
  assert.strictEqual(loc20.uri.path, docUri.path);
  const loc21 = actualimpl2[1] as vscode.Location;
  assert.strictEqual(loc21.range.start.line, 26);
  assert.strictEqual(loc21.range.start.character, 4);
  assert.strictEqual(loc21.range.end.line, 26);
  assert.strictEqual(loc21.range.end.character, 54);
  assert.strictEqual(loc21.uri.path, docUri.path);
}

async function testrefs(docUri: vscode.Uri) {
  await activate(docUri);

  const pos0 = new vscode.Position(27, 52);
  const actualref0 = (await vscode.commands.executeCommand(
    'vscode.executeReferenceProvider',
    docUri,
    pos0,
  )) as vscode.Definition[];
  assert.strictEqual(actualref0.length, 5);
  const loc00 = actualref0[0] as vscode.Location;
  assert.strictEqual(loc00.range.start.line, 27);
  assert.strictEqual(loc00.range.start.character, 50);
  assert.strictEqual(loc00.range.end.line, 27);
  assert.strictEqual(loc00.range.end.character, 55);
  assert.strictEqual(loc00.uri.path, docUri.path);
  const loc01 = actualref0[1] as vscode.Location;
  assert.strictEqual(loc01.range.start.line, 30);
  assert.strictEqual(loc01.range.start.character, 16);
  assert.strictEqual(loc01.range.end.line, 30);
  assert.strictEqual(loc01.range.end.character, 22);
  assert.strictEqual(loc01.uri.path, docUri.path);
  const loc02 = actualref0[2] as vscode.Location;
  assert.strictEqual(loc02.range.start.line, 33);
  assert.strictEqual(loc02.range.start.character, 16);
  assert.strictEqual(loc02.range.end.line, 33);
  assert.strictEqual(loc02.range.end.character, 22);
  assert.strictEqual(loc02.uri.path, docUri.path);
  const loc03 = actualref0[3] as vscode.Location;
  assert.strictEqual(loc03.range.start.line, 36);
  assert.strictEqual(loc03.range.start.character, 16);
  assert.strictEqual(loc03.range.end.line, 36);
  assert.strictEqual(loc03.range.end.character, 22);
  assert.strictEqual(loc03.uri.path, docUri.path);
  const loc04 = actualref0[4] as vscode.Location;
  assert.strictEqual(loc04.range.start.line, 39);
  assert.strictEqual(loc04.range.start.character, 16);
  assert.strictEqual(loc04.range.end.line, 39);
  assert.strictEqual(loc04.range.end.character, 22);
  assert.strictEqual(loc04.uri.path, docUri.path);

  const pos1 = new vscode.Position(28, 12);
  const actualref1 = (await vscode.commands.executeCommand(
    'vscode.executeReferenceProvider',
    docUri,
    pos1,
  )) as vscode.Definition[];
  assert.strictEqual(actualref1.length, 6);
  const loc10 = actualref1[0] as vscode.Location;
  assert.strictEqual(loc10.range.start.line, 27);
  assert.strictEqual(loc10.range.start.character, 24);
  assert.strictEqual(loc10.range.end.line, 27);
  assert.strictEqual(loc10.range.end.character, 25);
  assert.strictEqual(loc10.uri.path, docUri.path);
  const loc11 = actualref1[1] as vscode.Location;
  assert.strictEqual(loc11.range.start.line, 28);
  assert.strictEqual(loc11.range.start.character, 12);
  assert.strictEqual(loc11.range.end.line, 28);
  assert.strictEqual(loc11.range.end.character, 14);
  assert.strictEqual(loc11.uri.path, docUri.path);
  const loc12 = actualref1[2] as vscode.Location;
  assert.strictEqual(loc12.range.start.line, 29);
  assert.strictEqual(loc12.range.start.character, 16);
  assert.strictEqual(loc12.range.end.line, 29);
  assert.strictEqual(loc12.range.end.character, 18);
  assert.strictEqual(loc12.uri.path, docUri.path);
  const loc13 = actualref1[3] as vscode.Location;
  assert.strictEqual(loc13.range.start.line, 32);
  assert.strictEqual(loc13.range.start.character, 16);
  assert.strictEqual(loc13.range.end.line, 32);
  assert.strictEqual(loc13.range.end.character, 18);
  assert.strictEqual(loc13.uri.path, docUri.path);
  const loc14 = actualref1[4] as vscode.Location;
  assert.strictEqual(loc14.range.start.line, 35);
  assert.strictEqual(loc14.range.start.character, 16);
  assert.strictEqual(loc14.range.end.line, 35);
  assert.strictEqual(loc14.range.end.character, 18);
  assert.strictEqual(loc14.uri.path, docUri.path);
  const loc15 = actualref1[5] as vscode.Location;
  assert.strictEqual(loc15.range.start.line, 38);
  assert.strictEqual(loc15.range.start.character, 16);
  assert.strictEqual(loc15.range.end.line, 38);
  assert.strictEqual(loc15.range.end.character, 18);
  assert.strictEqual(loc15.uri.path, docUri.path);
}

async function testhover(docUri: vscode.Uri) {
  await activate(docUri);

  const pos1 = new vscode.Position(74, 14);

  const actualhover = (await vscode.commands.executeCommand(
    'vscode.executeHoverProvider',
    docUri,
    pos1
  )) as vscode.Hover[];

  const contentarr1 = actualhover[0].contents as vscode.MarkdownString[];

  assert.strictEqual(contentarr1[0].value, '```solidity\nmapping(address => uint256) storage SimpleAuction.pendingReturns\n```');

  const pos2 = new vscode.Position(78, 19);

  const actualhover2 = (await vscode.commands.executeCommand(
    'vscode.executeHoverProvider',
    docUri,
    pos2
  )) as vscode.Hover[];

  const contentarr2 = actualhover2[0].contents as vscode.MarkdownString[];

  assert.strictEqual(
    contentarr2[0].value,
    '```solidity\nevent SimpleAuction.HighestBidIncreased {\n\taddress bidder,\n\tuint256 amount\n}\n```'
  );

  const pos3 = new vscode.Position(53, 13);

  const actualhover3 = (await vscode.commands.executeCommand(
    'vscode.executeHoverProvider',
    docUri,
    pos3
  )) as vscode.Hover[];

  const contentarr3 = actualhover3[0].contents as vscode.MarkdownString[];

  assert.strictEqual(contentarr3[0].value, 'Abort execution if argument evaulates to false\n\n```solidity\n[built-in] void require (bool)\n```');
}

async function testdiagnos(docUri: vscode.Uri, expecteddiag: vscode.Diagnostic[]) {
  await activate(docUri);

  const actualDiagnostics = vscode.languages.getDiagnostics(docUri);

  if (actualDiagnostics) {
    expecteddiag.forEach((expectedDiagnostic, i) => {
      const actualDiagnostic = actualDiagnostics[i];
      assert.strictEqual(actualDiagnostic.message, expectedDiagnostic.message);
      assert.deepStrictEqual(actualDiagnostic.range, expectedDiagnostic.range);
      assert.strictEqual(actualDiagnostic.severity, expectedDiagnostic.severity);
    });
  } else {
    console.error('the diagnostics are incorrect', actualDiagnostics);
  }
}
