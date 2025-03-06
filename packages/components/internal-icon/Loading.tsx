import { defineComponent, h } from "vue";
export default defineComponent({
  name: "Switcher",
  render() {
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024",
        class: "loading",
      },
      [
        h("path", {
          d: "M512 896a384 384 0 0 1 0-768",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "64",
          "stroke-linecap": "round",
        }),
      ]
    );
  },
});
