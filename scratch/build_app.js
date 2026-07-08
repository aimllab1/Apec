import { build } from 'vite';

async function run() {
  try {
    console.log("Starting programmatic Vite build...");
    await build({
      configFile: 'vite.config.js'
    });
    console.log("Programmatic Vite build completed successfully!");
  } catch (err) {
    console.error("Programmatic build failed:", err);
  }
}

run();
