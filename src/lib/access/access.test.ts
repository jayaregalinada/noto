import { describe, expect, it } from 'vitest';
import { canEdit } from './can-edit';
import { canManage } from './can-manage';
import { canView } from './can-view';
import { resolveRole } from './resolve-role';

const OWNER = 'owner-id';
const EDITOR = 'editor-id';
const VIEWER = 'viewer-id';
const STRANGER = 'stranger-id';

const shares = [
  { userId: EDITOR, role: 'editor' as const },
  { userId: VIEWER, role: 'viewer' as const },
];

describe('resolveRole', () => {
  it('returns owner for the document owner', () => {
    expect(resolveRole({ ownerId: OWNER, shares, userId: OWNER })).toBe('owner');
  });

  it('returns the granted role for shared users', () => {
    expect(resolveRole({ ownerId: OWNER, shares, userId: EDITOR })).toBe('editor');
    expect(resolveRole({ ownerId: OWNER, shares, userId: VIEWER })).toBe('viewer');
  });

  it('returns null for users with no access', () => {
    expect(resolveRole({ ownerId: OWNER, shares, userId: STRANGER })).toBeNull();
  });

  it('returns null for anonymous (no session) users', () => {
    expect(resolveRole({ ownerId: OWNER, shares, userId: null })).toBeNull();
  });

  it('prefers ownership over any share row', () => {
    const ownerAlsoShared = [{ userId: OWNER, role: 'viewer' as const }];
    expect(
      resolveRole({ ownerId: OWNER, shares: ownerAlsoShared, userId: OWNER }),
    ).toBe('owner');
  });
});

describe('permission predicates', () => {
  it('canView: owner, editor, viewer can view; nobody-else and null cannot', () => {
    expect(canView('owner')).toBe(true);
    expect(canView('editor')).toBe(true);
    expect(canView('viewer')).toBe(true);
    expect(canView(null)).toBe(false);
  });

  it('canEdit: only owner and editor', () => {
    expect(canEdit('owner')).toBe(true);
    expect(canEdit('editor')).toBe(true);
    expect(canEdit('viewer')).toBe(false);
    expect(canEdit(null)).toBe(false);
  });

  it('canManage: only the owner', () => {
    expect(canManage('owner')).toBe(true);
    expect(canManage('editor')).toBe(false);
    expect(canManage('viewer')).toBe(false);
    expect(canManage(null)).toBe(false);
  });
});
