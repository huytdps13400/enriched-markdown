import {
  HeroCode,
  IMAGES,
  ImageStylesGallery,
  type GallerySection,
} from './ImageStylesGallery';

/** X reply 1 — how the box is sized. */
const SECTIONS: GallerySection[] = [
  {
    id: 'aspect-16-9',
    badge: 'aspectRatio · 16:9',
    knobs: 'aspectRatio: 16/9 · resizeMode: cover · radius 16',
    accent: '#38BDF8',
    image: {
      aspectRatio: 16 / 9,
      resizeMode: 'cover',
      borderRadius: 16,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Aurora over arctic peaks](${IMAGES.aurora})

**Fill width, derive height.** With \`aspectRatio\`, the image spans the content width and the height follows the ratio.
`,
  },
  {
    id: 'aspect-21-9',
    badge: 'aspectRatio · 21:9',
    knobs: 'aspectRatio: 21/9 · cover · radius 10',
    accent: '#2DD4BF',
    image: {
      aspectRatio: 21 / 9,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Sharp mountain ridge](${IMAGES.peak})

**Ultra-wide strip.** Same idea as 16∶9, just a thinner cinema frame — still one \`aspectRatio\` value.
`,
  },
  {
    id: 'aspect-9-16',
    badge: 'aspectRatio · 9:16',
    knobs: 'aspectRatio: 9/16 · cover · radius 24',
    accent: '#C084FC',
    image: {
      aspectRatio: 9 / 16,
      resizeMode: 'cover',
      borderRadius: 24,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Misty forest at sunrise](${IMAGES.trees})

**Tall story frame.** A landscape photo forced into 9∶16 — the box is tall; \`cover\` crops what does not fit.
`,
  },
  {
    id: 'max-height',
    badge: 'maxHeight · 160',
    knobs: 'maxHeight: 160 · resizeMode: contain · radius 12',
    accent: '#A78BFA',
    image: {
      maxHeight: 160,
      resizeMode: 'contain',
      borderRadius: 12,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Tall mountain in dramatic light](${IMAGES.tallPeak})

**Height cap.** \`maxHeight\` keeps a tall photo from eating the feed — here with \`contain\` so the whole mountain stays visible.
`,
  },
  {
    id: 'fixed-height',
    badge: 'height · 180',
    knobs: 'height: 180 · resizeMode: cover · radius 14',
    accent: '#FB923C',
    image: {
      height: 180,
      resizeMode: 'cover',
      borderRadius: 14,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Sunlit forest path](${IMAGES.forest})

**Exact slot.** Set \`height\` when you want a fixed card size every time — useful in dense lists.
`,
  },
];

export default function ImageStylesSizingScreen() {
  return (
    <ImageStylesGallery
      testID="image-styles-sizing-screen"
      eyebrow="aspectRatio · maxHeight · height"
      title="Sizing the box"
      subtitle={
        <>
          Precedence: <HeroCode>aspectRatio → maxHeight → height</HeroCode>.
          Pick how big the image slot is before you worry about fill.
        </>
      }
      sections={SECTIONS}
    />
  );
}
