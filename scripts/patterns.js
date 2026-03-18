export const PATTERNS = {
  monoline: [
    { regex: /^###### (.*$)/gm, replace: '<h6>$1</h6>' },
    { regex: /^##### (.*$)/gm, replace: '<h5>$1</h5>' },
    { regex: /^#### (.*$)/gm, replace: '<h4>$1</h4>' },
    { regex: /^### (.*$)/gm, replace: '<h3>$1</h3>' },
    { regex: /^## (.*$)/gm, replace: '<h2>$1</h2>' },
    { regex: /^# (.*$)/gm, replace: '<h1>$1</h1>' },
    { regex: /^#b.*$/gm, replace: '%%HARD_BREAK%%' },
  ],
  multiline: [
    {
      name: 'note',
      open: /^:::note\s*$/gm,
      close: /^:::\s*$/gm,
      tag: 'div',
      class: 'note',
    }
  ],
  inline: [
    { regex: /!\[([^\]]*)\]\(([^)]+)\)/g, replace: '<img alt="$1" src="$2">' },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, replace: '<a target="_blank" href="$2">$1</a>' },
    { regex: /\*\*(.*?)\*\*/g, replace: '<strong>$1</strong>' },
    { regex: /\*(.*?)\*/g, replace: '<em>$1</em>' },
  ]
};