# CWRB Update Log - 18 Sep 2026

### 🛠️ Recent Changes & Fixes (Logo & PWA)

1. **Icon Replacement (Hard Fix):**
   - Replaced `public/icon.png`, `public/icon-512.png`, and `public/icon-192.png` with the official golden logo (`cwrb-logo.png`).
   - This ensures that the old "Seal" image is physically removed and replaced with our brand logo.

2. **Manifest Optimization (v3):**
   - Updated `public/manifest.json` to use `v=3` for all icon paths.
   - Reordered icons to prioritize the 512x512 golden logo.
   - Added `any` purpose to icons to prevent cropping on different devices.

3. **HTML Link Updates:**
   - Synchronized `index.html` icon links with `v=3` for consistent branding.

4. **Server Middleware (CORS & Cache):**
   - Added middleware in `server.ts` to handle CORS for PWABuilder.
   - Implemented `no-cache` headers for `manifest.json` to ensure immediate updates after deployment.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-3-Flash-Preview
**Timestamp:** 18 Sep 2026, 11:36 AM

---

# CWRB Update Log - 18 Sep 2026 (Update 2)

### 🛠️ Manifest & Display Fixes

1. **Icon Dimension Alignment:**
   - Corrected all icon sizes in `public/manifest.json` to match their actual 512x512 dimensions.
   - Fixed the mismatch error reported by PWABuilder.

2. **Display Override Enhancement:**
   - Added `window-controls-overlay` to the `display_override` array in `manifest.json`.
   - This satisfies the modern PWA requirement for desktop window controls.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-3-Flash-Preview
**Timestamp:** 18 Sep 2026, 11:47 AM
