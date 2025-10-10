/*
  rename-gallery-images.js
  - Renames image files in assets/images/gallery/sports-day to safe filenames
    (replaces spaces and parentheses with underscores) and updates the
    filenames referenced in assets/js/gallery.js and assets/js/hero-carousel.js.

  Usage (from project root):
    node scripts/rename-gallery-images.js

  This script performs filesystem renames. Make a backup or commit changes
  before running. It will print a summary of renames and the JS files it modified.
*/

const fs = require("fs");
const path = require("path");

const IMAGES_DIR = path.join(
  __dirname,
  "..",
  "assets",
  "images",
  "gallery",
  "sports-day"
);
const GALLERY_JS = path.join(__dirname, "..", "assets", "js", "gallery.js");
const HERO_JS = path.join(__dirname, "..", "assets", "js", "hero-carousel.js");

function safeName(name) {
  // Replace spaces and parentheses and multiple dots; collapse multiple underscores
  const ext = path.extname(name);
  let base = path.basename(name, ext);
  base = base.replace(/[\s]+/g, "_");
  base = base.replace(/[()]/g, "_");
  base = base.replace(/[^a-zA-Z0-9_\-\.]/g, "");
  base = base.replace(/__+/g, "_");
  // ensure we don't produce leading/trailing underscore garbage
  base = base.replace(/^_+|_+$/g, "");
  return base + ext.toLowerCase();
}

function updateFileReferences(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;
  for (const [oldName, newName] of Object.entries(replacements)) {
    // Replace exact occurrences inside quotes in JS arrays
    const escapedOld = oldName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp("(['\"])" + escapedOld + "(['\"])", "g");
    if (regex.test(content)) {
      content = content.replace(regex, `$1${newName}$2`);
      changed = true;
      console.log(
        `Updated reference in ${path.basename(
          filePath
        )}: ${oldName} -> ${newName}`
      );
    }
  }
  if (changed) fs.writeFileSync(filePath, content, "utf8");
  return changed;
}

(function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("Images directory not found:", IMAGES_DIR);
    process.exit(1);
  }

  const files = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => fs.statSync(path.join(IMAGES_DIR, f)).isFile());
  const replacements = {};

  files.forEach((file) => {
    const newFile = safeName(file);
    if (newFile !== file) {
      const src = path.join(IMAGES_DIR, file);
      const dst = path.join(IMAGES_DIR, newFile);
      if (fs.existsSync(dst)) {
        console.warn("Target file already exists, skipping rename:", dst);
        return;
      }
      fs.renameSync(src, dst);
      replacements[file] = newFile;
      console.log(`Renamed: ${file} -> ${newFile}`);
    }
  });

  if (Object.keys(replacements).length === 0) {
    console.log("No files needed renaming. Exiting.");
    return;
  }

  // Update JS references
  if (fs.existsSync(GALLERY_JS)) updateFileReferences(GALLERY_JS, replacements);
  if (fs.existsSync(HERO_JS)) updateFileReferences(HERO_JS, replacements);

  console.log("Rename operation complete. Please review changes and commit.");
})();
