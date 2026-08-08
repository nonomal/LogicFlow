import { Card, Select, Input, Button, Space, Row, Col, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const textEditIcon = '/text-edit.svg'; // 图片实际放在了public目录下
const gifIcon = '/gif-icon.gif'; // 图片实际放在了public目录下

const { Menu } = Extension;

const config: Partial<LogicFlow.Options> = {
  isSilentMode: false,
  stopScrollGraph: true,
  stopZoomGraph: true,
  style: {
    rect: {
      rx: 5,
      ry: 5,
      strokeWidth: 2,
    },
    circle: {
      fill: '#f5f5f5',
      stroke: '#666',
    },
    ellipse: {
      fill: '#dae8fc',
      stroke: '#6c8ebf',
    },
    polygon: {
      fill: '#d5e8d4',
      stroke: '#82b366',
    },
    diamond: {
      fill: '#ffe6cc',
      stroke: '#d79b00',
    },
    text: {
      color: '#b85450',
      fontSize: 12,
    },
  },
};

const data = {
  nodes: [
    {
      id: '1',
      type: 'rect',
      x: 150,
      y: 100,
      text: '矩形节点',
    },
    {
      id: '2',
      type: 'circle',
      x: 350,
      y: 100,
      text: '圆形节点',
    },
    {
      id: '3',
      type: 'ellipse',
      x: 550,
      y: 100,
      text: '椭圆节点',
    },
    {
      id: '4',
      type: 'diamond',
      x: 150,
      y: 250,
      text: '菜单带Icon的节点',
    },
  ],
  edges: [
    {
      id: 'e_1',
      type: 'polyline',
      sourceNodeId: '1',
      targetNodeId: '2',
    },
    {
      id: 'e_2',
      type: 'polyline',
      sourceNodeId: '2',
      targetNodeId: '3',
    },
  ],
};
const container = document.querySelector('#container');
const root = createRoot(container);

const MenuExtension: React.FC = () => {
  const lfRef = useRef<LogicFlow>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuKey, setMenuKey] = useState<'nodeMenu' | 'edgeMenu' | 'graphMenu'>(
    'nodeMenu',
  );
  const [menuItem, setMenuItem] = useState<string>('删除');
  const [selectedMenu, setSelectedMenu] = useState<string[]>([
    'nodeMenu-删除',
    'nodeMenu-编辑文本',
    'nodeMenu-复制',
    'edgeMenu-编辑文本',
    'edgeMenu-删除',
  ]);
  const [forceUpdate, setForceUpdate] = useState(0);

  const nodeMenu = [
    {
      text: '删除',
      disabled: false,
      callback(node: NodeData) {
        if (window.confirm('确定要删除此节点吗？')) {
          lfRef.current?.deleteNode(node.id);
        }
      },
    },
    {
      icon: './text-edit.svg',
      text: '编辑文本',
      callback: (node) => {
        lfRef.current?.graphModel.editText(node.id);
      },
    },
    {
      text: '复制',
      callback(node: NodeData) {
        lfRef.current?.cloneNode(node.id);
      },
    },
    {
      text: '查看属性',
      callback(node: NodeData) {
        message.info(`
          节点id：${node.id}<br/>
          节点类型：${node.type}<br/>
          节点坐标：(x: ${node.x}, y: ${node.y})<br/>
          节点文本：${node.text?.value || '无'}
        `);
      },
    },
    {
      text: '锁定',
      callback(node: NodeData) {
        const nodeModel = lfRef.current?.getNodeModelById(node.id);
        if (nodeModel) {
          nodeModel.draggable = !nodeModel.draggable;
          message.info(`节点已${nodeModel.draggable ? '解锁' : '锁定'}`);
        }
      },
    },
  ];

  const edgeMenu = [
    {
      className: 'lf-menu-demo-edit',
      icon: true,
      text: '编辑文本',
      callback(edge: EdgeData) {
        lfRef.current?.graphModel.editText(edge.id);
      },
    },
    {
      text: '删除',
      callback(edge: EdgeData) {
        if (window.confirm('确定要删除此连线吗？')) {
          lfRef.current?.deleteEdge(edge.id);
        }
      },
    },
    {
      text: '查看属性',
      callback(edge: EdgeData) {
        const { id, type, startPoint, endPoint, sourceNodeId, targetNodeId } =
          edge;
        alert(`
          边id：${id}
          边类型：${type}
          边起点坐标：(x: ${startPoint.x}, y: ${startPoint.y})
          边终点坐标：(x: ${endPoint.x}, y: ${endPoint.y})
          源节点id：${sourceNodeId}
          目标节点id：${targetNodeId}
        `);
      },
    },
  ];

  const graphMenu = [
    {
      text: '添加矩形节点',
      callback(data: Position) {
        lfRef.current?.addNode({
          type: 'rect',
          x: data.x,
          y: data.y,
          text: '新节点',
        });
      },
    },
    {
      text: '添加圆形节点',
      callback(data: Position) {
        lfRef.current?.addNode({
          type: 'circle',
          x: data.x,
          y: data.y,
          text: '新圆形',
        });
      },
    },
    {
      text: '清空画布',
      disabled: false,
      callback() {
        if (window.confirm('确定要清空整个画布吗？')) {
          lfRef.current?.clearData();
        }
      },
    },
    {
      text: '适应画布',
      callback() {
        lfRef.current?.fitView();
      },
    },
  ];

  const handleMenuKeyChange = (
    value: 'nodeMenu' | 'edgeMenu' | 'graphMenu',
  ) => {
    setMenuKey(value);
  };

  useEffect(() => {
    if (!lfRef.current) {
      const lf = new LogicFlow({
        ...config,
        container: containerRef.current as HTMLElement,
        grid: {
          size: 10,
        },
        plugins: [Menu],
      });

      lf.render(data);

      lf.setMenuByType({
        type: 'diamond',
        menu: [
          {
            text: '空图标效果',
            icon: true, // 创建空的图标容器
            callback() {
              message.info('这是展示空图标的菜单项');
            },
          },
          {
            text: 'url Icon',
            icon: 'https://cdn.jsdelivr.net/gh/Logic-Flow/static@latest/docs/favicon.png',
            callback() {
              message.info('这是展示URL图标的菜单项');
            },
          },
          {
            text: 'base64 Icon',
            icon: textEditIcon,
            callback() {
              message.info('这是展示base64图标的菜单项');
            },
          },
          {
            text: 'className Icon',
            icon: 'customIcon',
            callback() {
              message.info('这是展示gif图标的菜单项');
            },
          },
          {
            text: 'gif Icon',
            icon: gifIcon,
            callback() {
              message.info('这是展示gif图标的菜单项');
            },
          },
        ],
      });
      lfRef.current = lf;
      const defaultMenus = [
        ...lf
          .getMenuConfig('nodeMenu')
          .map((item: any) => `nodeMenu-${item.text}`),
        ...lf
          .getMenuConfig('edgeMenu')
          .map((item: any) => `edgeMenu-${item.text}`),
        ...lf
          .getMenuConfig('graphMenu')
          .map((item: any) => `graphMenu-${item.text}`),
      ];
      console.log('defaultMenus', defaultMenus);
      setSelectedMenu(defaultMenus);
    }
  }, []);

  const handleMenuItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuItem(e.target.value);
  };

  const handleChangeMenuItemDisabled = (disabled: boolean) => {
    lfRef.current?.changeMenuItemDisableStatus(menuKey, menuItem, disabled);
  };

  const handleResetMenu = () => {
    if (lfRef.current) {
      lfRef.current.resetAllMenuConfig();
      setForceUpdate((prev) => prev + 1);
    }
  };

  const isExistInMenu = (
    text: string,
    menuType: 'nodeMenu' | 'edgeMenu' | 'graphMenu',
  ) => {
    return selectedMenu.find((item: any) => item === `${menuType}-${text}`);
  };

  const handleUpdateMenu = (
    text: string,
    menuType: 'nodeMenu' | 'edgeMenu' | 'graphMenu',
  ) => {
    const isExist = isExistInMenu(text, menuType);
    const curMenu = lfRef.current?.getMenuConfig(menuType) ?? [];
    const sourceMenu =
      menuType === 'nodeMenu'
        ? nodeMenu
        : menuType === 'edgeMenu'
          ? edgeMenu
          : graphMenu;
    const curSelectedMenu = selectedMenu.filter((item: string) =>
      item.includes(menuType),
    );
    const newMenu = isExist
      ? curMenu.filter((item: any) => item.text !== text)
      : [...curMenu, sourceMenu.find((item: any) => item.text === text)];
    lfRef.current?.setMenuConfig({
      [menuType]: newMenu,
    });
    if (curSelectedMenu.includes(`${menuType}-${text}`)) {
      setSelectedMenu((prev) =>
        prev.filter((item: string) => item !== `${menuType}-${text}`),
      );
    } else {
      setSelectedMenu((prev) => [...prev, `${menuType}-${text}`]);
    }
    setForceUpdate((prev) => prev + 1);
  };

  return (
    <Card title="LogicFlow Extension - Menu 菜单插件示例">
      <Row gutter={16}>
        <Col span={24}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Space direction="vertical" wrap>
              <div style={{ padding: '10px' }}>
                <Button
                  type="default"
                  onClick={handleResetMenu}
                  style={{ marginBottom: 10 }}
                >
                  菜单重置
                </Button>
                <h3 style={{ margin: '10px 0' }}>菜单置灰</h3>
                <Select
                  style={{ width: 120, marginRight: 10 }}
                  options={[
                    { label: '节点菜单', value: 'nodeMenu' },
                    { label: '边菜单', value: 'edgeMenu' },
                    { label: '画布菜单', value: 'graphMenu' },
                  ]}
                  value={menuKey}
                  onChange={handleMenuKeyChange}
                />
                <Input
                  style={{ width: 120, marginRight: 10 }}
                  value={menuItem}
                  onChange={handleMenuItemChange}
                  placeholder="菜单项文本"
                />
                <Button
                  style={{ marginRight: 10 }}
                  type="primary"
                  onClick={() => handleChangeMenuItemDisabled(true)}
                >
                  禁用
                </Button>
                <Button
                  style={{ marginRight: 10 }}
                  type="primary"
                  onClick={() => handleChangeMenuItemDisabled(false)}
                >
                  启用
                </Button>
              </div>
              <div style={{ padding: '10px' }}>
                <h3 style={{ margin: '10px 0' }}>节点菜单</h3>
                {nodeMenu.map((item) => {
                  return (
                    <Button
                      shape="round"
                      key={`node-${item.text}-${isExistInMenu(item.text, 'nodeMenu')}-${forceUpdate}`}
                      type={
                        isExistInMenu(item.text, 'nodeMenu')
                          ? 'primary'
                          : 'dashed'
                      }
                      onClick={() => handleUpdateMenu(item.text, 'nodeMenu')}
                      style={{ marginRight: 10, marginBottom: 8 }}
                    >
                      {item.text}
                    </Button>
                  );
                })}
              </div>
              <div style={{ padding: '10px' }}>
                <h3 style={{ margin: '10px 0' }}>边菜单</h3>
                {edgeMenu.map((item) => {
                  return (
                    <Button
                      shape="round"
                      key={`edge-${item.text}-${isExistInMenu(item.text, 'edgeMenu')}-${forceUpdate}`}
                      type={
                        isExistInMenu(item.text, 'edgeMenu')
                          ? 'primary'
                          : 'dashed'
                      }
                      onClick={() => handleUpdateMenu(item.text, 'edgeMenu')}
                      style={{ marginRight: 10, marginBottom: 8 }}
                    >
                      {item.text}
                    </Button>
                  );
                })}
              </div>
              <div style={{ padding: '10px' }}>
                <h3 style={{ margin: '10px 0' }}>画布菜单</h3>
                {graphMenu.map((item) => {
                  return (
                    <Button
                      shape="round"
                      key={`graph-${item.text}-${isExistInMenu(item.text, 'graphMenu')}-${forceUpdate}`}
                      type={
                        isExistInMenu(item.text, 'graphMenu')
                          ? 'primary'
                          : 'dashed'
                      }
                      onClick={() => handleUpdateMenu(item.text, 'graphMenu')}
                      style={{ marginRight: 10, marginBottom: 8 }}
                    >
                      {item.text}
                    </Button>
                  );
                })}
              </div>
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <div ref={containerRef} id="graph"></div>
        </Col>
      </Row>
    </Card>
  );
};

root.render(<MenuExtension></MenuExtension>);

insertCss(`
#graph{
  min-height: 500px;
  width: 100%;
  height: 100%;
}
.customIcon {
  background-image: url('/star.svg');
  background-color: #fef7eb;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
`);
