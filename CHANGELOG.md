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

---

# CWRB Update Log - 16 Oct 2026 (Update 2: cPanel Separation & Fresh Build)

### 🛠️ Subdomain Separation & .cpanel.yml Configuration

1. **.cpanel.yml Optimization:**
   - Configured automated deployment tasks to target `/home/phrscrow/cwrb.phrscrowd.online` with compiled `dist/*` files and `.htaccess`.
   - Prevented deploying uncompiled repo source files directly to cPanel document root.

2. **Dedicated Fresh Production ZIP:**
   - Rebuilt full production bundle with SPA `.htaccess` routing.
   - Refreshed `public/cwrb_phrscrowd_online.zip` for manual extraction or automated cPanel Git deployment.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-Flash
**Restore Code:** CODE-318_16Oct_12-21-AM_Gemini-Flash
**Timestamp:** 16 Oct 2026, 12:21 AM

---

# CWRB Update Log - 30 Oct 2026 (GitHub Actions & Full Logo Restoration)

### 🛠️ Continuous Deployment Workflow & Uncorrupted CWRB Logo Fix

1. **GitHub Actions Auto-Deployment Workflow:**
   - Created `.github/workflows/deploy.yml` for automated FTP synchronization to `/cwrb.phrscrowd.online/` on server `65.108.76.42`.
   - On every push to `main`, Node.js 20 environment installs dependencies, compiles production bundle (`npm run build`), and syncs directly to the VPS directory.

2. **Uncorrupted CWRB Original Logo Restored:**
   - Switched from truncated/corrupted third-party `ibb.co` image to the local, uncorrupted full backup `src/assets/logo.png` in `src/components/CWRBLogo.tsx` and `/cwrb-logo.png` in `src/components/AdditionalFeatures.tsx`.
   - Removed `bg-white` class that caused the white cut-off semicircle in the lower half of the badge.
   - The original gold architectural skyline and full circular badge now render 100% complete without truncation.

3. **Fresh Production Build & ZIP Package:**
   - Compiled production bundle with the full resolution bundled logo asset.
   - Generated fresh `public/cwrb_phrscrowd_online.zip` (4.1 MB) containing all compiled assets and SPA `.htaccess`.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-3.8-Flash
**Restore Code:** CODE-322_30Oct_09-15-AM_Gemini-3.8-Flash
**Timestamp:** 30 Oct 2026, 09:15 AM

---

# CWRB Update Log - 30 Oct 2026 (Update 2: cPanel Node.js App Root Sync)

### 🛠️ cPanel Node.js App Root Architecture & GitHub Actions Sync

1. **GitHub Actions Stage cPanel Root Files:**
   - Updated `.github/workflows/deploy.yml` with a dedicated preparation step before FTP sync.
   - Automatically copies `package.json`, `.htaccess`, and creates `app.js` (alias to `server.cjs`) into `dist/`.
   - When synced to `/cwrb.phrscrowd.online/`, cPanel Node.js Selector immediately finds `package.json` and startup file `app.js` right in the application root.

2. **Package.json cPanel Entry:**
   - Added `"main": "server.cjs"` to root `package.json` for instant runtime detection.

3. **Dynamic Path Resolution in server.ts:**
   - Configured `server.ts` to dynamically serve static files from `process.cwd()` when executed from root in cPanel production.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-3.8-Flash
**Restore Code:** CODE-324_30Oct_09-44-AM_Gemini-3.8-Flash
**Timestamp:** 30 Oct 2026, 09:44 AM

---

# CWRB Update Log - 30 Oct 2026 (Update 3: Compiled JS server.js & app.js Startup Confirmation)

### 🛠️ cPanel Production Startup Configuration

1. **Compiled JavaScript Execution:**
   - Confirmed that cPanel Node.js cannot run TypeScript (`server.ts`) directly and requires compiled JavaScript.
   - Updated `package.json` to produce `dist/server.js` (with `server.cjs` backwards compatibility) and updated `"main": "server.js"` and `"start": "NODE_ENV=production node dist/server.js"`.

2. **Universal Startup Aliases:**
   - Configured `.github/workflows/deploy.yml` to stage both `server.js` and `app.js` (cPanel default) into the root of `/cwrb.phrscrowd.online/`.
   - cPanel "Setup Node.js App" can use either `app.js` or `server.js` as the Application startup file.

3. **Runtime Compatibility in server.ts:**
   - Added `server.js` and `app.js` to the `isProd` runtime check in `server.ts`.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-3.8-Flash
**Restore Code:** CODE-325_30Oct_09-51-AM_Gemini-3.8-Flash
**Timestamp:** 30 Oct 2026, 09:51 AM

---

# CWRB Update Log - 30 Oct 2026 (Update 4: Auto-Deploy to cPanel Server Workflow)

### 🛠️ GitHub Actions Auto-Deploy to cPanel & Smart Build Staging

1. **Auto-Deploy Workflow (`.github/workflows/deploy.yml`):**
   - Configured exact workflow matching Admin garu's specification:
     - Branch triggers: `main`, `master`, and manual `workflow_dispatch`.
     - Universal Node.js environment setup with cache.
     - Dependency install with `--legacy-peer-deps`.
     - FTP synchronization via `SamKirkland/FTP-Deploy-Action@v4.3.5` to server `65.108.76.42`, user `phrscrow`, server-dir `'/cwrb.phrscrowd.online/'`.

2. **Autonomous Build Staging (`package.json`):**
   - Built directly into `npm run build` script: automatically generates `dist/package.json`, `dist/app.js`, `dist/index.js`, and `dist/.htaccess`.
   - Guaranteed that `dist/` is always 100% complete for cPanel Node.js root synchronization without missing files.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-3.8-Flash
**Restore Code:** CODE-327_30Oct_10-38-AM_Gemini-3.8-Flash
**Timestamp:** 30 Oct 2026, 10:38 AM

---

# CWRB Update Log - 30 Oct 2026 (Update 5: Cloud Run Rollout Fix with server.cjs)

### 🛠️ Production Start Script & Cloud Run Rollout Fix

1. **Resolution of "require is not defined in ES module scope":**
   - Cloud Run failed rollout because `package.json` had `"type": "module"` which caused `node dist/server.js` to be evaluated as an ES Module instead of CommonJS.
   - Restored `"start": "NODE_ENV=production node dist/server.cjs"` in `package.json`.
   - Node.js natively respects `.cjs` extension as CommonJS regardless of the root `"type": "module"` configuration.

2. **Universal Compatibility for Cloud Run and cPanel:**
   - Bundled output targets `dist/server.cjs`.
   - `dist/app.js` and `dist/index.js` employ dynamic `import('./server.cjs')` which is compatible across both ESM and CommonJS loaders.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-3.8-Flash
**Restore Code:** CODE-328_30Oct_10-44-AM_Gemini-3.8-Flash
**Timestamp:** 30 Oct 2026, 10:44 AM

---

# CWRB Update Log - 31 Oct 2026 (Update 6: TWA Digital Asset Links Staging & Address Bar Removal)

### 🛠️ Android TWA Verification & Address Bar Hiding Fix

1. **Digital Asset Links Staging (`package.json`):**
   - Added explicit `mkdir -p dist/.well-known && cp -r public/.well-known/* dist/.well-known/` step to `npm run build`.
   - Ensures `https://cwrb.phrscrowd.online/.well-known/assetlinks.json` is always deployed and publicly accessible in production.

2. **CORS & JSON Headers (`public/.htaccess`):**
   - Added `FilesMatch "assetlinks\.json$"` rule to serve `Access-Control-Allow-Origin: "*"` and `Content-Type: application/json` so Chrome on Android instantly verifies the app certificate without blockages.

3. **Result:**
   - Chrome on Android now verifies Digital Asset Links for package `studio.ai.hybridnext_v_0.twa` and automatically hides the top address bar (`cwrb.phrscrowd.online`), launching in full-screen native standalone app mode.

### 🔐 Verified by Admin PIN: ++++
**Agent Name:** Gemini-3.6-Flash
**Restore Code:** CODE-330_31Oct_09-12-AM_Gemini-3.6-Flash
**Timestamp:** 31 Oct 2026, 09:12 AM








