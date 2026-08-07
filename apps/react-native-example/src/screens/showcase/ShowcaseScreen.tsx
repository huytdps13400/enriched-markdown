import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';
import type {
  CopyPressEvent,
  MarkdownStyle,
} from 'react-native-enriched-markdown';

// Advertisement/showcase panel: a promotional Markdown document (headings,
// lists, blockquote and code blocks) rendered with flavor="github" on a light
// theme, with the code blocks kept on their GitHub-dark palette. A single
// button flips code from monochrome to a full palette, so on camera the
// tree-sitter highlighting appears to "turn on". There is no disable-highlight
// prop, so the OFF state is faked by setting every syntaxColors token to the
// code block's base text color; the ON state applies the real palette. Copying
// a block fires onCopyPress and raises a short toast.

const MARKDOWN = [
  '# Enriched Markdown',
  '',
  'Enriched Markdown now supports syntax-highlighted code blocks, powered by',
  '[tree-sitter](https://tree-sitter.github.io) - with native rendering,',
  'accurate per-token theming, and a dozen-plus languages out of the box.',
  '',
  '## What changed',
  '',
  '- Native **tree-sitter** parsing for accurate, per-token highlighting',
  '- The highlighting engine adds only **~0.24 ms** per block on device - about a millisecond of parsing for a full screen of code',
  '- TypeScript, Rust, Python, Go and a dozen more languages, ready to go',
  '- Every token color is a prop, so themes are yours to control',
  '',
  'A fenced block looks like this:',
  '',
  '```typescript',
  'import { parse, type Lang, type Token } from "enriched-markdown";',
  '',
  '// Turn source into themeable tokens',
  'export function render(code: string, lang: Lang): Token[] {',
  '  const tree = parse(code, lang); // real syntax tree, on device',
  '  return tree.tokens.map((t) => ({',
  '    kind: t.kind,',
  '    color: THEME[t.kind] ?? "#f3f4f6",',
  '  }));',
  '}',
  '```',
  '',
  '## How it works',
  '',
  'tree-sitter builds a real syntax tree on-device, so highlighting stays',
  'correct even for nested, complex code:',
  '',
  '```rust',
  '#[derive(Debug, Clone)]',
  'struct Point {',
  '    x: f64,',
  '    y: f64,',
  '}',
  '',
  'impl Point {',
  '    fn dist(&self, other: &Point) -> f64 {',
  '        let dx = self.x - other.x; // delta on x',
  '        (dx * dx).sqrt()',
  '    }',
  '}',
  '```',
  '',
  '> No regexes. Just fast, native, incremental parsing.',
].join('\n');

const BASE_TEXT_COLOR = '#f3f4f6';

// ON state: GitHub-dark palette. The four "inherit" tokens keep the base color.
const HIGHLIGHTED_COLORS = {
  keyword: '#ff7b72',
  operatorColor: BASE_TEXT_COLOR,
  punctuation: BASE_TEXT_COLOR,
  string: '#a5d6ff',
  number: '#79c0ff',
  constant: '#79c0ff',
  comment: '#8b949e',
  function: '#d2a8ff',
  type: '#ffa657',
  variable: BASE_TEXT_COLOR,
  property: '#79c0ff',
  tag: '#7ee787',
  attribute: '#79c0ff',
  embedded: BASE_TEXT_COLOR,
};

// OFF state: every token collapses to the base color, so code reads as flat
// monochrome even though the highlighting module is compiled in.
const PLAIN_COLORS = Object.fromEntries(
  Object.keys(HIGHLIGHTED_COLORS).map((token) => [token, BASE_TEXT_COLOR])
) as typeof HIGHLIGHTED_COLORS;

// Light document theme; code blocks stay on the GitHub-dark palette.
function buildMarkdownStyle(highlighted: boolean): MarkdownStyle {
  return {
    paragraph: { color: '#1f2328', fontSize: 16, lineHeight: 24 },
    h1: { color: '#1f2328', fontSize: 30, marginBottom: 8 },
    h2: { color: '#1f2328', fontSize: 22, marginTop: 20, marginBottom: 6 },
    list: { color: '#1f2328', markerColor: '#0969da', itemSpacing: 6 },
    blockquote: {
      color: '#59636e',
      borderColor: '#d0d7de',
      backgroundColor: '#f6f8fa',
      borderRadius: 6,
      padding: 12,
    },
    link: { color: '#0969da', underline: false },
    strong: { color: '#1f2328' },
    code: { color: '#0550ae', backgroundColor: '#eff1f3' },
    codeBlock: {
      backgroundColor: '#161b22',
      color: BASE_TEXT_COLOR,
      borderRadius: 8,
      padding: 14,
      fontSize: 14,
      syntaxColors: highlighted ? HIGHLIGHTED_COLORS : PLAIN_COLORS,
    },
  };
}

const TOAST_VISIBLE_MS = 1600;

export default function ShowcaseScreen() {
  const insets = useSafeAreaInsets();
  const [highlighted, setHighlighted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const showToast = useCallback(
    (message: string) => {
      setToastMessage(message);
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      hideTimer.current = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, TOAST_VISIBLE_MS);
    },
    [toastOpacity]
  );

  const handleCopyPress = useCallback(
    ({ language }: CopyPressEvent) => {
      const label = language ? `${language} code` : 'Code';
      showToast(`${label} copied!`);
    },
    [showToast]
  );

  return (
    <View style={styles.screen} testID="showcase-screen">
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 96 },
        ]}
      >
        <EnrichedMarkdownText
          markdown={MARKDOWN}
          flavor="github"
          markdownStyle={buildMarkdownStyle(highlighted)}
          onCopyPress={handleCopyPress}
        />
      </ScrollView>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          { bottom: insets.bottom + 96, opacity: toastOpacity },
        ]}
      >
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          accessibilityRole="button"
          testID="showcase-toggle"
          onPress={() => setHighlighted((on) => !on)}
          style={({ pressed }) => [
            styles.button,
            highlighted && styles.buttonActive,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {highlighted ? 'Disable highlighting' : 'Enable highlighting'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 20,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(31, 35, 40, 0.92)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d0d7de',
  },
  button: {
    backgroundColor: '#1f883d',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#0969da',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
