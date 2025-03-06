// 这里相当于项目中的main.ts文件吧
import DefaultTheme from "vitepress/theme";
import ZIcon from "@zi-shui/components/icon";
import "@zi-shui/theme-chalks/src/index.scss";
// console.log(ZIcon);
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ZIcon); // 在vitepress全局注册组件
  },
};
