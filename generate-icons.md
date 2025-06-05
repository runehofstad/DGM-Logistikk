# Generate App Icons

To create all the required icons from your DGM logo, you need to generate the following files and place them in the `public` folder:

## Required Icon Files

### Favicon files:
- `favicon.ico` - 16x16, 32x32, 48x48 (multi-resolution .ico file)
- `favicon-16x16.png` - 16x16px
- `favicon-32x32.png` - 32x32px

### Apple Touch Icons:
- `apple-touch-icon.png` - 180x180px
- `icon-76.png` - 76x76px
- `icon-120.png` - 120x120px
- `icon-152.png` - 152x152px

### Android/PWA Icons:
- `icon-192.png` - 192x192px
- `icon-512.png` - 512x512px

### Windows Tile:
- `icon-144.png` - 144x144px

### Social Media:
- `og-image.png` - 1200x630px (for social media sharing)

## How to Generate Icons

### Option 1: Online Tool (Recommended)
1. Go to https://realfavicongenerator.net/
2. Upload your DGM logo (the highest resolution version you have)
3. Customize the settings:
   - Set background color to white or transparent
   - Choose appropriate padding
4. Download the generated package
5. Extract and copy the files to your `public` folder

### Option 2: Using ImageMagick (Command Line)
If you have ImageMagick installed:

```bash
# Create a square version of your logo first (e.g., logo-square.png)
# Then run these commands:

# Favicon
convert logo-square.png -resize 16x16 public/favicon-16x16.png
convert logo-square.png -resize 32x32 public/favicon-32x32.png
convert logo-square.png -resize 16x16 favicon-16x16.png
convert logo-square.png -resize 32x32 favicon-32x32.png
convert logo-square.png -resize 48x48 favicon-48x48.png
convert favicon-16x16.png favicon-32x32.png favicon-48x48.png favicon.ico

# Apple Touch Icons
convert logo-square.png -resize 180x180 public/apple-touch-icon.png
convert logo-square.png -resize 76x76 public/icon-76.png
convert logo-square.png -resize 120x120 public/icon-120.png
convert logo-square.png -resize 152x152 public/icon-152.png

# Android/PWA
convert logo-square.png -resize 192x192 public/icon-192.png
convert logo-square.png -resize 512x512 public/icon-512.png

# Windows
convert logo-square.png -resize 144x144 public/icon-144.png

# Social Media (you might want to create a special banner for this)
convert logo-square.png -resize 1200x630 -gravity center -background white -extent 1200x630 public/og-image.png
```

### Option 3: Manual Creation
Use any image editor (Photoshop, GIMP, Figma, etc.) to:
1. Create a square version of your logo
2. Export it at each required size
3. Save with the exact filenames listed above

## Tips:
- Use PNG format for all icons except favicon.ico
- Keep the logo simple and recognizable at small sizes
- Test the icons on actual devices
- Consider using a white or transparent background
- For maskable icons (Android), ensure there's enough padding

## After generating icons:
1. Place all files in the `public` folder
2. Restart your development server
3. Test on mobile devices by:
   - iOS: Add to Home Screen from Safari
   - Android: Add to Home Screen from Chrome
   - Desktop: Install as PWA from Chrome