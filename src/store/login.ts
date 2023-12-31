import { atom } from 'recoil';

export const isSignenIn = atom<boolean>({
  key: 'isSignenInAtom',
  default: !!sessionStorage.getItem('nickname'),
});
