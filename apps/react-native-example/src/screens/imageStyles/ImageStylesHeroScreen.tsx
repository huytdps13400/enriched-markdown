import {
  HeroCode,
  IMAGES,
  ImageStylesGallery,
  type GallerySection,
} from './ImageStylesGallery';

/** Main X video — punchy frame / crop / radius combos. */
const SECTIONS: GallerySection[] = [
  {
    id: 'cinematic',
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

**Cinematic widescreen.** The image fills the row width; height comes from \`aspectRatio: 16/9\` — no hard-coded height needed.
`,
  },
  {
    id: 'portrait-crop',
    badge: 'aspectRatio · 3:4',
    knobs: 'aspectRatio: 3/4 · resizeMode: cover · radius 20',
    accent: '#F472B6',
    image: {
      aspectRatio: 3 / 4,
      resizeMode: 'cover',
      borderRadius: 20,
      marginTop: 4,
      marginBottom: 8,
    },
    markdown: `
![Stone castle on a hill](${IMAGES.tallCastle})

**Portrait crop.** Same full-width layout, taller frame — \`aspectRatio: 3/4\` with \`cover\` crops to a magazine-style photo.
`,
  },
  {
    id: 'circle',
    badge: 'circle · 1:1 crop',
    knobs: 'aspectRatio: 1 · cover · borderRadius 999',
    accent: '#FB7185',
    image: {
      aspectRatio: 1,
      resizeMode: 'cover',
      borderRadius: 999,
      marginTop: 8,
      marginBottom: 12,
    },
    markdown: `
![Snowy alpine peak](${IMAGES.alpine})

**Circular crop.** Square box (\`aspectRatio: 1\`) plus a large \`borderRadius\` clips the photo into a disc.
`,
  },
  {
    id: 'pill',
    badge: 'borderRadius · 28',
    knobs: 'aspectRatio: 2/1 · cover · radius 28',
    accent: '#22D3EE',
    image: {
      aspectRatio: 2 / 1,
      resizeMode: 'cover',
      borderRadius: 28,
      marginTop: 8,
      marginBottom: 12,
    },
    markdown: `
![City skyline at night](${IMAGES.city})

**Rounded panorama.** A wide 2∶1 frame with a soft \`borderRadius\` — still one markdown image, no extra views.
`,
  },
  {
    id: 'story',
    badge: 'mixed · story layout',
    knobs: 'aspectRatio: 4/5 · cover · radius 18 · margins',
    accent: '#FBBF24',
    image: {
      aspectRatio: 4 / 5,
      resizeMode: 'cover',
      borderRadius: 18,
      marginTop: 12,
      marginBottom: 16,
    },
    markdown: `
## Afternoon tea

![Ceramic teapot and tea](${IMAGES.tea})

A quiet pour, steam rising, late light on the table.

> Styled once with \`markdownStyle.image\` — headings, photos, and quotes stay in the same markdown flow.
`,
  },
];

export default function ImageStylesHeroScreen() {
  return (
    <ImageStylesGallery
      testID="image-styles-hero-screen"
      eyebrow="aspectRatio · cover · borderRadius"
      title="Frames & crops"
      subtitle={
        <>
          <HeroCode>aspectRatio</HeroCode> + <HeroCode>cover</HeroCode> +{' '}
          <HeroCode>borderRadius</HeroCode> from{' '}
          <HeroCode>markdownStyle.image</HeroCode>.
        </>
      }
      sections={SECTIONS}
    />
  );
}
