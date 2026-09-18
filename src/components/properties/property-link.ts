export function propertyHref(slug: string): string {
  return '/properties/detail?slug=' + encodeURIComponent(slug);
}
