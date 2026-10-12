const assert = require('node:assert/strict');
const { app } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
app.on('browser-window-created', (_event, window) => {
  window.webContents.on('did-finish-load', async () => {
    try {
      const pages = fs.readdirSync(path.join(__dirname, '../res/MainControl')).filter(name => name.endsWith('.html'));
      const result = await window.webContents.executeJavaScript(`(async () => {
        const pages = ${JSON.stringify(pages)};
        for (const page of pages) {
          const response = await fetch('/' + page.replace('.html', ''));
          const html = await response.text();
          if (!response.ok || !html.includes('<html')) throw new Error(page);
          const document = new DOMParser().parseFromString(html, 'text/html');
          for (const script of document.querySelectorAll('script[src]')) {
            const url = new URL(script.getAttribute('src'), response.url);
            if (!(await fetch(url)).ok) throw new Error(url.href);
          }
        }
        const config = await fetch('/js/ear_config_file.json');
        await config.json();
        return { serial: typeof navigator.serial?.requestPort, secure: isSecureContext,
          connect: typeof scanNewDevicesFastpair, node: typeof require };
      })()`);
      assert.deepEqual(result, { serial: 'function', secure: true, connect: 'function', node: 'undefined' });
      console.log(`Smoke passed: ${pages.length} device routes, configuration, Web Serial, secure context, renderer isolation.`);
      app.exit(0);
    } catch (error) {
      console.error(error);
      app.exit(1);
    }
  });
});
require('../main.js');
setTimeout(() => { console.error('Smoke timed out'); app.exit(1); }, 30000).unref();
