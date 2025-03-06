import { defineComponent, inject } from "vue";
import { treeNodeContentProps, treeInjectKey } from "./tree";
export default defineComponent({
  name: "ZTreeNodeContent",
  props: treeNodeContentProps,
  setup(props) {
    const treeContext = inject(treeInjectKey);
    const node = props.node;
    return () => {
      return treeContext?.slots?.default
        ? treeContext.slots.default({ node })
        : node?.label;
    };
  },
});
