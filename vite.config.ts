import { resolve } from 'path';
import { PluginOption, defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  assetsInclude: ['*/.hbs'],
  base: '/',
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        page400: resolve(__dirname, 'src/pages/400.html'),
        page500: resolve(__dirname, 'src/pages/500.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        profile: resolve(__dirname, 'src/pages/profile.html'),
        signin: resolve(__dirname, 'src/pages/signin.html'),
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }) as PluginOption,
  ],
});
