# test-eleventy-bundle-custom

Reduced test case for mixing Eleventy bundle plugin with custom template formats

## Setup

```
npm install
npm run build
```

## Issues

### JS files rendered with `{% renderFile … %}` are compiled multiple times

When running `npm run build`, you should see:
- `Building common.js…` **3 times**, because it is rendered once as a template file, and twice in the `default.njk` layout because it is used in both `index.njk` and `index2.njk`.
- `Building for_page_2.js…` **twice**, because it is rendered once as a template file, and once in `index2.njk`.
- `Building a_third_one.js…` **twice**, because it is rendered once as a template file, and once in `assets.njk`.

There should be only one build for each JS file.

### The JS file rendered in `assets.njk` is not available in `bundle_3`

Despite being rendered in `assets.njk` with `renderFile`, the JS file `a_third_one.js` is not included in the `bundle_3` output requested by `<script src="{% getBundleFileUrl "js", "bundle_3" %}"></script>` in the `default.njk` layout. 🤷‍♂️
