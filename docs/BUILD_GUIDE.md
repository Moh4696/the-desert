# How I Built The Desert from One Pinterest Image

This is the complete process I used to turn one visual reference into **The Desert**, an animated editorial storefront for modern Arabian menswear.

- Live website: https://moh4696.github.io/the-desert/
- GitHub repository: https://github.com/Moh4696/the-desert

The project uses a Pinterest-discovered reference image, Codex for direction and implementation, GPT Image 2 for the hero composition and product photography, Higgsfield with Kling 3.0 Turbo for the ten-second animation, and GitHub Pages for public hosting.

> Pinterest is where I discovered the reference, but Pinterest is not the original license. Before using a discovered image for a real commercial brand, identify its creator and obtain the necessary permission or license. A safer alternative is to use your own artwork or a licensed reference.

## 1. I downloaded the visual reference

I began by browsing Pinterest for Arabian fashion illustrations. I downloaded an image with five expressive men wearing white thobes and patterned headscarves. Its black background, vivid orange faces, white garments, elongated features, and red headscarf patterns immediately suggested a strong fashion identity.

I saved that image in the repository as:

```text
creative/original-reference.png
```

The image gave the project its visual ingredients:

- Black negative space
- Bright orange as the primary accent
- White garments and typography
- Red patterned details
- Expressive editorial character
- A composition that could become a cinematic hero

## 2. I asked Codex what kind of website the image could become

I attached the reference image and started with an open creative question:

```text
What website can we build with this image?

Study the image's colors, composition, clothing, character, and mood. Suggest a strong website concept that uses the image as the main visual direction. The finished experience should feel animated, editorial, culturally grounded, and suitable for a premium brand.
```

After exploring the idea, I chose an Arabian clothing collection and named the brand **The Desert**.

I then gave this direction:

```text
Let's make a website for an Arabian wear collection called “The Desert.”

Use the attached image as the foundation of the visual identity. Maintain its orange, black, white, and red coloring. The website should feel like a modern fashion editorial rather than a standard ecommerce template.

Draft how the website should look before implementing it. Define the hero, collection grid, brand story, typography, color system, animations, interactions, mobile layout, and footer. Plan for 10 to 20 products. The attached image should eventually become a 10-second animated 16:9 hero.
```

This step was useful because we established the experience before generating assets or writing code.

## 3. We defined the site structure

The approved structure became:

1. A slim announcement bar
2. A focused navigation header
3. A cinematic 16:9 video hero
4. A moving editorial manifesto strip
5. A 16-piece product collection
6. Category filters, saved pieces, search, and sorting
7. Product-detail and size-selection dialogs
8. A persistent shopping bag
9. A brand-story section using the hero artwork
10. Craft, fit, and styling details
11. A large closing statement
12. A compact editorial footer

The main hero statement became:

```text
HERITAGE.
WORN
TODAY.
```

Supporting copy:

```text
Familiar roots. A different expression.
Meet the first collection from The Desert.
```

The concept used one clear idea throughout: familiar Arabian garments presented with a fresh, expressive point of view.

## 4. We built a visual system from the reference

We extracted the palette instead of introducing unrelated colors:

```css
--orange: #f44b12;
--ink: #11100e;
--paper: #f5f3ec;
--muted: #6f6c65;
```

The interface combined bold sans-serif display type with an editorial serif italic for emphasis. Large type, fine rules, compact uppercase labels, warm off-white surfaces, and deliberate negative space created the fashion-magazine feeling.

The reference image remained the loudest element. Interface colors, product backgrounds, buttons, badges, and motion were designed to support it.

## 5. We converted the portrait reference into a 16:9 hero

The downloaded image was portrait-oriented, while a website hero needed a wide composition. We used GPT Image 2 with the reference attached and asked it to preserve the illustration while expanding the scene.

### 16:9 hero-poster prompt

```text
Create a cinematic 16:9 website hero based on the attached illustration. Preserve the original hand-painted 2D style, all five Arabian male character identities, their elongated facial proportions, white thobes, headscarf patterns, crisp outlines, and the exact orange, red-orange, black, and white palette.

Recompose the group toward the right side of the frame and extend the solid black background across the left 40 percent, creating clean negative space for large editorial typography. Keep the central character dominant and preserve the black eye shapes. Maintain the graphic, imperfect painted texture. Do not add text, logos, extra people, new clothing, photorealism, 3D rendering, gradients, or new colors.

Output a clean 16:9 image suitable as a luxury fashion website hero and video starting frame.
```

The finished poster is included at:

```text
public/assets/hero-poster.png
```

We kept the original reference in `creative/` so the creative lineage is clear.

## 6. We animated the hero with Higgsfield and Kling

We uploaded the 16:9 poster to Higgsfield and selected **Kling 3.0 Turbo** for image-to-video generation. We chose a ten-second duration and avoided aggressive motion because illustration models can distort faces and fabric patterns when too much movement is requested.

This is the exact prompt saved in [`creative/hero-video-prompt.txt`](../creative/hero-video-prompt.txt):

```text
Create a 10-second animated fashion campaign from the supplied 16:9 illustration. Preserve the original hand-painted 2D style, all five character identities, elongated facial proportions, white thobes, crisp outlines, and intricate headscarf patterns. Maintain the exact orange, red-orange, black, and white palette. Solid black background and empty left 40 percent throughout. Locked camera, one continuous shot. The group holds its composition. A very gentle breeze moves only the loose fabric edges, followed by a natural settling motion. Add subtle breathing and one occasional blink from a background character. Keep the central character’s black eye shapes unchanged. Movement gradually returns close to the opening pose by the end. No walking, talking, large head turns, new characters, fabric-pattern morphing, color shifts, realistic rendering, 3D conversion, text, or logos.
```

The final video settings were:

- 10 seconds
- 16:9
- 1920 × 1080
- H.264 MP4
- No audio
- Looping playback
- Approximately 2.3 MB

The finished browser asset is:

```text
public/assets/hero.mp4
```

The page always renders the poster first. JavaScript loads the video configuration from `public/assets/hero-config.json`, then reveals a play/pause control when the video is ready. Visitors who prefer reduced motion keep the static poster.

## 7. We designed the 16-product collection

We created three categories:

- 10 thobes
- 4 bishts
- 2 accessories

Every record contains an ID, product name, category, color, price, badge, description, fabric, image description, sizes, and image path. The catalog lives in:

```text
public/data.js
```

The collection-planning prompt was:

```text
Create a coherent 16-piece debut collection for The Desert, a modern Arabian menswear label.

Include 10 thobes, 4 bishts, and 2 headwear accessories. Give every product a distinctive editorial name, believable color, illustrative USD price, concise description, fabric, sizes, optional badge, and an accurate product-image description.

Keep the palette connected to the hero: ivory, white, black, cream, terracotta, burnt orange, copper, red, and restrained gold details. The products should feel like one collection while remaining visually distinct. Avoid unsupported manufacturing, sustainability, or inventory claims.
```

## 8. We generated consistent product photography

We used GPT Image 2 for dedicated product renders and matching generated catalog photography. A shared base prompt kept the catalog visually consistent; only the final garment description changed.

### Base product-image prompt

```text
Premium ecommerce product photograph for The Desert, modern Arabian menswear. Vertical 3:4 composition. Full garment visible and centered with comfortable margins. Soft warm off-white seamless studio background, subtle floor shadow, diffused daylight, natural high-detail fabric texture, restrained editorial styling.

Garment only on an invisible ghost mannequin, no human body, no visible mannequin, no hanger, no text, no labels, no logo, no watermark. Consistent distance and lighting across the collection. Do not tint white fabrics orange.

[ADD THE EXACT GARMENT, COLOR, COLLAR, TRIM, FABRIC, AND SILHOUETTE HERE]
```

Example for The Dune Thobe:

```text
Premium ecommerce product photograph for The Desert, modern Arabian menswear. Vertical 3:4 composition. Full garment visible and centered with comfortable margins. Soft warm off-white seamless studio background, subtle floor shadow, diffused daylight, natural high-detail fabric texture, restrained editorial styling. Garment only on an invisible ghost mannequin, no human body, no visible mannequin, no hanger, no text, no labels, no logo, no watermark. Consistent distance and lighting across the collection. Do not tint white fabrics orange. Ivory thobe, structured stand collar, concealed front placket, straight long sleeves.
```

All 16 product prompts, model names, filenames, and dimensions are included in:

```text
creative/product-prompts.json
```

The optimized storefront images are stored in:

```text
public/assets/products/
```

We used WebP for the browser catalog because it reduced transfer size while preserving visual quality.

## 9. We told Codex to implement the complete experience

Once the direction and assets were ready, the implementation prompt was:

```text
Build the complete responsive website for The Desert using semantic HTML, modern CSS, and lightweight JavaScript. Use the approved black, orange, warm-white, and red visual direction. Make the supplied 16:9 animation the hero, with a static poster fallback, muted autoplay, looping playback, a play/pause control, playsinline support, and reduced-motion support.

Implement the announcement bar, responsive navigation, cinematic hero, moving manifesto, 16-product collection, category filters, search, saved-product filtering, sorting, product details, size selection, persistent cart, quantity controls, demo checkout, brand story, detail columns, closing statement, and footer.

Store products as structured data. Keep the cart, favorites, and motion preference in localStorage. Make dialogs keyboard accessible, provide visible focus styles and screen-reader labels, avoid horizontal overflow, and ensure the design works from 320px mobile screens to large desktop monitors.

Use relative asset paths so the finished static build works under a GitHub Pages repository path. Add meaningful tests for catalog filtering, stored-cart validation, repeated cart lines, sizes, and totals. Add local development and production build commands. Continue until the tests pass and the public website is verified.
```

We selected a dependency-light stack:

- Semantic HTML in `public/index.html`
- Responsive CSS in `public/style.css`
- ES modules in `public/app.js` and `public/data.js`
- Node.js 20 or newer for local scripts
- Node's built-in test runner
- No frontend framework
- No runtime package dependencies

This kept the storefront fast and made GitHub Pages deployment simple.

## 10. We implemented the shopping interactions

The JavaScript provides:

- Product rendering from structured data
- Category filtering
- Text search
- Featured and price sorting
- Saved products
- Product-detail dialogs
- Size selection
- Add-to-bag behavior
- Quantity updates
- Removal from the bag
- Catalog-derived totals
- Persistent local storage
- A clearly labeled demo checkout
- Size guide and information dialogs
- Hero video loading and motion preferences
- Scroll reveals and navigation behavior

The checkout deliberately does not request personal or payment information. It generates a sample confirmation in the browser and states that no real order was placed.

## 11. We tested and built the project locally

Requirements:

- Git
- Node.js 20 or newer
- A modern browser

Clone and run the project:

```sh
git clone git@github.com:Moh4696/the-desert.git
cd the-desert
npm run dev
```

Open:

```text
http://127.0.0.1:4173
```

Run the automated tests:

```sh
npm test
```

Create the production build:

```sh
npm run build
```

The build script copies the static application from `public/` to `dist/`. The test suite checks the collection data, combined filters, stored-cart validation, repeated size rows, catalog-derived prices, and totals.

## 12. We created the GitHub repository

For a new project, initialize the repository and create the first commit:

```sh
git init -b main
git add .
git commit -m "Build editorial storefront"
```

Authenticate GitHub CLI:

```sh
gh auth login
```

Create the public repository:

```sh
gh repo create YOUR_USERNAME/the-desert \
  --public \
  --description "Animated editorial storefront for a modern Arabian menswear collection."
```

Connect and push it:

```sh
git remote add origin git@github.com:YOUR_USERNAME/the-desert.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 13. We deployed through GitHub Pages

The deployment workflow is included at:

```text
.github/workflows/pages.yml
```

It performs four important tasks:

1. Checks out the repository
2. Runs the automated tests
3. Builds the static `dist/` directory
4. Uploads and deploys the directory to GitHub Pages

For a new repository, enable workflow-based Pages deployment with:

```sh
gh api --method POST repos/YOUR_USERNAME/the-desert/pages \
  -f build_type=workflow
```

Push `main` again if a deployment was not triggered:

```sh
git commit --allow-empty -m "Trigger Pages deployment"
git push
```

Watch the result:

```sh
gh run list --workflow pages.yml
gh run watch RUN_ID --exit-status
```

The resulting project URL follows this format:

```text
https://YOUR_USERNAME.github.io/the-desert/
```

Relative asset paths are essential. Paths such as `assets/hero.mp4` work beneath `/the-desert/`; root paths such as `/assets/hero.mp4` would point at the wrong location.

## 14. We verified the public release

Before calling the project complete, we checked:

- The GitHub repository was public
- The Pages workflow finished successfully
- The homepage returned HTTP 200
- The hero MP4 returned HTTP 200
- Product images returned HTTP 200
- The hero animation played and exposed its pause control
- All 16 products rendered
- Navigation used the correct `/the-desert/` base path
- Search, filters, dialogs, favorites, and cart behavior worked
- The working tree was clean

## Resources included in this repository

| Resource | Location | Purpose |
|---|---|---|
| Original Pinterest-discovered reference | `creative/original-reference.png` | Starting visual reference |
| Exact hero animation prompt | `creative/hero-video-prompt.txt` | Recreate or revise the Kling motion |
| All 16 product prompts | `creative/product-prompts.json` | Recreate the product catalog |
| Final hero poster | `public/assets/hero-poster.png` | Fast first paint and motion fallback |
| Final ten-second hero video | `public/assets/hero.mp4` | Animated website hero |
| Hero configuration | `public/assets/hero-config.json` | Video path and media metadata |
| Product images | `public/assets/products/*.webp` | Optimized catalog assets |
| Wordmark symbol/favicon | `public/assets/favicon.svg` | Browser and brand mark |
| Page structure | `public/index.html` | Semantic storefront markup |
| Design system and responsive layouts | `public/style.css` | Colors, typography, layout, motion, breakpoints |
| Product catalog and filtering functions | `public/data.js` | Structured collection data and pure logic |
| Storefront interactions | `public/app.js` | Search, saved items, dialogs, bag, checkout, hero motion |
| Development server | `server.mjs` | Local static server |
| Production build script | `scripts/build.mjs` | Creates `dist/` |
| Automated tests | `tests/store.test.mjs` | Validates catalog and cart logic |
| Project commands | `package.json` | Development, test, and build scripts |
| Pages workflow | `.github/workflows/pages.yml` | Tests, builds, and deploys every push to `main` |
| Hosting metadata | `.openai/hosting.json` | Original ChatGPT Sites project connection |

## External tools and services used

| Tool | How it was used |
|---|---|
| Pinterest | Discovery of the initial visual reference |
| Codex | Creative direction, site architecture, implementation, tests, and deployment |
| GPT Image 2 | 16:9 hero composition and product-image generation |
| Higgsfield | Interface used to submit the image-to-video render |
| Kling 3.0 Turbo | Generated the ten-second animated hero |
| Node.js | Local development, tests, and build scripts |
| Git | Source history and version control |
| GitHub | Public source repository |
| GitHub Actions | Automated test and deployment pipeline |
| GitHub Pages | Public website hosting |
| ChatGPT Sites | Early hosted preview before the GitHub release |

## What still needs to change for a real store

The published project is a working frontend concept. To accept real orders, connect it to a commerce backend and payment provider. Replace the illustrative prices, inventory, sizes, materials, and measurements with verified business data. Add shipping, returns, customer support, privacy, analytics, and legal policies that match the actual business and customer locations.

That separation let us finish a convincing public experience without pretending that a payment or fulfillment system already existed.
