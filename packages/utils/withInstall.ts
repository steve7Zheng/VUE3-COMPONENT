import { Plugin } from 'vue'
export type SFCWithInstall<T> = T & Plugin
// 给组件添加install方法，方便按需引入
export function withInstall<T>(comp: T) {
  (comp as SFCWithInstall<T>).install = function(app) {
    const { name } = comp as unknown as { name: string }
    app.component(name, comp)
  }
  return comp as SFCWithInstall<T>
}