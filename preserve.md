
---

### **The Legacy Code Migration Checklist**

| File / Directory | Action | Rationale & What to Look For |
| :--- | :--- | :--- |
| **`package.json`** | **Preserve** | **This is your project's manifest.** Copy it over, then run `pnpm install`. It contains your list of dependencies and, crucially, your `scripts` (`dev`, `build`, `lint`). You will be adding new libraries to it, but it's the correct starting point. |
| **`.env` / `.env.local`** | **Preserve** | **These are your environment variables.** They contain critical settings like `VITE_API_BASE_URL`. These are essential and have nothing to do with the UI bugs. |
| **`public/` directory** | **Preserve** | This directory contains static assets like your `favicon.ico`, logos, `robots.txt`, etc. These are safe and necessary. |
| **`src/assets/` (if you have one)** | **Preserve** | If you have a folder for images, fonts, or other static assets that are imported into components, copy the entire folder over. |
| **`.gitignore`** | **Preserve** | Your existing `.gitignore` is already tailored to your project and operating system. There is no need to recreate it. |
| **CI/CD files (`.github/` etc.)** | **Preserve** | Your deployment and CI workflows are valuable. Keep them, but be prepared to update them if build commands or directory structures change slightly. |
| **`vite.config.js`** | **Review & Selectively Migrate** | The new Vite project will create a default config. **Do not just overwrite it.** Open your old `vite.config.js` and look for specific configurations you added, such as a **proxy** for API requests, or any custom Vite plugins. Copy only these specific customizations into the new file. |
| **`tsconfig.json`** | **Review & Selectively Migrate** | The new TypeScript template will provide a modern, correct `tsconfig.json`. Compare it with your old one. The main thing to look for and transfer is the `paths` configuration for **absolute imports** (e.g., `{"~/": "./src/"}`). |
| **`src/theme.js`** | **Review & Selectively Migrate** | This is critical. **Do not copy the entire file.** Instead, treat it as a source of design tokens. Copy the *values* from your old theme: the `professionalDark` color array, your `fontFamily` definitions, `headings` styles, and the `components` style objects. Paste these values into the *new*, clean theme structure we defined in the blueprint. |
| **`src/services/apiClient.js`** | **Review & Selectively Migrate** | The core logic for creating and configuring your Axios instance is valuable. Copy the instance creation, the `baseURL`, and especially the **request interceptor** that attaches the `Authorization` header. This logic is correct and can be dropped into your new `apiClient.ts` file. |
| **`postcss.config.cjs`** | **Discard & Recreate** | **This was a source of the original problem.** Do not copy it. Follow the blueprint and create a new, minimal `postcss.config.cjs` that contains only the `postcss-preset-mantine` plugin. |
| **`index.html`** | **Discard & Recreate** | The Vite template will create a fresh `index.html`. It's cleaner to start with this new file. You can look at your old one to copy over the `<title>` tag or any specific `<meta>` tags you had added. |
| **`package-lock.json`** | **Discard & Recreate** | This file will be generated fresh and correctly when you run `pnpm install` in the new project. Using the old one can cause dependency conflicts. |
| **The rest of `src/`** | **Discard & Recreate** | All components, pages, layouts, and stores must be recreated using the "Clean Room" migration strategy we discussed. Use the old files as a **reference library**, not a template to be copied. |
