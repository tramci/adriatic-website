# The Adriatic

A Jekyll-based publication website for The Adriatic, covering politics, business, and culture across the Adriatic region.

## Development

### Prerequisites

- Ruby 3.x
- Jekyll 4.x
- Node.js (for asset processing)

### Setup

```bash
bundle install
npm install
```

### Running locally

```bash
jekyll serve
```

The site will be available at `http://localhost:4000`.

### Building for production

```bash
jekyll build
```

Output is generated in `_site/`.

## Project Structure

```
_posts/           # Article markdown files
_layouts/         # Page templates
_includes/        # Reusable components
_data/            # Site data (authors, current issue, etc.)
assets/
  css/            # Stylesheets
  js/             # JavaScript
  fonts/          # Custom typefaces
  images/
    posts/        # Article images (slug-based subdirectories)
    authors/      # Author headshots
    branding/     # Logos and wordmarks
    covers/       # Magazine covers
```

## Publishing Articles

See [PUBLISHING.md](PUBLISHING.md) for detailed instructions on creating and formatting articles.
