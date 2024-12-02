import { CreateLinkDetails, OperationResult } from '@/types';
import { z } from 'zod';
import { areAllLinksPasswordsUnique } from './areAllLinksPasswordsUnique';
import { isDateBefore } from './isDateBefore';
import { isFutureDate } from './isFutureDate';

export function isLinkCorrect(link: CreateLinkDetails): OperationResult {
  const errors: string[] = [];

  // Password must be at least 1 character
  if (
    link.links.some((l) => (l.password ? l.password.trim().length < 1 : false))
  ) {
    errors.push('Password must be at least 1 character.');
  }

  // Links must be valid urls
  if (
    link.links.some((link) => {
      const urlSchema = z.string().url();
      return !urlSchema.safeParse(link.url).success;
    })
  ) {
    errors.push('Links must be valid urls.');
  }

  // Expire date must be before active date
  if (
    link.activeAt &&
    link.deleteAt &&
    isDateBefore(link.deleteAt, link.activeAt)
  ) {
    errors.push('Expire date must be before active date.');
  }

  // Max clicks must be greater than 0
  if (link.maxVisits != undefined && link.maxVisits < 1) {
    errors.push('Max visits must be greater than 0.');
  }

  // A tag must be at least 1 character
  if (link.tags && link.tags.some((tag) => tag.trim().length < 1)) {
    errors.push('A tag must be at least 1 character.');
  }

  // Dates must be in the future
  if (link.activeAt && !isFutureDate(link.activeAt)) {
    errors.push('Active date must be in the future.');
  }

  if (link.deleteAt && !isFutureDate(link.deleteAt)) {
    errors.push('Expire date must be in the future.');
  }

  // If one link have password, then all links must have password
  const havePassword = link.links.some((link) => link.password);
  const haveAllLinksPasswords = link.links.every((link) => link.password);

  if (havePassword && !haveAllLinksPasswords) {
    errors.push(
      'If one link have password, then all links must have password.'
    );
  }

  const areAllPasswordsUnique = areAllLinksPasswordsUnique(link.links);

  if (!areAllPasswordsUnique) {
    errors.push('All links passwords must be unique.');
  }

  return { success: errors.length === 0, errors };
}
