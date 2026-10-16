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

---

# CWRB Update Log - 16 Oct 2026 (cPanel Subdomain Production Package)

### 🛠️ Production Package & Subdomain Deployment for cwrb.phrscrowd.online

1. **Apache SPA .htaccess Configuration:**
   - Created production-ready `.htaccess` for Apache / cPanel server.
   - Configured mod_rewrite rules for client-side routing (prevents 404 on page refresh).
   - Set CORS headers for `manifest.json` and assets to support PWA installation on the subdomain.
   - Enabled GZIP compression and optimal browser caching.

2. **Full Production Build:**
   - Compiled complete production bundle (`dist/`) with latest golden coin logos, PWA service worker, and app assets.

3. **ZIP Package Creation:**
   - Packaged the complete deployment-ready files into `cwrb_phrscrowd_online.zip` (3.4 MB).
   - Placed in web root for direct download and extraction into cPanel subdomain folder.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-Flash
**Restore Code:** CODE-317_16Oct_12-10-AM_Gemini-Flash
**Timestamp:** 16 Oct 2026, 12:10 AM

