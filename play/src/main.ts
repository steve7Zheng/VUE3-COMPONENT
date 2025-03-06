import { createApp } from "vue";
import App from "./App.vue";
import Icon from "@zi-shui/components/icon";
import Tree from "@zi-shui/components/tree";
import Checkbox from "@zi-shui/components/checkbox";
import Button from "@zi-shui/components/button";
import Input from "@zi-shui/components/input";
import { FormItem, Form } from "@zi-shui/components/form";
import "@zi-shui/theme-chalks/src/index.scss";
console.log("Form", Form);
const plugins = [Icon, Tree, Checkbox, Button, Input, FormItem, Form];
// console.log(plugins);
const app = createApp(App);
plugins.forEach((plugin) => {
  app.use(plugin);
});
app.mount("#app");
