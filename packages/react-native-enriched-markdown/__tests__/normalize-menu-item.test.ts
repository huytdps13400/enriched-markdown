import { normalizeBlockContextMenu } from '../src/normalizeMenuItem';

describe('normalizeBlockContextMenu', () => {
  it('keeps block context menus enabled by default', () => {
    expect(normalizeBlockContextMenu(undefined)).toBe(true);
    expect(normalizeBlockContextMenu({})).toBe(true);
  });

  it('disables block context menus through the menu item shape', () => {
    expect(normalizeBlockContextMenu({ enabled: false })).toBe(false);
  });
});
