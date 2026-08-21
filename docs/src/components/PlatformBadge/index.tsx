import React from 'react';
import clsx from 'clsx';
import { usePlatform } from '@site/src/platform/context';
import { getPlatform, PLATFORMS, type PlatformId } from '@site/src/platform/config';
import styles from './styles.module.css';

// A support value per platform:
//   string  -> supported since that version   (e.g. "1.1")
//   true    -> supported, no "since" info
//   false / undefined -> not implemented
type Support = string | boolean | undefined;

interface SupportProps {
  rn?: Support;
  ios?: Support;
  android?: Support;
}

function statusOf(value: Support): 'since' | 'yes' | 'no' {
  if (typeof value === 'string') return 'since';
  if (value === true) return 'yes';
  return 'no';
}

// Context-aware inline badge: reflects the CURRENTLY selected platform only.
// Put it next to a feature/prop heading — it updates live as the reader
// switches platform. Renders nothing when the feature is plainly supported.
export function PlatformBadge(props: SupportProps) {
  const { platform } = usePlatform();
  const def = getPlatform(platform);
  const value = props[platform];
  const status = statusOf(value);

  if (status === 'yes') {
    return null;
  }
  if (status === 'no') {
    return (
      <span className={clsx(styles.badge, styles.no)}>
        Not implemented on {def.label}
      </span>
    );
  }
  return (
    <span className={clsx(styles.badge, styles.since)}>
      Since {def.label} {value as string}
    </span>
  );
}

// Static, platform-independent row showing support across all platforms at
// once. Good for API-reference prop tables where you want the full picture.
export function Availability(props: SupportProps) {
  return (
    <span className={styles.availability}>
      {PLATFORMS.map((p) => {
        const value = props[p.id as PlatformId];
        const status = statusOf(value);
        return (
          <span
            key={p.id}
            className={clsx(
              styles.chip,
              status === 'no' ? styles.chipNo : styles.chipYes,
            )}>
            {p.label}
            {status === 'since' ? ` ${value as string}` : status === 'no' ? ' ✗' : ' ✓'}
          </span>
        );
      })}
    </span>
  );
}
