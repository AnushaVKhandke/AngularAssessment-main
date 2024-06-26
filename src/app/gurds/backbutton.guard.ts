import { CanActivateFn } from '@angular/router';

export const backbuttonGuard: CanActivateFn = (route, state) => {
  return false;
};
