import { MonacoX } from "./editor";


export class EditorSyntaxHighlight {

  static init(monaco: MonacoX, id: string) {
    monaco.languages.setMonarchTokensProvider(id, {
      tokenizer: {
        root: [
          //
          // [/(^|\s)(@{2})([^{]+)/, ['', { token: 'region-start' }, { token: 'region-prop' }]],
          // [/(^|\}\s*)(>>)([^{]+)/, ['', { token: 'region-dual' }, { token: 'region-dual-prop' }]],
          [/(^|\s)(@{2})/, 'region', '@region'],
          [/(^|\s)(>>)/, 'dual', '@dual'],
          //
          // [/(^|\}\s*)(>>)/, ['', { token: 'region-dual' }]],
          // approach
          [/(\S)(>>)(\S)/, ['', { token: 'approach-separate' }, '']],
          // annotation
          [/(?:@\/?(click(?:\([^)]+\))?))/, { token: 'annotation-click', next: '@popall' }],
          [/(?:@(offset))/, { token: 'annotation-offset', next: '@popall' }],
          [/(?:@(compose))\(/, { token: 'annotation.compose', next: '@compose' }],
          // set
          [/(set\.[^:]+:)(.+?)(?=\/\/|\/\*|$)/, [{ token: 'setting-name' }, { token: 'setting-value' }]],
          // comment
          [/\/\/.*$/, 'comment'], // 単一行コメント
          [/(\/\*)/, { token: 'comment', next: '@comment' }], // ブロックコメントの開始
          // all comment
          [/(?<!\/\/\s*)__end__\b/, { token: 'all-comment', next: '@commentMode' }],
          // style
          [/:step\(/, 'step.start', '@stepper'],
          [/:bd\(/, 'bend.start', '@bend'],
          [/:[\w]+&?\(|:%\(/, 'style.start', '@style'],
          [/:\d+\/\d+/, 'etc-style-dark', '@popall'],
          [/:\w+&?/, 'etc-style', '@popall'],
        ],
        commentMode: [
          [/.*$/, 'comment'],
        ],
        region: [
          [/\/\/.*$/, 'comment'], // 単一行コメント
          [/(\/\*)/, { token: 'comment', next: '@innerComment' }], // ブロックコメントの開始
          [/\{/, '', '@pop'],
          [/./, 'region.prop']
        ],
        dual: [
          [/\/\/.*$/, 'comment'], // 単一行コメント
          [/(\/\*)/, { token: 'comment', next: '@innerComment' }], // ブロックコメントの開始
          [/\{/, '', '@pop'],
          [/./, 'dual.prop']
        ],
        style: [
          [/\/\/.*$/, 'comment'], // 単一行コメント
          [/(\/\*)/, { token: 'comment', next: '@innerComment' }], // ブロックコメントの開始
          // ( 入れ子対応
          [/\(/, 'style.start', '@stepper'],
          // ) にマッチしたら 'step.end' トークンを適用し、元の状態に戻る
          [/\)/, 'style.end', '@pop'],
          [/./, 'style.value']
        ],
        compose: [
          [/\/\/.*$/, 'comment'], // 単一行コメント
          [/(\/\*)/, { token: 'comment', next: '@innerComment' }], // ブロックコメントの開始
          // ( 入れ子対応
          [/\(/, 'annotation.compose', '@compose'],
          // ) にマッチしたら 'step.end' トークンを適用し、元の状態に戻る
          [/\)/, 'annotation.compose', '@pop'],
          // [/\d+/, 'step.number'],
          [/./, 'annotation.compose.value'],
        ],
        stepper: [
          [/\/\/.*$/, 'comment'], // 単一行コメント
          [/(\/\*)/, { token: 'comment', next: '@innerComment' }], // ブロックコメントの開始
          // ( 入れ子対応
          [/\(/, 'step.start', '@stepper'],
          // ) にマッチしたら 'step.end' トークンを適用し、元の状態に戻る
          [/\)/, 'step.end', '@pop'],
          // [/\d+/, 'step.number'],
          [/./, 'style.value.light'],
        ],
        bend: [
          [/\/\/.*$/, 'comment'], // 単一行コメント
          [/(\/\*)/, { token: 'comment', next: '@innerComment' }], // ブロックコメントの開始
          // ) にマッチしたら 'step.end' トークンを適用し、元の状態に戻る
          [/\)/, 'bend.end', '@pop'],
          [/\/\d+/, 'bend.sep.number'],
          [/\d+/, 'bend.number'],
          [/cho|vib|ast|reset/, 'bend.tag'],
          [/./, 'bend.value'],
        ],
        comment: [
          [/[^/*]+/, 'comment'], // コメント内のテキスト
          [/\*\//, { token: 'comment', next: '@popall' }], // ブロックコメントの終了
          [/[/*]/, 'comment'] // コメント内の*や/
        ],
        innerComment: [
          [/[^/*]+/, 'comment'], // コメント内のテキスト
          [/\*\//, { token: 'comment', next: '@pop' }], // ブロックコメントの終了
          [/[/*]/, 'comment'] // コメント内の*や/
        ]
      }
    });


  }

}