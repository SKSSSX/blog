'use strict';

/**
 * Fix post-asset image paths for permalinks without file extensions
 * (Hexo 8 + permalink: :title/). Replaces broken hexo-asset-image.
 */
hexo.extend.filter.register('after_post_render', (data) => {
  if (!hexo.config.post_asset_folder) return data;

  // Prefer post path (e.g. "Hexo-插入图片/index.html") over permalink parsing
  let base = String(data.path || data.slug || '')
    .replace(/\\/g, '/')
    .replace(/index\.html$/i, '');

  if (!base) {
    try {
      base = new URL(data.permalink, hexo.config.url).pathname || '';
      base = base.replace(/index\.html$/i, '');
    } catch {
      base = '';
    }
  }

  if (!base.startsWith('/')) base = `/${base}`;
  if (!base.endsWith('/')) base += '/';

  const root = hexo.config.root || '/';
  const keys = ['excerpt', 'more', 'content'];

  for (const key of keys) {
    if (!data[key]) continue;

    data[key] = data[key].replace(
      /<img([^>]*?)\ssrc=(["'])([^"']+)\2([^>]*)>/gi,
      (match, pre, quote, src, post) => {
        let cleaned = src.replace(/\\/g, '/').trim();
        if (
          /^(https?:)?\/\//i.test(cleaned) ||
          cleaned.startsWith('data:') ||
          cleaned.startsWith('/images/') ||
          cleaned.startsWith('/uploads/')
        ) {
          return match;
        }

        // Already correctly under this post path
        if (cleaned === base.slice(0, -1) || cleaned.startsWith(base)) {
          return match;
        }

        // Broken absolute like "/hexo-1.png" (missing post folder) — repair
        if (cleaned.startsWith('/') && !cleaned.slice(1).includes('/')) {
          cleaned = cleaned.slice(1);
        } else if (cleaned.startsWith('/')) {
          return match;
        }

        let relative = cleaned.replace(/^\.\//, '');
        const segments = relative.split('/').filter(Boolean);
        // Markdown may use "./PostName/file.png" — drop duplicated folder
        if (segments.length > 1 && base.includes(`/${segments[0]}/`)) {
          segments.shift();
          relative = segments.join('/');
        }

        const combined = `${root}${base}${relative}`.replace(/\/{2,}/g, '/');
        return `<img${pre} src=${quote}${combined}${quote}${post}>`;
      }
    );
  }

  return data;
});
