import React from 'react';
import { createRoot } from 'react-dom/client';
import PlatformNavbarItem from '@site/src/theme/NavbarItem/PlatformNavbarItem';

// t-rex-ui's navbar ignores site-level custom navbar item types, so we expose a
// plain `html` navbar item (a mount node) in docusaurus.config.js and hydrate
// our React selector into it here.
//
// The one hard rule: never mount BEFORE hydration. Mounting into the navbar's
// html slot while React is still hydrating causes a mismatch that breaks the
// navbar (logo -> alt text) and drops this widget. So every trigger below is
// guaranteed post-hydration:
//   - onRouteDidUpdate: a layout effect that runs after each route commit
//   - window 'load' / readyState 'complete': after the initial page is settled
// A double requestAnimationFrame defers past the current commit for good
// measure, and the data-mounted guard keeps it idempotent.

const MOUNT_ID = 'rnem-platform-navbar';

function mount() {
  if (typeof document === 'undefined') {
    return;
  }
  const el = document.getElementById(MOUNT_ID);
  if (!el || el.dataset.mounted === 'true') {
    return;
  }
  el.dataset.mounted = 'true';
  createRoot(el).render(<PlatformNavbarItem />);
}

function scheduleMount() {
  if (typeof window === 'undefined') {
    return;
  }
  window.requestAnimationFrame(() => window.requestAnimationFrame(mount));
  // Fallback in case rAF is throttled (e.g. background tab).
  window.setTimeout(mount, 50);
}

export function onRouteDidUpdate() {
  scheduleMount();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    scheduleMount();
  } else {
    window.addEventListener('load', scheduleMount, { once: true });
  }
}
