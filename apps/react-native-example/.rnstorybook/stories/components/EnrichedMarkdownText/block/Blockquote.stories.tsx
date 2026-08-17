import React from 'react';
import { EnrichedMarkdownTextStory } from '../EnrichedMarkdownTextStory';
import { storyMeta } from '../shared/storyMeta';
import {
  blockquoteStyledDefaults,
  fontFamilyControl,
  fontWeightControl,
  githubFlavorArgTypes,
  type BlockquoteStyleControls,
  numberControl,
} from '../shared/storybookMarkdownStyles';
import {
  splitStyleControls,
  toBlockquoteStyle,
} from '../shared/storybookStyleBuilders';
import type { StoryArgs, TextStory } from '../shared/storyTypes';

const MARKDOWN = `> this is a text inside a blockquote

> this is also a text inside a blockquote`;

const NESTED_MARKDOWN = `> top-level blockquote
>> nested blockquote inside the first
>>> deeply nested blockquote`;

const CODE_BLOCK_MARKDOWN = `> Blockquote with a fenced code block inside:
>
> \`\`\`ts
> const answer = 42;
> \`\`\`
>
> and a trailing paragraph.`;

const argTypes = {
  fontSize: numberControl('markdownStyle.blockquote.fontSize', {
    min: 12,
    max: 24,
    step: 1,
  }),
  fontFamily: fontFamilyControl('markdownStyle.blockquote.fontFamily'),
  fontWeight: fontWeightControl('markdownStyle.blockquote.fontWeight'),
  color: {
    control: 'color',
    description: 'markdownStyle.blockquote.color',
  },
  marginTop: numberControl('markdownStyle.blockquote.marginTop', {
    min: 0,
    max: 48,
    step: 2,
  }),
  marginBottom: numberControl('markdownStyle.blockquote.marginBottom', {
    min: 0,
    max: 48,
    step: 2,
  }),
  lineHeight: numberControl('markdownStyle.blockquote.lineHeight', {
    min: 16,
    max: 40,
    step: 1,
  }),
  borderColor: {
    control: 'color',
    description: 'markdownStyle.blockquote.borderColor',
  },
  borderWidth: numberControl('markdownStyle.blockquote.borderWidth', {
    min: 1,
    max: 8,
    step: 1,
  }),
  gapWidth: numberControl('markdownStyle.blockquote.gapWidth', {
    min: 0,
    max: 32,
    step: 2,
  }),
  backgroundColor: {
    control: 'color',
    description: 'markdownStyle.blockquote.backgroundColor',
  },
  borderRadius: numberControl('markdownStyle.blockquote.borderRadius', {
    min: 0,
    max: 16,
    step: 1,
  }),
  padding: numberControl('markdownStyle.blockquote.padding', {
    min: 0,
    max: 32,
    step: 2,
  }),
};

function renderBlockquote(
  title: string,
  description: string,
  args: StoryArgs<BlockquoteStyleControls>
) {
  const { controls, rest } = splitStyleControls(args, blockquoteStyledDefaults);
  return (
    <EnrichedMarkdownTextStory
      title={title}
      description={description}
      {...rest}
      style={{ blockquote: toBlockquoteStyle(controls) }}
    />
  );
}

const flavorArgTypes = githubFlavorArgTypes(
  'commonmark renders quotes inline via spans; github renders each quote as a recursive container view (its own padding/background, nested code blocks become real code-block containers).'
);

const blockquoteStoryBase = {
  argTypes: { ...argTypes, ...flavorArgTypes },
  args: { ...blockquoteStyledDefaults, flavor: 'github' as const },
};

export default storyMeta('Block', 'Blockquote');

export const Default: TextStory<BlockquoteStyleControls> = {
  ...blockquoteStoryBase,
  args: {
    ...blockquoteStoryBase.args,
    markdown: MARKDOWN,
  },
  render: (args) =>
    renderBlockquote(
      'Blockquote',
      'Lines prefixed with >. Flip the flavor control between commonmark and github to compare the inline (span) and container renderers. Use the controls to tune markdownStyle.blockquote.',
      args
    ),
};

export const Nested: TextStory<BlockquoteStyleControls> = {
  ...blockquoteStoryBase,
  args: {
    ...blockquoteStoryBase.args,
    markdown: NESTED_MARKDOWN,
  },
  render: (args) =>
    renderBlockquote(
      'Nested Blockquote',
      'Nest blockquotes with multiple > markers. Flip flavor to compare commonmark (inline spans) with github (one recursive container box per level). Use the controls to tune markdownStyle.blockquote.',
      args
    ),
};

export const WithCodeBlock: TextStory<BlockquoteStyleControls> = {
  ...blockquoteStoryBase,
  args: {
    ...blockquoteStoryBase.args,
    markdown: CODE_BLOCK_MARKDOWN,
  },
  render: (args) =>
    renderBlockquote(
      'Blockquote with Code Block',
      'A fenced code block inside a blockquote. With flavor="github" the code block becomes a real code-block container nested in the quote; with flavor="commonmark" it renders inline. Use the controls to tune markdownStyle.blockquote.',
      args
    ),
};
