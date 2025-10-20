# Adding InEight Logos to Secret Santa App

## 📁 Where to Place Logo Files

Place your logo files in: **`public/logos/`**

## 🎨 Required Logo Files

### 1. Main Logo (Horizontal - Full Color)
**Filename:** `ineight-logo.png` or `ineight-logo.svg`
- **Usage:** Sign-in page, join page, main branding
- **Recommended size:** 200px width, transparent background
- **Format:** PNG (with transparency) or SVG (preferred)
- **Color:** Full InEight branding colors (orange & navy)

### 2. Logo Icon (Square - Full Color)
**Filename:** `ineight-icon.png` or `ineight-icon.svg`
- **Usage:** Mobile displays, favicon, compact spaces
- **Recommended size:** 64x64px or larger (square)
- **Format:** PNG or SVG
- **Color:** Full InEight branding colors

### 3. White Logo (For Dark Backgrounds)
**Filename:** `ineight-logo-white.png` or `ineight-logo-white.svg`
- **Usage:** App header (dark nav bar), email headers
- **Recommended size:** 200px width, transparent background
- **Format:** PNG or SVG
- **Color:** White or light version for dark backgrounds

## 📋 Quick Setup Steps

### Step 1: Get Logo Files

Contact your InEight marketing/brand team to get:
- Official logo files
- Brand guidelines
- Approved color codes

### Step 2: Prepare Files

1. Save logos with exact filenames above
2. Ensure transparent backgrounds
3. Optimize file sizes (< 100KB each)
4. Test on both light and dark backgrounds

### Step 3: Add to Project

```bash
# Copy your logo files to:
public/
└── logos/
    ├── ineight-logo.png (or .svg)
    ├── ineight-logo-white.png (or .svg)
    └── ineight-icon.png (or .svg)
```

### Step 4: Update Favicon

Replace `public/vite.svg` with your icon:

```bash
# Copy your icon as favicon
cp public/logos/ineight-icon.png public/favicon.png

# Update index.html to reference it
# (Already configured to use favicon.png)
```

## ✅ Verification

After adding logos:

1. **Refresh the app** - Logos should appear automatically
2. **Sign-in page** - Should show main logo at top
3. **App header** - Should show white logo version
4. **Join page** - Should show main logo
5. **Email templates** - Will show white logo in header

## 🎯 Fallback Behavior

If logo files are not found, the app automatically shows:
- Company name: "INEight"
- Gift icon as placeholder
- Full functionality maintained

## 📝 File Formats

**Recommended: SVG**
- ✅ Scales perfectly at any size
- ✅ Smaller file size
- ✅ Crisp on all displays
- ✅ Best for web

**Alternative: PNG**
- ✅ Universal compatibility
- ⚠️ Export at 2x size for retina displays
- ⚠️ Use transparent background

## 🎨 Brand Colors (For Reference)

The app uses these InEight colors:

- **Primary Orange:** `#FF6B35`
- **Secondary Navy:** `#1E3A5F`
- **Light background:** `#F5F7FA`

Make sure logo colors match or complement these.

## 🚀 After Setup

Once logos are in place:

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Restart dev server if running locally
3. Redeploy to production: `npm run deploy`

## 📧 Email Logo Setup

For email templates to show logos:

1. Logo must be publicly accessible at: `https://your-app.web.app/logos/ineight-logo-white.png`
2. Deploy app with logos: `firebase deploy --only hosting`
3. Test by sending a test email

## ❓ Troubleshooting

**Logo not showing?**
- Check filename matches exactly (case-sensitive)
- Verify file is in `public/logos/` directory
- Clear browser cache
- Check browser console for errors

**Logo too large/small?**
- Edit `src/components/Logo.tsx`
- Adjust size values in sizeMap object

**Wrong color showing?**
- Ensure using correct variant prop:
  - `variant="full"` - Standard colors
  - `variant="white"` - White for dark backgrounds
  - `variant="icon"` - Square icon only

## 📞 Support

Need help?
- Check brand guidelines from marketing
- Ensure logo files meet specifications above
- Test logo files in image viewer first

---

**Note:** The app works perfectly without logo files - it will show INEight branding text and icons as fallback. Add logos when ready!

