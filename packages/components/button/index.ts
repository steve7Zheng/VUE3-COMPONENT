import _Button from "./src/button.vue";
import { withInstall } from "../../utils/withInstall";

const Button = withInstall(_Button);

export default Button;

declare module "vue" {
  export interface GlobalComponents {
    ZButton: typeof Button;
  }
}
export * from "./src/button";
