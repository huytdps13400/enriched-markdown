import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  EnrichedMarkdownText,
  type MarkdownStyle,
} from 'react-native-enriched-markdown';

export type GallerySection = {
  id: string;
  badge: string;
  knobs: string;
  markdown: string;
  image: NonNullable<MarkdownStyle['image']>;
  inlineImage?: NonNullable<MarkdownStyle['inlineImage']>;
  accent: string;
};

export const IMAGES = {
  aurora: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200',
  tallCastle:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900',
  tallPeak:
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900',
  forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
  stretchCastle:
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200',
  city: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200',
  architecture:
    'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200',
  tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=900',
  peak: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
  trees: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200',
  alpine: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200',
  stampWide:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160',
  stampSquare:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120',
} as const;

/** Slow enough to read cards on camera; ~px per second. */
const AUTO_SCROLL_SPEED = 72;

const BASE_TEXT_STYLE: MarkdownStyle = {
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#E2E8F0',
    lineHeight: Platform.select({ ios: 23, android: 24, default: 24 }),
    marginBottom: 10,
  },
  h2: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    color: '#F8FAFC',
    lineHeight: Platform.select({ ios: 28, android: 30, default: 30 }),
    marginBottom: 6,
  },
  h3: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#F1F5F9',
    lineHeight: Platform.select({ ios: 24, android: 26, default: 26 }),
    marginBottom: 6,
  },
  strong: {
    color: '#FFFFFF',
  },
  em: {
    color: '#CBD5E1',
  },
  code: {
    color: '#7DD3FC',
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  blockquote: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 15,
    color: '#94A3B8',
    borderColor: '#334155',
    borderWidth: 3,
    backgroundColor: '#0F172A',
    gapWidth: 12,
    marginBottom: 12,
  },
  thematicBreak: {
    color: '#1E293B',
    height: 1,
    marginTop: 8,
    marginBottom: 8,
  },
};

function SectionCard({ section }: { section: GallerySection }) {
  const markdownStyle = useMemo(
    () => ({
      ...BASE_TEXT_STYLE,
      image: section.image,
      ...(section.inlineImage ? { inlineImage: section.inlineImage } : {}),
    }),
    [section.image, section.inlineImage]
  );

  return (
    <View style={styles.card} testID={`image-styles-section-${section.id}`}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: section.accent }]}>
          <Text style={styles.badgeText}>{section.badge}</Text>
        </View>
        <Text style={styles.knobs} numberOfLines={2}>
          {section.knobs}
        </Text>
      </View>
      <EnrichedMarkdownText
        flavor="github"
        markdown={section.markdown.trim()}
        markdownStyle={markdownStyle}
      />
    </View>
  );
}

type ImageStylesGalleryProps = {
  testID: string;
  eyebrow: string;
  title: string;
  subtitle: ReactNode;
  sections: GallerySection[];
};

export function ImageStylesGallery({
  testID,
  eyebrow,
  title,
  subtitle,
  sections,
}: ImageStylesGalleryProps) {
  const scrollRef = useRef<ScrollView>(null);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const scrollingRef = useRef(false);

  const stopAutoScroll = useCallback(() => {
    scrollingRef.current = false;
    lastFrameRef.current = null;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(
    (now: number) => {
      if (!scrollingRef.current) {
        return;
      }

      const last = lastFrameRef.current ?? now;
      lastFrameRef.current = now;
      const deltaMs = Math.min(now - last, 64);
      const maxOffset = Math.max(
        0,
        contentHeightRef.current - viewportHeightRef.current
      );

      if (maxOffset <= 0) {
        stopAutoScroll();
        return;
      }

      const next = Math.min(
        maxOffset,
        offsetRef.current + (AUTO_SCROLL_SPEED * deltaMs) / 1000
      );
      offsetRef.current = next;
      scrollRef.current?.scrollTo({ y: next, animated: false });

      if (next >= maxOffset) {
        stopAutoScroll();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [stopAutoScroll]
  );

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    offsetRef.current = 0;
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    scrollingRef.current = true;
    lastFrameRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [stopAutoScroll, tick]);

  const toggleAutoScroll = useCallback(() => {
    if (scrollingRef.current) {
      stopAutoScroll();
      return;
    }
    startAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);

  useEffect(() => () => stopAutoScroll(), [stopAutoScroll]);

  const tripleTap = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(3)
        .maxDelay(400)
        .runOnJS(true)
        .onEnd(() => {
          toggleAutoScroll();
        }),
    [toggleAutoScroll]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      offsetRef.current = event.nativeEvent.contentOffset.y;
    },
    []
  );

  return (
    <GestureHandlerRootView style={styles.scrollView}>
      <GestureDetector gesture={tripleTap}>
        <View style={styles.scrollView}>
          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            testID={testID}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onScrollBeginDrag={stopAutoScroll}
            onLayout={(event) => {
              viewportHeightRef.current = event.nativeEvent.layout.height;
            }}
            onContentSizeChange={(_width, height) => {
              contentHeightRef.current = height;
            }}
          >
            <View style={styles.hero}>
              <Text style={styles.heroEyebrow}>{eyebrow}</Text>
              <Text style={styles.heroTitle}>{title}</Text>
              <Text style={styles.heroSubtitle}>{subtitle}</Text>
            </View>

            {sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </ScrollView>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

export function HeroCode({ children }: { children: ReactNode }) {
  return <Text style={styles.heroCode}>{children}</Text>;
}

export const imageStylesHeaderOptions = {
  title: '',
  headerStyle: { backgroundColor: '#0B1220' },
  headerTintColor: '#F8FAFC',
  headerTitleStyle: { fontWeight: 'bold' as const },
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 48,
  },
  hero: {
    marginBottom: 28,
    paddingBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1E293B',
  },
  heroEyebrow: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 11,
    letterSpacing: 2.4,
    color: '#38BDF8',
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
    color: '#F8FAFC',
    marginBottom: 12,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 23,
  },
  heroCode: {
    fontFamily: 'CourierPrime-Regular',
    color: '#7DD3FC',
  },
  card: {
    marginBottom: 22,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: {
    marginBottom: 14,
    gap: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 11,
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  knobs: {
    fontFamily: 'CourierPrime-Regular',
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
});
