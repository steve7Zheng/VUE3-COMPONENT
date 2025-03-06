import { withInstall } from "@zi-shui/utils/withInstall";
import _Checkbox from "./src/checkbox.vue";

const Checkbox = withInstall(_Checkbox);
export default Checkbox;
export * from "./src/checkbox";

declare module "vue" {
  export interface GlobalComponents {
    ZCheckbox: typeof Checkbox;
  }
}
