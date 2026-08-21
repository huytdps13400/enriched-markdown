import React from 'react';
import clsx from 'clsx';
import { usePlatform } from '@site/src/platform/context';
import { PLATFORMS, getPlatform } from '@site/src/platform/config';

// Navbar-hosted platform selector — occupies the slot the version dropdown
// used to. Reuses Infima's `dropdown` classes so it matches the rest of the
// navbar. Registered as the `custom-platformSwitch` navbar item type in
// src/theme/NavbarItem/ComponentTypes.js.
export default function PlatformNavbarItem({ mobile }: { mobile?: boolean }) {
  const { platform, setPlatform } = usePlatform();
  const current = getPlatform(platform);

  if (mobile) {
    return (
      <li className="menu__list-item">
        <div className="menu__link menu__link--sublist-caret">Platform</div>
        <ul className="menu__list">
          {PLATFORMS.map((p) => (
            <li className="menu__list-item" key={p.id}>
              <a
                href="#"
                className={clsx(
                  'menu__link',
                  p.id === platform && 'menu__link--active',
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setPlatform(p.id);
                }}>
                {p.label} v{p.version}
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <div className="navbar__item dropdown dropdown--hoverable dropdown--right">
      <a
        href="#"
        className="navbar__link"
        onClick={(e) => e.preventDefault()}
        aria-haspopup="true">
        {current.label}
        <span style={{ opacity: 0.6, marginLeft: 6 }}>v{current.version}</span>
      </a>
      <ul className="dropdown__menu">
        {PLATFORMS.map((p) => (
          <li key={p.id}>
            <a
              href="#"
              className={clsx(
                'dropdown__link',
                p.id === platform && 'dropdown__link--active',
              )}
              onClick={(e) => {
                e.preventDefault();
                setPlatform(p.id);
              }}
              style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <span>{p.label}</span>
              <span style={{ opacity: 0.6 }}>v{p.version}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
