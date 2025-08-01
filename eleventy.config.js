import path from "node:path";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import esbuild from "esbuild";

const memoizedAssets = {};

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addBundle("js", {
    toFileDirectory: "bundle",
  });

  // Useless if all script are used with Bundle
  // eleventyConfig.addTemplateFormats("js");

  eleventyConfig.addExtension("js", {
    outputFileExtension: "js",
    read: true,
    useLayouts: false,
    compile: async (inputContent, inputPath) => {
      console.log(`Compiling ${path.basename(inputPath)}…`);

      if (!inputContent || inputContent.trim() === "") return;

      const normalizedPath = path.normalize(inputPath);

      // Only convert JS files from the JS assets folder
      if (!normalizedPath.includes("src/assets/js")) return;

      if (memoizedAssets[normalizedPath]) {
        return async (data) => memoizedAssets[normalizedPath];
      }

      return async (data) => {
        let output;

        try {
          output = await esbuild.build({
            entryPoints: [normalizedPath],
            bundle: true,
            format: "esm",
            target: "es2020",
            minify: true,
            write: false,
            external: ["fs"],
          });
          memoizedAssets[normalizedPath] = output.outputFiles[0].text;
        } catch (error) {
          console.error("☠️ esbuild error! ☠️");
          console.dir(error);
        }

        return output.outputFiles[0].text;
      };
    },
  });

  return {
    templateFormats: ["md", "njk"],

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      output: "_site",
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
  };
}
