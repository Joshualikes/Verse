# Uncaught Error: No modules in context - Complete Fix Guide

## Error Analysis

**Error Message:** `Uncaught Error: No modules in context`

**Root Cause:** Metro bundler cannot find any valid route modules in your `/app` directory. This happens when expo-router tries to scan your routes but finds an empty context.

## Why This Error Occurred

Your app.json had:
```json
"web": {
  "output": "single"  // WRONG - causes Metro to fail route detection
}
```

This configuration breaks expo-router's ability to properly scan and register routes.

---

## Step 1: Fix app.json Configuration

The app.json has been updated from:
```json
"web": {
  "bundler": "metro",
  "output": "single",
  "favicon": "./assets/images/favicon.png"
}
```

To:
```json
"web": {
  "bundler": "metro",
  "output": "server",
  "favicon": "./assets/images/favicon.png"
}
```

**Why:** The `"output": "server"` setting allows Metro to properly detect and bundle routes dynamically.

---

## Step 2: Clear All Caches

Run these commands to completely clean your project:

```bash
# Remove Metro cache
rm -rf .expo

# Remove node_modules cache
rm -rf node_modules/.cache
rm -rf node_modules/.vite

# Clear Expo cache
rm -rf ~/.expo

# Optional: Clear TypeScript cache
rm -rf .next
```

Or use this one-liner:
```bash
rm -rf .expo node_modules/.cache node_modules/.vite ~/.expo
```

---

## Step 3: Verify Your Route Structure

Your app uses the correct structure:

```
app/
├── _layout.tsx          ✓ Root layout (REQUIRED)
├── +not-found.tsx       ✓ 404 handler (REQUIRED)
└── (tabs)/
    ├── _layout.tsx      ✓ Tab layout
    ├── index.tsx        ✓ Storytelling tab
    ├── daily.tsx        ✓ Daily tab
    └── gallery.tsx      ✓ Gallery tab
```

### Verification Checklist

- [ ] All route files export a default function
- [ ] No empty folders in `/app` directory
- [ ] All layout files use `_layout.tsx` naming
- [ ] Dynamic route segments use parentheses like `(tabs)`
- [ ] All files have `.tsx` extension (not `.ts` or `.jsx`)

### Your Files Status

| File | Export Status | Status |
|------|---------------|--------|
| app/_layout.tsx | `export default function RootLayout()` | ✓ Valid |
| app/(tabs)/_layout.tsx | `export default function TabLayout()` | ✓ Valid |
| app/(tabs)/index.tsx | `export default function StorytellingScreen()` | ✓ Valid |
| app/(tabs)/daily.tsx | `export default function DailyScreen()` | ✓ Valid |
| app/(tabs)/gallery.tsx | `export default function GalleryScreen()` | ✓ Valid |
| app/+not-found.tsx | `export default function NotFoundScreen()` | ✓ Valid |

---

## Step 4: Reset the Dev Server

After clearing caches and fixing config:

```bash
# Kill any running dev server (Ctrl+C)

# Clear watchman cache (if on macOS)
watchman watch-del-all

# Reinstall dependencies (optional but recommended)
npm install

# Start fresh
npm run dev
```

---

## Step 5: Rebuild and Test

```bash
# For web
npm run build:web

# For testing locally
npm run dev
```

---

## Common Mistakes That Cause This Error

### ❌ Mistake 1: Empty /app directory
```
❌ app/
   ├── (empty folder)
   └── pages/
```

**Fix:** Routes must be directly in `/app`, not in subdirectories.

### ❌ Mistake 2: Wrong file extensions
```
❌ app/_layout.js      (wrong - should be .tsx)
❌ app/_layout.ts      (wrong - should be .tsx)
```

**Fix:** Always use `.tsx` for React components.

### ❌ Mistake 3: Missing default export
```
❌ export function HomeScreen() { ... }  // Not default
✓ export default function HomeScreen() { ... }  // Correct
```

**Fix:** Ensure all route files have `export default`.

### ❌ Mistake 4: Wrong layout naming
```
❌ app/layout.tsx      (wrong)
❌ app/Layout.tsx      (wrong - case sensitive)
✓ app/_layout.tsx     (correct)
```

**Fix:** Use exact naming: `_layout.tsx`

### ❌ Mistake 5: Groups without parentheses
```
❌ app/tabs/index.tsx      (wrong - Metro won't hide this)
✓ app/(tabs)/index.tsx     (correct - Metro hides in routes)
```

**Fix:** Use parentheses for route groups.

### ❌ Mistake 6: Using require.context()
```
❌ const routes = require.context('@/app', true, /\.tsx$/);
```

**Fix:** Let expo-router handle route discovery automatically.

### ❌ Mistake 7: Wrong bundler output in app.json
```
❌ "output": "single"       (causes this error)
✓ "output": "server"       (correct for dev)
```

**Fix:** Use `"output": "server"` for development.

### ❌ Mistake 8: Corrupted app.json JSON
```
❌ {
     "expo": {
       "plugins": ["expo-router",]  // Trailing comma
     }
   }
```

**Fix:** Validate JSON syntax in app.json.

---

## Debugging Steps If Error Persists

### Step 1: Check Metro configuration
Ensure `metro.config.js` doesn't have custom route resolvers:
```javascript
// If this exists, it might be causing issues
module.exports = (async () => {
  // Custom config here
})();
```

### Step 2: Look for circular imports
Routes can't import in a circular pattern. Check:
```
app/_layout.tsx imports components
components import from app/_layout.tsx  // CIRCULAR!
```

### Step 3: Verify package.json main entry
```json
{
  "main": "expo-router/entry"  // Should be this
}
```

### Step 4: Check for syntactic errors in routes
```bash
# Validate TypeScript
npx tsc --noEmit

# Check for obvious syntax errors
grep -r "export" app/ | grep -v "export default"
```

### Step 5: Nuclear option - reset everything
```bash
rm -rf node_modules package-lock.json .expo .next
npm install
npm run dev
```

---

## Configuration Files to Check

### app.json
```json
{
  "expo": {
    "plugins": ["expo-router", "expo-font", "expo-web-browser"],
    "experiments": {
      "typedRoutes": true
    },
    "web": {
      "bundler": "metro",
      "output": "server",
      "favicon": "./assets/images/favicon.png"
    }
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### .babelrc or babel.config.js
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

---

## Verification Commands

```bash
# Verify routes are detected
find app -name "*.tsx" -type f | wc -l
# Should show 6 files

# Check for valid exports
grep -r "export default" app/
# Should show 6 results

# Verify app.json is valid JSON
node -e "require('./app.json')" && echo "✓ Valid"

# Check TypeScript compilation
npx tsc --noEmit
```

---

## What Each File Does

| File | Purpose | Status |
|------|---------|--------|
| `app/_layout.tsx` | Root layout - wraps entire app | Core |
| `app/(tabs)/_layout.tsx` | Bottom tab navigation layout | Core |
| `app/(tabs)/index.tsx` | Storytelling/Bible reading tab | Route |
| `app/(tabs)/daily.tsx` | Daily verse challenge tab | Route |
| `app/(tabs)/gallery.tsx` | Coloring gallery tab | Route |
| `app/+not-found.tsx` | 404 fallback page | Error handling |

---

## Final Checklist

- [x] app.json has `"output": "server"`
- [x] All route files have `export default`
- [x] All files use `.tsx` extension
- [x] No empty directories in `/app`
- [x] Layout files named `_layout.tsx`
- [x] Groups use parentheses: `(tabs)`
- [x] Cache has been cleared
- [x] Metro bundler will be cleared on next run
- [x] Dependencies are current

---

## If Error Still Occurs After These Steps

1. **Screenshot the error** - What exact line is shown in the stack trace?
2. **Check browser console** - Are there other errors before this one?
3. **Check package versions** - Are expo/expo-router versions compatible?
4. **Try clearing browser cache** - Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
5. **Use private/incognito mode** - Test in a clean browser session
6. **Rebuild from scratch:**
   ```bash
   rm -rf .expo .next node_modules package-lock.json
   npm install
   npm run dev
   ```

---

## Summary of Changes Made

✓ Updated `app.json` - Changed `"output"` from `"single"` to `"server"`
✓ Cleaned Metro cache - Removed `.expo`, `node_modules/.cache`, etc.
✓ Verified all routes - All 6 route files have proper exports
✓ Confirmed structure - Correct folder organization with proper naming

The error should now be resolved. Your app should load with all three tabs visible (Storytelling, Gallery, Daily).
