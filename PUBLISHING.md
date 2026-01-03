# Publishing Articles on The Adriatic

This guide explains all the options available when creating a new article.

## Creating a New Article

Create a new `.md` file in the `_posts` folder with the naming convention:

```
YYYY-MM-DD-your-article-title.md
```

Example: `2025-12-24-a-new-face-an-old-dilemma.md`

## Front Matter Options

Every article starts with front matter (the section between `---` marks). Here are all available options:

```yaml
---
layout: post
title: "Your Article Title"
author: "Author Name"
date: 2025-12-24
category: politics
category_display: "Politics"
excerpt: "A brief summary of your article that appears in previews."
image: /assets/images/posts/your-image.jpg
image_position: center center
image_fullbleed: false
featured: false
---
```

### Required Fields

| Field | Description |
|-------|-------------|
| `layout` | Always use `post` |
| `title` | The article headline |
| `date` | Publication date in `YYYY-MM-DD` format |

### Optional Fields

| Field | Description | Default |
|-------|-------------|---------|
| `author` | Writer's name | None |
| `category` | Category slug (lowercase, no spaces) | None |
| `category_display` | Display name for the category | Uses `category` value |
| `excerpt` | Short summary for previews (recommended: under 220 characters) | Auto-generated from first paragraph |
| `image` | Path to the hero/featured image | Placeholder image |
| `image_position` | Focal point for image cropping | `center center` |
| `image_fullbleed` | Remove padding around hero image | `false` |
| `featured` | Display as the main hero article on homepage | `false` |

## Image Options

### Image Organization

Images are organized in slug-based subdirectories under `/assets/images/posts/`. Each article has its own folder matching the article slug, with the hero image named `hero.png` or `hero.jpg`:

```
assets/images/posts/
├── your-article-slug/
│   ├── hero.png          (or hero.jpg)
│   └── other-image.jpg   (optional additional images)
├── another-article/
│   └── hero.jpg
```

### Basic Image

```yaml
image: /assets/images/posts/your-article-slug/hero.png
```

Create a folder matching your article slug in `/assets/images/posts/` and place your hero image inside as `hero.png` or `hero.jpg`.

### Image Position (Focal Point)

When your image gets cropped to fit the hero area, you can control which part stays visible:

```yaml
image_position: top center
```

Common values:
- `center center` - Focus on the middle (default)
- `top center` - Focus on the top (good for landscapes with sky)
- `bottom center` - Focus on the bottom
- `left center` - Focus on the left side
- `right center` - Focus on the right side
- `top left`, `top right`, `bottom left`, `bottom right` - Corner focus

You can also use percentages for precise control:
```yaml
image_position: 30% 70%
```

### Full-Bleed Image

By default, the hero image has subtle padding around it. To make it extend edge-to-edge:

```yaml
image_fullbleed: true
```

## Featured Article

To make your article the main hero on the homepage:

```yaml
featured: true
```

Only one article should be featured at a time. If multiple articles have `featured: true`, the most recent one will be displayed.

## Categories

Available categories (you can add more):
- `politics`
- `culture`
- `business`
- `magazine`

Use `category` for the slug and `category_display` for the human-readable name:

```yaml
category: politics
category_display: "Slovenian Politics"
```

## Complete Example

```yaml
---
layout: post
title: "A New Face, An Old Dilemma"
author: "Ana Kovac"
date: 2025-12-24
category: politics
category_display: "Politics"
excerpt: "In Slovenia's increasingly atomised political landscape, Vladimir Prebilic's decision to launch a new party ahead of the 2026 parliamentary elections may appear a bold personal gamble."
image: /assets/images/posts/a-new-face-an-old-dilemma/hero.jpg
image_position: center 40%
image_fullbleed: false
featured: true
---

Your article content goes here in Markdown format...
```

## Tips

1. **Images**: Use high-resolution images (at least 1200px wide) for best quality
2. **Excerpts**: Write compelling excerpts - they appear on the homepage and in search results
3. **Titles**: Keep titles concise but descriptive
4. **Categories**: Be consistent with category names across articles
