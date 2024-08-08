# logicflow-docs

## 2.0.1

### Patch Changes

- Updated dependencies
  - @logicflow/core@2.0.0
  - @logicflow/extension@2.0.0
  - @logicflow/react-node-registry@1.0.0

- sites 中新增 docs 作为文档官网
  - update 「sites/docs」更新官方文档
  - 解决 docs 中类型定义错误的问题
  - 更新示例
  - 解决 docs 中的一些类型定义问题
  - 更新core包中事件系统的文档

  - 解决 docs 启动时「The same observable object cannot appear twice in the same tree」错误
    - 节点定义写法有问题，observer 属性赋值给另一个 observer 属性，导致触发上面错误
    - 更新包版本
    - DEFAULT_GRID_SIZE 将默认的 gridSize 值提成常量值，放在 constant 中，方便修改
    - 快速上手页优化 & API页方法分类 & 修复sites启动运行warning & 修复API页中英切换左侧nav不一致问题

  - 官网优化
    - 补充节点properties属性demo
    - 优化和修正概念解释
    - 添加项目模块命名空间,可以单独往某个模块添加依赖
    - 矩形、椭圆、多边形、菱形、圆可在properties.style设置样式属性
    - 文案统一
    - 增加微信官方号二维码
    - 快速上手页补充插件使用和数据转换
    - 文档中，内部导航统一放到右边
    - api顺序调整
    - 处理官网demo-ts报错提示
    - 增加企业用户展示墙

  - 更新 menu extension 官网文档示例代码

  - 更新官网项目 dumi 主题，使用 @logicflow/dumi-theme-simple 作为主题
    - 根据主题配置优化官网命名，en -> English, zh - 中文
    - 格式化所有 md 文档，修复文档中链接错误问题，解决代码块代码错误问题
    - 文档文件夹分组优化
    - 引入 examples 能力，支持在项目中实时更改并查看效果

  - 调整官网 markdown 资源结构，新模板配置项更新
    - 使用 dumi-theme-simple@0.0.2 版本，更新 Header 布局
    - 格式化文档，并更新文档中资源链接
    - 调整资源配置，使得官网可正常访问
  - 官网 API、文章模块修复链接跳转错误和细节优化
  - 增加 NodeResize/Group 插件废弃的说明，整理 extension 中导出插件分类
  - 增加树状逻辑编排demo&示例增加github跳转入口
  - doc use mako 打包，增加 Label 和 DynamicGroup 插件 demo
  - 新增 react-node-registry & vue-node-registry 包文档
    - 调整插件文档顺序
    - 格式化 highlight 插件文档格式
    - 增加 Label、DynamicGroup 插件文档
    - 更新、新增、待废弃 插件新增 tag 标记
  - 新增 dynamic-group 和 label 插件的文档
  - 完善mini-map官网文档