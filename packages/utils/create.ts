// BEM规范 
// BEM（Block Element Modifier）是一种流行的 CSS 命名规范，旨在解决大型项目中样式命名混乱、类名冲突和维护困难的问题。
//它通过严格的命名规则，使代码结构清晰、语义明确，尤其适合团队协作和复杂组件开发。
// block 独立的、可复用的功能模块（如按钮、导航栏、卡片）
// element 块的组成部分，不能脱离块独立存在（如按钮中的图标、表单的输入框）
// modifier 表示块或元素的状态或样式变体（如禁用状态、大小、颜色）
// block__element--modifier
// state 状态
// z-button  b
// z-button__element be
// z-button__element--disabled  bem
// is-checked is-enabled  state
// :class=[bem.b('button')]  使用BEM规范起类名

// 实现
function _bem(prefixName: string, blockSuffix: string, element: string, modifier: string) {
  if (blockSuffix) {
    prefixName += `-${blockSuffix}`
  }
  if (element) {
    prefixName += `__${element}`
  }
  if (modifier) {
    prefixName += `--${modifier}`
  }
  return prefixName
}
function createBEM(prefixName: string) {
  const b = (blockSuffix: string = '') => _bem(prefixName, blockSuffix, '', '')
  const e = (element: string = '') => element ? _bem(prefixName, '', element, '') : ''
  const m = (modifier: string = '') => modifier ? _bem(prefixName, '', '', modifier) : ''
  const be = (blockSuffix: string, element: string) => blockSuffix && element ? _bem(prefixName, blockSuffix, element, '') : ''
  const bm = (blockSuffix: string, modifier: string) => blockSuffix && modifier ? _bem(prefixName, blockSuffix, '', modifier) : ''
  const em = (element: string, modifier: string) => element && modifier ? _bem(prefixName, '', element, modifier) : ''
  const bem = (blockSuffix: string, element: string, modifier: string) => blockSuffix && element && modifier ? _bem(prefixName, blockSuffix, element, modifier) : ''
  const is = (name: string, state: boolean | string) => (state ? `is-${name}` : "")
  return { b, e, m, be, bm, em, bem, is }
}
export function createNamespace(name: string) {
  const prefixName = `z-${name}`
  return createBEM(prefixName)
}
const bem = createNamespace('icon')
// console.log(bem.b('box'))   // z-icon-box
// console.log(bem.e('element')) // z-icon__element
// console.log(bem.m('modifier')) // z-icon--modifier
// console.log(bem.be('box', 'element')) // z-icon-box__element
// console.log(bem.bm('box','modifier')) // z-icon-box--modifier
// console.log(bem.em('element','modifier')) // z-icon__element--modifier
// console.log(bem.bem('box', 'element', 'modifier')) // z-icon-box__element--modifier
// console.log(bem.is('checked', true)) // is-checked
// console.log(bem.is('enabled', true)) // is-enabled

