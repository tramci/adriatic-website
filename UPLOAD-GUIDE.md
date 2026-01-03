# Article Upload Guide

Quick reference for adding new articles to Adriatic.

## File Structure

```
_posts/
  YYYY-MM-DD-slug.md          # Article file

assets/images/posts/
  slug/
    hero.jpg                  # Hero image (required)
```

## Step-by-Step

### 1. Prepare the image

- Create a folder in `assets/images/posts/` using your article slug
- Add `hero.jpg` (recommended: 1600px wide, optimised for web)

### 2. Create the article

Create `_posts/YYYY-MM-DD-slug.md`:

```yaml
---
layout: post
title: 'Article Title'
date: YYYY-MM-DDT00:00:00.000Z
category: politics
category_display: Section Label
author: Author Name
image: /assets/images/posts/slug/hero.jpg
image_caption: Description of the image.
image_credit: Photographer / Source
excerpt: >-
  A brief summary of the article that appears in previews
  and social sharing.
---
Article body starts here. Write in markdown.
```

### 3. Categories

Available categories:
- `politics`
- `business`
- `culture`
- `latest`

The `category_display` field is the label shown on the article (can differ from category).

### 4. Commit and push

```bash
git add _posts/YYYY-MM-DD-slug.md assets/images/posts/slug/
git commit -m "Add: Article title"
git push
```

The site rebuilds automatically via GitHub Actions (~1-2 min with caching).

## Batch Uploads

When uploading multiple articles, commit them together in a single push:

```bash
git add _posts/ assets/images/posts/
git commit -m "Add: Week 24 articles"
git push
```

This triggers one build instead of several, saving build minutes.

## Image Optimisation

Before uploading, optimise images to reduce build artifact size:

- Use JPEG for photos (quality 80-85%)
- Target file size: under 200KB per hero image
- Tools: [Squoosh](https://squoosh.app), ImageOptim, or `jpegoptim`

## Checklist

- [ ] Filename follows `YYYY-MM-DD-slug.md` format
- [ ] Front matter has all required fields
- [ ] Image folder name matches slug
- [ ] Hero image is named `hero.jpg`
- [ ] Image is optimised for web
- [ ] Article previews correctly locally (`bundle exec jekyll serve`)
