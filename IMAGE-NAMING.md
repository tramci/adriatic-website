# Image Naming Conventions

This guide establishes consistent naming standards for all images in The Adriatic website.

## General Rules

1. **Lowercase only** - Never use uppercase letters
2. **Hyphens for spaces** - Use hyphens (`-`) to separate words, never spaces or underscores
3. **No special characters** - Only use letters, numbers, and hyphens
4. **Descriptive names** - Names should indicate content or purpose
5. **Consistent extensions** - Use `.jpg` for photographs, `.png` for graphics with transparency, `.svg` for vectors

## Directory Structure

```
assets/images/
├── branding/         # Logos, wordmarks, brand assets
├── covers/           # Magazine/issue covers
└── posts/            # Article images (subdirectories by slug)
    └── {article-slug}/
        ├── hero.jpg      # Main article image
        └── {name}.jpg    # Additional images
```

## Naming by Category

### Article Images (`posts/`)

Each article has its own subdirectory matching the article slug.

| File | Purpose |
|------|---------|
| `hero.jpg` | Main article image (required) |
| `inline-1.jpg` | First inline image |
| `inline-2.jpg` | Second inline image |
| `sidebar.jpg` | Sidebar image |
| `{descriptive-name}.jpg` | Named by content if specific |

**Examples:**
```
posts/the-long-march-to-europe/hero.png
posts/us-strikes-irans/hero.jpg
posts/us-strikes-irans/map-of-strikes.png
```

### Branding (`branding/`)

Format: `{asset-name}.svg` or `{asset-name}-{variant}.svg`

| File | Purpose |
|------|---------|
| `logo.svg` | Primary logo |
| `logo-white.svg` | White variant for dark backgrounds |
| `wordmark.svg` | Text-only wordmark |
| `wordmark-white.svg` | White wordmark variant |
| `favicon.svg` | Browser favicon |

**Examples:**
```
branding/logo.svg
branding/wordmark.svg
branding/wordmark-white.svg
```

### Covers (`covers/`)

Format: `{year}-{identifier}.svg`

The identifier can be an issue number, season, or descriptive name.

**Examples:**
```
covers/2026-01.svg
covers/2026-summer.svg
covers/2026-launch.svg
```

## File Format Guidelines

| Format | Use For |
|--------|---------|
| `.jpg` | Photographs, complex images without transparency |
| `.png` | Graphics requiring transparency, screenshots |
| `.svg` | Logos, icons, illustrations, anything that should scale |
| `.webp` | Optional optimized versions (provide fallback) |

## Resolution Requirements

| Image Type | Minimum Width | Aspect Ratio |
|------------|---------------|--------------|
| Article hero | 1400px | 16:9 recommended |
| Inline images | 800px | Varies |
| Covers | 360px | ~3:4 |

## Migration Checklist

When adding new images:

- [ ] Filename is lowercase
- [ ] Words separated by hyphens
- [ ] No spaces or special characters
- [ ] Placed in correct directory
- [ ] Appropriate file format
- [ ] Meets resolution requirements
