import { createApp } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { usePreferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/antd';

import { hackLicenseKey } from '@skit/x.surely-vue-table';
import STable, { setConfig } from '@surely-vue/table';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Antd from 'ant-design-vue';

import { setupI18n } from '#/locales';

import App from './app.vue';
import { router } from './router';

import '@surely-vue/table/dist/index.less';

async function bootstrap(namespace: string) {
  const app = createApp(App);

  // 国际化 i18n 配置
  await setupI18n(app);

  // 配置 pinia-tore
  await initStores(app, { namespace });

  // 安装权限指令
  registerAccessDirective(app);

  // 配置路由及路由守卫
  app.use(router);

  // 配置@tanstack/vue-query
  app.use(VueQueryPlugin);

  app.use(Antd);
  app.use(STable);

  app.mount('#app');

  hackLicenseKey({ hostname: 'localhost:3000' });
  const { isDark } = usePreferences();
  setConfig({
    theme: isDark.value ? 'dark' : 'light', // 暗黑主题
  });
}

export { bootstrap };
