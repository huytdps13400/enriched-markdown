import {
  HeroCode,
  IMAGES,
  ImageStylesGallery,
  type GallerySection,
} from './ImageStylesGallery';

/** X reply 2 — how pixels fill the box. */
const SECTIONS: GallerySection[] = [
  {
    id: 'cover',
    badge: 'resizeMode · cover',
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

**Fill the box.** \`cover\` scales until the slot is full — overflow is cropped, no empty bands.
`,
  },
  {
    id: 'contain',
    badge: 'resizeMode · contain',
    knobs: 'aspectRatio: 16/9 · resizeMode: contain · radius 12',
    accent: '#34D399',
    image: {
      aspectRatio: 16 / 9,
      resizeMode: 'contain',
      borderRadius: 12,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Stone castle on a hill](${IMAGES.tallCastle})

**Fit inside.** Portrait castle in a 16∶9 box — \`contain\` shows the whole photo and letterboxes the sides.
`,
  },
  {
    id: 'stretch',
    badge: 'resizeMode · stretch',
    knobs: 'height: 140 · resizeMode: stretch · radius 8',
    accent: '#F87171',
    image: {
      height: 140,
      resizeMode: 'stretch',
      borderRadius: 8,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Stretched castle towers](${IMAGES.stretchCastle})

**Force-fill.** \`stretch\` ignores the photo’s proportions — towers warp so you can see the effect clearly.
`,
  },
  {
    id: 'center',
    badge: 'resizeMode · center',
    knobs: 'height: 200 · resizeMode: center · radius 12',
    accent: '#818CF8',
    image: {
      height: 200,
      resizeMode: 'center',
      borderRadius: 12,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Tiny mountain thumb](${IMAGES.stampWide})

**Keep native size.** A small mountain thumb sits centered in a taller box — \`center\` does not scale it up.
`,
  },
  {
    id: 'none',
    badge: 'resizeMode · none',
    knobs: 'height: 160 · resizeMode: none · radius 8',
    accent: '#94A3B8',
    image: {
      height: 160,
      resizeMode: 'none',
      borderRadius: 8,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Tiny castle thumb](${IMAGES.stampSquare})

**No scaling.** \`none\` draws the bitmap 1∶1 — this small castle stays at its true pixel size inside the box.
`,
  },
];

export default function ImageStylesResizeModeScreen() {
  return (
    <ImageStylesGallery
      testID="image-styles-resize-mode-screen"
      eyebrow="cover · contain · stretch · center · none"
      title="Filling the box"
      subtitle={
        <>
          Same slot, different <HeroCode>resizeMode</HeroCode> —{' '}
          <HeroCode>cover</HeroCode>, <HeroCode>contain</HeroCode>,{' '}
          <HeroCode>stretch</HeroCode>, <HeroCode>center</HeroCode>,{' '}
          <HeroCode>none</HeroCode>.
        </>
      }
      sections={SECTIONS}
    />
  );
}
