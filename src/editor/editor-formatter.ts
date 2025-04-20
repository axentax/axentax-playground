import store from "../store/store";

export function editorFormatter(text: string): string {
  const indentSize = store.getState().statusOfSettings.indentSpaceLevel;
  
  let indentLevel = 0;
  let lineIndentLevel = 0;
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  let result = '';
  let currentLine = '';
  let openFastCloseIndent: boolean | null = null;
  const pairs: { [key: string]: string } = {
    '}': '{',
    ')': '(',
    ']': '[',
  };
  const stackupBrace: ('{' | '(' | '[')[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    // 改行の処理
    if (char === '\n') {

      if (lineIndentLevel > 0) {
        const indent = ' '.repeat(indentLevel * indentSize);
        indentLevel++;
        result += indent + formatLine(currentLine) + '\n';
      }
      else if (lineIndentLevel < 0) {
        if (indentLevel > 0) indentLevel--;
        const indent = ' '.repeat(indentLevel * indentSize);
        result += indent + formatLine(currentLine) + '\n';
      }
      else {
        const beforeMath = indentLevel + (openFastCloseIndent ? -1 : 0);
        const indent = ' '.repeat((beforeMath < 0 ? 0 : beforeMath) * indentSize);
        result += indent + formatLine(currentLine) + '\n';
      }
      // クリア
      currentLine = '';
      inSingleLineComment = false; // 行コメント終了
      lineIndentLevel = 0;
      openFastCloseIndent = null;
      continue;
    }

    // シングルラインコメントの開始
    // マルチラインコメントの開始
    if (!inMultiLineComment && char === '/' && nextChar === '/') inSingleLineComment = true;
    if (!inSingleLineComment && char === '/' && nextChar === '*') inMultiLineComment = true;
    // マルチラインコメントの終了
    if (inMultiLineComment && char === '*' && nextChar === '/') {
      inMultiLineComment = false;
      currentLine += '*/';
      i++; // 次の文字も消費
      continue;
    }

    // コメント内以外
    if (!inSingleLineComment && !inMultiLineComment) {
      if (char === '{' && openFastCloseIndent === null) openFastCloseIndent = false;
      if (char === '}' && openFastCloseIndent === null) openFastCloseIndent = true;
      if (/\{|\(|\[/.test(char)) {
        stackupBrace.push(char as ('{' | '(' | '['));
        lineIndentLevel++;
      }
      else if (/\}|\)|\]/.test(char)) {
        if (stackupBrace[stackupBrace.length - 1] === pairs[char]) {
          stackupBrace.pop();
          lineIndentLevel--;
          
        }
      }
    }

    currentLine += char;
  }

  return result;
}

function formatLine(str: string) {
  const rules: { rule: RegExp, str: string}[] = [
    // \region mark
    { rule: /@@\s+|@@(\S)/g, str: '@@ $1' },
    { rule: /([^r|\d])>>/g, str: '$1 >>' },
    // : or ()
    { rule: /\s+:/g, str: ':' },
    { rule: /\(\s+/g, str: '(' },
    { rule: /\s+\)/g, str: ')' },
    // {}
    { rule: /([^{}\s]){/g, str: '$1 {' },
    { rule: /{([^\s{}])/g, str: '{ $1' },
    { rule: /([^\s{}}])\}/g, str: '$1 }' },
    { rule: /}([^\s{}}:])/g, str: '} $1' },
    // 中間スペース
    { rule: /\s+/g, str: ' ' },
    // コメント
    { rule: /(\S)\/\//g, str: '$1 //' },
    { rule: /(\S)\/\*/g, str: '$1 /*' },
    { rule: /\*\/(\S)/g, str: '*/ $1' },
  ];
  rules.forEach(rule => {
    str = str.replace(rule.rule, rule.str)
  });
  return str.trim();
}
