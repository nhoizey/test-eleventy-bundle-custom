# test-eleventy-bundle-custom

Reduced test case for mixing Eleventy bundle plugin with custom template formats

## Setup

```
npm install
npm run build
```

## What I want to achieve

I would like to have each script **rendered only once**, even if it is **used in multiple pages**.

## What I currently have

I have 3 pages.

One script is loaded in all 3 pages, but another script is loaded only in 2 of them.

The scripts are bundled using Eleventy's bundle plugin.

Here's the log of the build:

```
Compiling script_2.js…
Compiling script_1.js…
Compiling script_1.js…
Compiling script_1.js…
[11ty] Writing ./_site/index_3.html from ./src/index_3.njk
[11ty] Writing ./_site/index_2.html from ./src/index2.njk
[11ty] Writing ./_site/index.html from ./src/index.njk
[11ty] Wrote 3 files in 0.06 seconds (v3.1.2)
```

### Loading the bundled scripts

- `script_1.js` should be used in all 3 pages, it is loaded in the `default.njk` layout with `bundle_1`: `<script src="{% getBundleFileUrl "js", "bundle_1" %}"></script>`
- `script_2.js` should be used only in `index_2.njk` and `index_3.njk`, where it is loaded in `bundle_2`: `<script src="{% getBundleFileUrl "js", "bundle_2" %}"></script>`

### Rendering/bundling the scripts

- `script_1.js` is **rendered 3 times** when `{% js "bundle_1" %}{% renderFile "src/assets/js/script_1.js" %}{% endjs %}` is in `default.njk`
- `script_2.js` is rendered only once when `{% js "bundle_2" %}{% renderFile "src/assets/js/script_2.js" %}{% endjs %}` is in `index_2.njk`, but it is then **not available** in `index_3.html`
- If I add `{% js "bundle_2" %}{% renderFile "src/assets/js/script_2.js" %}{% endjs %}` in `index_3.njk`, it is **rendered twice**
