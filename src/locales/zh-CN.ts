import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pages from './zh-CN/pages';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.copyright.produced': '春晓沐Cxm',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',

  "pages.accessKey.note.title": "重要安全提醒",
  "pages.accessKey.note.secretKey": "SecretKey仅在创建时显示一次，请立即保存到安全位置，丢失后将无法找回",
  "pages.accessKey.note.permissions": "可以为每个accessKey设置不同的接口访问权限",
  "pages.accessKey.note.rotation": "建议定期轮换密钥（至少每90天一次）",
  "pages.accessKey.note.disable": "不再使用的密钥请及时禁用或删除",


  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
