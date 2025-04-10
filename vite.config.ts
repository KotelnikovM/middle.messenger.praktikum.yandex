import { resolve } from 'path';
import { PluginOption, defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  assetsInclude: ['*/.hbs'],
  base: '/',
  css: {
    postcss: './postcss.config.js',
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }) as PluginOption,
  ],
});
