# Icon Files Note

The extension requires PNG icon files in the following sizes:

- icon16.png (16x16 pixels)
- icon32.png (32x32 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

Currently using placeholder icon.svg file. To create the required PNG files:

1. Use the provided icon.svg as a template
2. Convert to PNG format in the required sizes using:
   - Online converters (like CloudConvert)
   - Design tools (Figma, Adobe Illustrator, etc.)
   - Command line tools (ImageMagick, Inkscape)

Example using ImageMagick:

```bash
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 32x32 icon32.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

Or create custom icons with these design elements:

- Magnifying glass (represents inspection)
- Code brackets </>
- DOM element representation
- Blue primary color (#007ACC)
- High contrast for visibility
