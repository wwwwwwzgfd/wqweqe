import { Graph, Addon, FunctionExt, Shape } from '@antv/x6'
import './shape'
import { customPorts, basicPorts } from './ports'
import { getImg } from '../../../utils'
import graphData from './data/data'
const insertCss = require('insert-css')

insertCss(`
  @keyframes ant-line {
    to {
        stroke-dashoffset: -1000
    }
  }
`)

export default class FlowGraph {
  static graph = null
  static stencil = null

  /**
   * 初始化方法
   * @param {*} dom 画板容器
   * @param {*} width 容器宽度
   * @param {*} height 容器高度
   * @param {*} flag 默认为true，传入false只实例化画板
   * @returns 
   */
  static init(dom, width = 1200, height = 900, flag = true, minimapContainer) {
    // 初始化 流程图画板
    this.graph = new Graph({
      background: {
        color: '#e5e5e5' // 设置画布背景颜色
      },
      container: dom,
      width: width,
      height: height,
      autoResize: true,
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#cccccc',
            thickness: 1,
          },
          {
            color: '#5F95FF',
            thickness: 1,
            factor: 4,
          },
        ],
      },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: false,
      },
      minimap: {
        enabled: true,
        container: minimapContainer,
        graphOptions: {
          async: true,
          //   getCellView(cell) {
          //     // 用指定的 View 替换节点默认的 View
          //     if (cell.isNode()) {
          //       return SimpleNodeView
          //     }
          //   },
          //   createCellView(cell) {
          //     // 在小地图中不渲染边
          //     if (cell.isEdge()) {
          //       return null
          //     }
          //   },
        }
      },
      // 开启画布缩放
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 2,
      },
      // minimap: {
      //   enabled: true,
      //   container: minimapContainer,
      //   graphOptions: {
      //     async: true,
      //     getCellView(cell) {
      //       // 用指定的 View 替换节点默认的 View
      //       if (cell.isNode()) {
      //         return SimpleNodeView
      //       }
      //     },
      //     createCellView(cell) {
      //       // 在小地图中不渲染边
      //       if (cell.isEdge()) {
      //         return null
      //       }
      //     },
      //   }
      // },
      interacting: {
        nodeMovable: true, //节点是否可以被移动。
        edgeMovable: false, //边是否可以被移动。
        edgeLabelMovable: false, //边的标签是否可以被移动。
        arrowheadMovable: false, //边的起始/终止箭头是否可以被移动
        vertexMovable: true, //边的路径点是否可以被移动。
        vertexAddable: true, //是否可以添加边的路径点。
        vertexDeletable: true, //边的路径点是否可以被删除。
      },
      connecting: {
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: true,
        highlight: true,
        snap: true, // 是否自动吸附
        allowMulti: true, // 是否允许在相同的起始节点和终止之间创建多条边
        allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
        allowBlank: false, // 是否允许连接到空白点
        allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点，
        allowEdge: false, // 是否允许边链接到另一个边
        highlight: true, // 拖动边时，是否高亮显示所有可用的连接桩或节点
        connectionPoint: "anchor", // 指定连接点
        anchor: "center", // 指定被连接的节点的锚点
        createEdge() {
          // X6 的 Shape 命名空间中内置 Edge、DoubleEdge、ShadowEdge 三种边
          return new Shape.DoubleEdge({
            attrs: {
              // line: {
              //   stroke: '#5F95FF',
              //   strokeWidth: 4,
              //   targetMarker: {
              //     name: 'classic',
              //     size: 8,
              //   },
              //   stroke: '#1890ff',
              //   strokeDasharray: 5,
              //   targetMarker: null,//block classic diamond cross async path circle circlePlus ellipse
              //   style: {
              //     animation: 'ant-line 30s infinite linear',
              //   },
              // },

              line: {
                strokeWidth: 1,
                stroke: '#cfe7f2',
                strokeDasharray: 0,
                style: {
                  animation: 'ant-line 0s infinite linear',
                },
                targetMarker: {
                  d: 'M 10 -5 0 0 10 5 Z',
                  fill: 'blue',
                  stroke: 'blue',
                  strokeWidth: 1,
                  refX: 6,
                  refY: 0,
                  markerWidth: 10,
                  markerHeight: 10,
                  // 其他箭头属性
                },
                // targetMarker: null, // 去掉箭头
                sourceMarker: {
                  tagName: 'path',
                  d: 'M 20 -10 0 0 20 10 Z',
                },
              },
              // line:{
              //   stroke:"#5F95FF",
              //   targetMarker:{
              //     stroke:'none'
              //   }
              // },
              outline: {
                stroke: 'transparent',
                strokeWidth: 7,
              }
            },
            router: {
              name: 'metro',
              args: {
                offset: 32,
                direction: 'H'
              }
            }
          })
        },
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          if (sourceView === targetView) {
            return false
          }
          if (!sourceMagnet) {
            return false
          }
          if (!targetMagnet) {
            return false
          }
          return true
        },
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          fill: 'yellow',
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: 'red',
            },
          },
        },
        magnet: {
          // 选中框的样式配置
          stroke: 'yellow', // 将颜色修改为红色
        }
      },
      // 开启拖拽平移（防止冲突，按下修饰键并点击鼠标才能触发画布拖拽）
      panning: {
        enabled: true,
        modifiers: 'shift',
      },
      resizing: true,
      rotating: true,
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
        showEdgeSelectionBox: true,
        className: 'my-selecting'
      },
      snapline: true,
      history: true,
      clipboard: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            // 只有 data.parent 为 true 的节点才是父节点
            const data = node.getData()
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        },
      },
    })
    //注册节点
    Graph.registerNode(
      'org-node',
      {
        width: 180,
        height: 60,
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'image',
            selector: 'avatar',
          },
          {
            tagName: 'text',
            selector: 'rank',
          },
          {
            tagName: 'text',
            selector: 'name',
          },
        ],
        attrs: {
          body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#5F95FF',
            stroke: '#5F95FF',
            strokeWidth: 1,
            rx: 10,
            ry: 10,
            pointerEvents: 'visiblePainted',
          },
          avatar: {
            width: 48,
            height: 48,
            refX: 8,
            refY: 6,
          },
          rank: {
            refX: 0.9,
            refY: 0.2,
            fill: '#fff',
            fontFamily: 'Courier New',
            fontSize: 14,
            textAnchor: 'end',
            textDecoration: 'underline',
          },
          name: {
            refX: 0.9,
            refY: 0.6,
            fill: '#fff',
            fontFamily: 'Courier New',
            fontSize: 14,
            fontWeight: '800',
            textAnchor: 'end',
          },
        },
      },
      true,
    )
    
    Graph.registerEdge(
      'org-edge',
      {
        zIndex: -1,
        attrs: {
          line: {
            fill: 'none',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            stroke: '#A2B1C3',
            sourceMarker: null,
            targetMarker: null,
          },
        },
      },
      true,
    )

    if (!flag) {
      // this.graph.centerContent()
      this.graph.hideGrid() // 返显渲染的时候 隐藏网格
      return this.graph
    }
    this.initStencil()
    this.initShape()
    this.initGraphShape()
    this.initEvent()
    return this.graph
  }
  // 初始化根节点
  static initStencil() {
    this.stencil = new Addon.Stencil({
      target: this.graph,
      stencilGraphWidth: 280,
      search: { rect: true },
      placeholder: "组件",
      notFoundText: "搜索",
      collapsable: true,
      groups: [
        {
          name: 'basic',
          title: '基础节点',
          graphHeight: 270,
        },
        {
          name: 'custom-image',
          title: '系统设计图',
          graphHeight: 600
        },
        {
          name: 'organization-chart',//根据name匹配
          title: '组织架构图',
          layoutOptions: {
            columns: 1,
            marginX: 60,
          },
          graphHeight: 260,
        },
        {
          name: 'group',
          title: '节点组',
          graphHeight: 100,
          layoutOptions: {
            columns: 1,
            marginX: 60,
          },
        },
      ],
    })
    const stencilContainer = document.querySelector('#stencil')
    stencilContainer?.appendChild(this.stencil.container)
  }
  // 初始化具体每个根节点下不同类型节点
  static initShape() {
    const { graph } = this
    // 基础节点
    const r1 = graph.createNode({
      shape: 'flow-chart-rect',//观察发现是通过创建配置项 结果shape中并不支持org-node 所以我判断组织架构图和流程图是同一层级的 自我感觉混不到一起去
      attrs: {
        body: {
          rx: 24,
          ry: 24,
        },
        text: {
          text: '起始节点',
        },
      },
    })
    const r2 = graph.createNode({
      shape: 'flow-chart-rect',
      attrs: {
        text: {
          text: '流程节点',
        },
      },
    })
    const r3 = graph.createNode({
      shape: 'flow-chart-rect',
      width: 52,
      height: 52,
      angle: 45,
      attrs: {
        'edit-text': {
          style: {
            transform: 'rotate(-45deg)',
          },
        },
        text: {
          text: '判断节点',
          transform: 'rotate(-45deg)',
        },
      },
      ports: {
        groups: {
          top: {
            position: {
              name: 'top',
              args: {
                dx: -26,
              },
            },
          },
          right: {
            position: {
              name: 'right',
              args: {
                dy: -26,
              },
            },
          },
          bottom: {
            position: {
              name: 'bottom',
              args: {
                dx: 26,
              },
            },
          },
          left: {
            position: {
              name: 'left',
              args: {
                dy: 26,
              },
            },
          },
        },
      },
    })
    const r4 = graph.createNode({
      shape: 'flow-chart-rect',
      width: 70,
      height: 70,
      attrs: {
        body: {
          rx: 35,
          ry: 35,
        },
        text: {
          text: '链接节点',
        },
      },
    })
    // // Vue节点
    // const r5 = graph.createNode({
    //   shape: 'vue-shape',
    //   component: 'vue-shape-text',
    //   width: 80,
    //   height: 42,
    //   attrs: {
    //     body: {
    //       stroke: '#5F95FF',
    //       strokeWidth: 1,
    //       fill: 'transparent',
    //     },
    //   },
    //   ports: { ...basicPorts }
    // })
    // 组合节点
    // const c1 = graph.createNode({
    //   shape: 'flow-chart-image-rect',
    // })
    // const c2 = graph.createNode({
    //   shape: 'flow-chart-title-rect',
    // })
    // const c3 = graph.createNode({
    //   shape: 'flow-chart-animate-text',
    // })
    // // 节点组
    // const g1 = graph.createNode({
    //   shape: 'groupNode',
    //   attrs: {
    //     text: {
    //       text: 'Group Name',
    //     },
    //   },
    //   data: {
    //     parent: true,
    //   },
    // })
    // 系统设计图
    const imgs = [
      {
        image: getImg('api.png')//他不是用的这个，你都试试 先用普通的绝对路径试试或者在搜一搜
      },
      {
        image: getImg('wft1.png')
      },
      {
        image: getImg('wft2.png')
      },
      {
        image: getImg('wft3.png')
      },
      {
        image: getImg('wft4.png')
      },
      {
        image: getImg('wft5.png')
      },
      {
        image: getImg('lqt.png')
      },
      {
        image: getImg('lqb-o.png')
      },
      {
        image: getImg('ldb-o.png')
      },
      {
        image: getImg('bh.png')
      },
      {
        image: getImg('f1.png')
      },
      {
        image: getImg('f2.png')
      },
      {
        image: getImg('f3.png')
      },
    ]
    const imgNodes = imgs.map(item => {
      return graph.createNode({

        shape: 'image', //可选值：Rect Circle Ellipse Polygon Polyline Path Image HTML TextBlock BorderedImage EmbeddedImage InscribedImage Cylinder
        imageUrl: item.image,
        attrs: {
          image: {
          },
        },
        width: 52,
        height: 52,
        ports: { ...customPorts }
      })
    })
    //组织架构图
    //我在这里模拟r1自己写 数据打算渲染到匹配的位置
    //通过gpt和文档我们发现如果想用org-node等需要注册node。这是我的想法是这样的不知道能不能行
    const o1 = graph.createNode({//这里报错找不大道org-node 这个org-node是通过文档内组织及架构图的shape得知
      shape: 'org-node',//我们看文档中对于org-node这个的描述寻求解决方案 如果文档中没有对其 那就说明以上猜测正确
      attrs: {
        avatar: {
          opacity: 0.2,
          'xlink:href':getImg('f1.png')
        },//先换成本地地址试一试如果不行查一下xlink:href什么意思
        rank: {
          text: 'CEO',
          wordSpacing: '-5px',
          letterSpacing: 0,
        },
        name: {
          text: '王',
          fontSize: 13,
          fontFamily: 'Arial',
          letterSpacing: 0,
        },
      },
    })
    const o2 = graph.createNode({//这里报错找不大道org-node 这个org-node是通过文档内组织及架构图的shape得知
      shape: 'org-node',//我们看文档中对于org-node这个的描述寻求解决方案 如果文档中没有对其 那就说明以上猜测正确
      attrs: {
        avatar: {
          opacity: 0.2,
          'xlink:href':getImg('f1.png')
        },//先换成本地地址试一试如果不行查一下xlink:href什么意思
        rank: {
          text: 'CEO',
          wordSpacing: '-5px',
          letterSpacing: 0,
        },
        name: {
          text: '王',
          fontSize: 13,
          fontFamily: 'Arial',
          letterSpacing: 0,
        },
      },
    })
    const o3 = graph.createNode({//这里报错找不大道org-node 这个org-node是通过文档内组织及架构图的shape得知
      shape: 'org-node',//我们看文档中对于org-node这个的描述寻求解决方案 如果文档中没有对其 那就说明以上猜测正确
      attrs: {
        avatar: {
          opacity: 0.2,
          'xlink:href':getImg('f1.png')
        },//先换成本地地址试一试如果不行查一下xlink:href什么意思
        rank: {
          text: 'CEO',
          wordSpacing: '-5px',
          letterSpacing: 0,
        },
        name: {
          text: '王',
          fontSize: 13,
          fontFamily: 'Arial',
          letterSpacing: 0,
        },
      },
    })
    // this.stencil.load([r1, r2, r3, r4, r5], 'basic')
    //这里是渲染左侧数据调用这个load传值 参数1 要渲染的数据 参数2类型
    this.stencil.load([r1, r2, r3, r4], 'basic')
    this.stencil.load(imgNodes, 'custom-image')
    this.stencil.load([o1,o2,o3],'organization-chart')
    // this.stencil.load([c1, c2, c3], 'combination')
    // this.stencil.load([g1], 'group')
  }

  // 根据json渲染节点和边 这个就是那个json数据
  static initGraphShape(gd = graphData) {
    this.graph.fromJSON(gd)//通过自带的方法进行转换渲染 json数据改变只是初始化时某些元素改变与graph类/实例没有关系
  }

  // 连接桩显示时机
  static showPorts(ports, show) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  static showContextMenu(x, y) {

  }
  // 事件相关
  static initEvent() {
    const { graph } = this
    const container = document.getElementById('container')
    // 双击编辑文本
    graph.on('node:dblclick', ({ cell, view }) => {
      // console.log(view.container)
      // const oldText = cell.attr('text/text')
      // cell.attr('text/style/display', 'none')
      // const elem = view.container.querySelector('.x6-edit-text')
      // if (elem) {
      //   elem.innerText = oldText
      //   elem.focus()
      // }
      // const onBlur = () => {
      //   cell.attr('text/text', elem.innerText)
      //   cell.attr('text/style/display')
      // }
      // if(elem){
      //   elem.addEventListener('blur', () => {
      //     onBlur()
      //     elem.removeEventListener('blur', onBlur)
      //   })
      // }
      const oldText = cell.attr("text/text")
      const nodeElement = view.container.querySelector(".x6-edit-text")
      const input = document.createElement("input")
      input.type = "text"
      input.value = oldText;
      input.style = `width:${nodeElement.clientWidth}px;
      position:absolute;
      left:${nodeElement.offsetLeft}px;
      text-align:center;
      border:none;
      padding:2px 0;
      `;
      nodeElement.appendChild(input);
      input.focus();
      input.addEventListener("blur", () => {
        const newLabel = input.value;
        cell.attr("text/text", newLabel)
        nodeElement.removeChild(input);
      })
    }),
    
      // 鼠标移入 显示连接桩
      graph.on('node:mouseenter', FunctionExt.debounce(() => {
        const ports = container.querySelectorAll('.x6-port-body')
        this.showPorts(ports, true)
      }), 500,)
    // 鼠标移出 隐藏连接桩
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll('.x6-port-body')
      this.showPorts(ports, false)
    })

    graph.on('node:collapse', ({ node, e }) => {
      e.stopPropagation()
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const cells = node.getDescendants()
      cells.forEach(n => {
        if (collapsed) {
          n.hide()
        } else {
          n.show()
        }
      })
    })
  // graph.on('node:click',({ e, x, y, node, view,cell })=>{
  //   console.log(e,1111,x,y,node,cell);
  //   //点击元素获取当前元素的坐标保存并且获取当前源 
  //   //再次单击元素时判断是否是同一个元素保存当前元素坐标以及元素
  //   //使用graph.addEdge({})将保存的坐标以及元素给到source:{cell:source}cell的值即为第一次点击的元素
  //   //将第二次点击元素的信息也就是元素给到target:{cell:target}这里的cell的值即为第二次点击的元素
  //   //我们通过观察文档发现graph.addEdge()是画线所以用这个方法
    
  //   let i = 1
  //   fn(i,cell)
  // })
  // function fn(i,cell,x,y){
  //   i++
  //   let source = cell;
  //   let target;
  //   let vertices = [{x,y}];
  //   if(i>=2){
  //     i=0
  //     target = cell
  //     vertices.push({x,y})
  //   }
  //   graph.addEdge({
  //     vertices,
  //     source: {
  //       cell,
  //     },
  //     target: {
  //       cell,
  //     },
  //     shape: 'org-edge',
  //   })
  //   source = target = vertices = null
  // }
    // backspace
    graph.bindKey('delete', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })
    // 鼠标动态添加/删除小工具。
    graph.on('edge:mouseenter', ({ cell }) => {
      /**
       * EdgeTool
       * vertices 路径点工具，在路径点位置渲染一个小圆点，拖动小圆点修改路径点位置，双击小圆点删除路径点，在边上单击添加路径点。
       * segments 线段工具。在边的每条线段的中心渲染一个工具条，可以拖动工具条调整线段两端的路径点的位置。
       * boundary 根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
       * button 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
       * button-remove 在指定的位置处，渲染一个删除按钮，点击时删除对应的边。
       * source-arrowhead-和-target-arrowhead 在边的起点或终点渲染一个图形(默认是箭头)，拖动该图形来修改边的起点或终点。
       * edge-editor 提供边上文本编辑功能。
       */
      cell.addTools([
        {
          name: 'vertices',
          args: {
            attrs: { fill: '#007acc' },
            // 移动路径点过程中的吸附半径。当路径点与邻近的路径点的某个坐标 (x, y) 距离在半径范围内时，将当前路径点的对应坐标 (x, y) 吸附到邻居路径的路径点。
            snapRadius: 20,
            // 在边上按下鼠标时，是否可以添加新的路径点。
            addable: false,
            // 是否可以通过双击移除路径点。
            removable: true,
            // 是否自动移除冗余的路径点。
            removeRedundancies: false,
            // 是否阻止工具上的鼠标事件冒泡到边视图上。阻止后鼠标与工具交互时将不会触发边的 mousedown、mousemove 和 mouseup 事件。
            stopPropagation: false
          }
        }
      ])
    })
    // graph.on('edge:mouseleave', ({ cell }) => {
    //   cell.removeTools()

    // })

  }
}
