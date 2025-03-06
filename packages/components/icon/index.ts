// 用来整合组件的 最终实现导出组件
import { withInstall } from '@zi-shui/utils/withInstall'
import _Icon from './src/icon.vue'

const Icon = withInstall(_Icon)
export default Icon  // 可以通过app.use(Icon) 注册组件 也可以通过import方式单独来使用
export * from './src/icon'

// 为 Vue 的全局组件类型声明添加 ZIcon
// 这里添加的类型 可以在模板中被解析
declare module 'vue' {
  export interface GlobalComponents { // 我们的接口可以自动合并
    ZIcon: typeof Icon
  }
}