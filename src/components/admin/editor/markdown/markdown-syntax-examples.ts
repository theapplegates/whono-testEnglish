export type MarkdownSyntaxIcon =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'quote'
  | 'link'
  | 'image'
  | 'code'
  | 'code-block'
  | 'list'
  | 'ordered-list'
  | 'task-list'
  | 'table'
  | 'message-square-text'
  | 'sigma'
  | 'square-sigma'
  | 'smile'
  | 'minus';

export type MarkdownSyntaxExample = {
  label: string;
  syntax: string;
  icon?: MarkdownSyntaxIcon;
  marker?: string;
};

export type MarkdownShortcutExample = {
  label: string;
  shortcut: string;
  icon?: MarkdownSyntaxIcon;
};

export const MARKDOWN_SYNTAX_EXAMPLES: readonly MarkdownSyntaxExample[] = [
  { label: 'Section heading', marker: 'H2', syntax: '## Heading' },
  { label: 'Level 3 heading', marker: 'H3', syntax: '### Heading' },
  { label: 'Bold', icon: 'bold', syntax: '**Bold text**' },
  { label: 'Italic', icon: 'italic', syntax: '*Italic text*' },
  { label: 'Strikethrough', icon: 'strikethrough', syntax: '~~Text~~' },
  { label: 'Link', icon: 'link', syntax: '[Link text](url)' },
  { label: 'Image', icon: 'image', syntax: '![alt](url "Image description")' },
  { label: 'Quote', icon: 'quote', syntax: '> Quote text' },
  { label: 'Callout', icon: 'message-square-text', syntax: ':::note[Title]' },
  { label: 'Inline formula', icon: 'sigma', syntax: '$$x$$' },
  { label: 'Block formula', icon: 'square-sigma', syntax: '$$\nx\n$$' },
  { label: 'Emoji', icon: 'smile', syntax: '🙂' },
  { label: 'Code', icon: 'code', syntax: '`Code`' },
  { label: 'Code block', icon: 'code-block', syntax: '```language' },
  { label: 'Bullet list', icon: 'list', syntax: '- Item' },
  { label: 'Numbered list', icon: 'ordered-list', syntax: '1. Item' },
  { label: 'Task list', icon: 'task-list', syntax: '- [ ] Todo' },
  { label: 'Table', icon: 'table', syntax: '| Header | Header |' },
  { label: 'Horizontal rule', icon: 'minus', syntax: '---' }
] as const;

export const MARKDOWN_SHORTCUT_EXAMPLES: readonly MarkdownShortcutExample[] = [
  { label: 'Bold', icon: 'bold', shortcut: 'Ctrl + B' },
  { label: 'Italic', icon: 'italic', shortcut: 'Ctrl + I' },
  { label: 'Link', icon: 'link', shortcut: 'Ctrl + K' }
] as const;
