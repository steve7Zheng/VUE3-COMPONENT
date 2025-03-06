import _Virtual from "./src/virtual";
import { withInstall } from "../../utils/withInstall";

const Tree = withInstall(_Virtual);

export default Tree;

declare module "vue" {
  export interface GlobalComponents {
    ZVirtualList: typeof Tree;
  }
}
