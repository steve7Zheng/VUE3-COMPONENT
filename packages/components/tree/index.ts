import _Tree from "./src/tree.vue";
import { withInstall } from "../../utils/withInstall";

const Tree = withInstall(_Tree);

export default Tree;

declare module "vue" {
  export interface GlobalComponents {
    ZTree: typeof Tree;
  }
}
export * from "./src/tree";
