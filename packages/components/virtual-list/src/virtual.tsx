import { createNamespace } from "@zi-shui/utils/create";
import {
  computed,
  defineComponent,
  h,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";

export default defineComponent({
  name: "z-virtual-list",
  props: {
    size: {
      type: Number,
      default: 40,
    },
    remain: {
      type: Number,
      default: 10,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const bem = createNamespace("vl");
    const wrapperRef = ref<HTMLElement>();
    const barRef = ref<HTMLElement>();
    // 计算显示的区域
    const state = reactive({
      start: 0,
      end: props.remain,
    });
    const prev = computed(() => {
      return Math.min(state.start, props.remain);
    });
    const next = computed(() => {
      return Math.min(props.remain, props.items.length - state.end);
    });
    // 计算可见的数据
    const visibleData = computed(() => {
      // return props.items.slice(state.start, state.end);
      // 这里应该多展示 上八条和下八条 保证用户在快速滚动时，不会白屏
      return props.items.slice(
        state.start - prev.value,
        state.end + next.value
      );
    });
    watch(
      () => props.items,
      () => {
        wrapperRef.value!.style.height = `${props.size * props.remain}px`;
        barRef.value!.style.height = `${props.size * props.items.length}px`;
      }
    );
    onMounted(() => {
      wrapperRef.value!.style.height = `${props.size * props.remain}px`;
      barRef.value!.style.height = `${props.size * props.items.length}px`;
    });
    const offset = ref(0);
    const handleScroll = () => {
      // 根据当前滚动的距离来算过去了几个数据
      const scrollTop = wrapperRef.value!.scrollTop;
      state.start = Math.floor(scrollTop / props.size); // 划过去了几个
      state.end = state.start + props.remain; // 显示到第几个
      offset.value = state.start * props.size - props.size * prev.value; // 偏移量 滚过去了多少距离
    };
    return () => {
      return (
        <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
          {/* 模拟总数据长度 感觉很多数据 */}
          <div class={bem.e("scroll-bar")} ref={barRef}></div>
          {/* 更新列表从哪展示到哪 一直只展示remain条数据 */}
          <div
            class={bem.e("scroll-list")}
            style={{
              transform: `translate3d(0, ${offset.value}px, 0)`,
            }}
          >
            {visibleData.value.map((node, index) => {
              return slots.default?.({ node });
            })}
          </div>
        </div>
      );
    };
  },
});
