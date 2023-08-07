<template>
  <div class="flow">
    <div class="content">
      <!--左侧工具栏-->
      <div id="stencil" />
      <div class="panel">
        <!--流程图工具栏-->
        <div class="toolbar">
          <tool-bar v-if="isReady" />
        </div>
        <!--流程图画板-->
        <div id="container"></div>
        <div id="minimapContainer" @click.stop="hideFn"></div>
        <MenuBar
          v-if="showContextMenu"
          ref="menuBar"
          @callBack="contextMenuFn"
        />
      </div>
      <!--右侧工具栏-->
      <div class="config">
        <config-panel v-if="isReady" />
      </div>
    </div>
  </div>
</template>
<script>
import "./index.css";
import FlowGraph from "./graph";
import ToolBar from "./components/ToolBar/index.vue";
import ConfigPanel from "./components/ConfigPanel/index.vue";
import MenuBar from "./components/menuBar.vue";
import { $, getContainerSize } from "../../utils";
// import { Graph, NodeView, EdgeView } from '@antv/x6'
// import { ContextMenu } from '@antv/x6-vue'
export default {
  data() {
    return {
      isReady: false,
      destroyFn: null,
      graph: "",
      showContextMenu: false,
      contextMenuOptions: [
        { label: "选项1", action: "action1" },
        { label: "选项2", action: "action2" },
        // 添加更多右键菜单选项
      ],
    };
  },
  components: { ToolBar, ConfigPanel, MenuBar },
  mounted() {
    this.destroyFn = this.initGraph();
  },
  destroyed() {
    // 移除监听、销毁画布、资源回收

    this.destroyFn();
  },
  methods: {
    initGraph() {
      this.graph = FlowGraph.init(
        $("#container"),
        $("#container").getBoundingClientRect().width,
        $("#container").getBoundingClientRect().height,
        true,
        $("#minimapContainer")
      );
      console.log(this.$store.state.flow.fillMarker);
      //选中线添加颜色
      this.graph.on("edge:selected",({cell})=>{
        if(cell.shape=="double-edge" || cell.shape=="edge"){
          cell.attr({
            line:{
              stroke:"#F93A3A",
              targetMarker:{
                stroke:"none"
              }
            }
          })
        }
        const targetMarker=cell.attr("target/marker")
        if(targetMarker){
          const selectedMarker=targetMarker.clone().attr({
            fill:"#F93A3A",
            stroke:"#F93A3A"
          })
        cell.attr("target/marker",selectedMarker)
        }
      })
      //点击空白还原颜色颜色
      this.graph.on("edge:unselected",({cell})=>{
        if(cell.shape=="double-edge" || cell.shape=="edge"){
          cell.attr({
            line:{
              stroke:"#5F95FF",
              targetMarker:{
                stroke:''
              }
            }
          })
        }
      })
      // 右键编辑文本
      this.graph.on("edge:contextmenu", ({ e, x, y, edge, view }) => {
        e.preventDefault();
        this.showContextMenu = true;
        console.log(2222222222222222222);
        const elem = view.container.querySelector(".x6-edit-text");
        console.log(elem, 111111111111);
        if (elem) {
          elem.blur();
        }
        this.$nextTick(() => {
          this.$refs.menuBar.initFn(e.offsetX, e.offsetY, {
            type: "edge",
            item: edge,
          });
        });
        return false;
      });

      this.graph.on("node:contextmenu", ({ e, x, y, node, view }) => {
        e.preventDefault();
        this.showContextMenu = true;
        const elem = view.container.querySelector(".x6-edit-text");
        console.log(elem, 111111111111);
        if (elem) {
          elem.blur();
        }
        this.$nextTick(() => {
          // this.$refs.menuBar.setItem({ type: 'node', item: node })
          const p = this.graph.localToPage(x, y);
          this.$refs.menuBar.initFn(p.x, p.y, { type: "node", item: node });
        });
        return false;
      });
      this.isReady = true;
      const resizeFn = () => {
        const { width, height } = getContainerSize($(".panel"));
        this.graph.resize(width, height - 38);
      };

      this.graph.on("edge:dblclick", ({ edge, e }) => {
        edge.addTools({
          name: "edge-editor",
          args: {
            event: e,
          },
        });
        edge.setLabels([
          {
            attrs: {
              text: {
                text: "",
              },
            },
            position: {
              distance: 0.5,
            },
          },
        ]);
      });
      resizeFn();
      window.addEventListener("resize", resizeFn);
      return () => {
        window.removeEventListener("resize", resizeFn);

        this.graph.dispose();
      };
    },
    contextMenuFn(type, node) {
      let newNodeAttrText = "";
      switch (type) {
        case "remove":
          if (node.type == "edge") {
            this.graph.removeEdge(node.item.id);
          } else if (node.type == "node") {
            this.graph.removeNode(node.item.id);
          }
          break;
        case "delete":
          if (node.type == "edge") {
            this.graph.clearCells(node.item.id);
          } else if (node.type == "node") {
            this.graph.clearCells(node.item.id);
          }
          break;
        case "copy":
          console.log(node);
          this.graph.copy([node.item]);

          // newNodeAttrText = node.item.store.data.attrs.text.text
          break;
        case "paste":
          node.item.attr("text/text", newNodeAttrText);
          this.graph.paste([node.item]);

          break;
        case "cut":
          this.graph.cut([node.item]);
          break;
        case "source":
          this.$refs.dialogMysql.visible = true;
          this.$refs.dialogMysql.init(node);
          break;
      }

      this.showContextMenu = false;
    },
    hideFn() {
      this.showContextMenu = false;
    },
  },
};
</script>
<style>
.x6-graph-rubberband {
  fill: none; /* 不填充颜色 */
  stroke: red; /* 边框颜色 */
  stroke-width: 2px; /* 边框宽度 */
  stroke-dasharray: 5px 5px; /* 虚线样式 */
  opacity: 0.5; /* 透明度 */
  /* 添加其他样式属性 */
}
.selectbg {
  background: rgba(0, 0, 0, 0.5) !important;
}
.x6-widget-selection-inner {
  box-sizing: content-box !important;
  margin-top: -8px;
  margin-left: -8px;
  padding-right: 12px;
  padding-bottom: 12px;
  border: 2px solid #feb663 !important;
  box-shadow: 2px 2px 5px #d3d3d3;
  /* background:rgba(0, 0, 0,.5) !important; */
  opacity: 0.5;
  z-index: 0;
}
/* .x6-edit-text{
  border:none;
  outline: none;
  pointer-events: none;
  caret-color: transparent;
}
.x6-edit-text::after{
  content: attr(data-text) "|";
  visibility: hidden;
}
.x6-edit-text:focus::after{
  visibility: visible;
} */
.x6-widget-selection {
  border: 1px solid #ff4e50 !important;
}
.my-selecting {
  border: 1px solid green !important;
}
.x6-widget-selection-content {
  border: 1px solid #ff4e50 !important;
  background: #000 !important;
}
.x6-widget-selection-box {
  z-index: 1;
  border: 1px solid green !important;
}
/* .x6-widget-selection-selected {
  border:1px solid green !important;
} */
.x6-widget-snapline-vertical {
  border-right-color: #ff4e50 !important;
}
.x6-widget-snapline-horizontal {
  border-bottom-color: #ff4e50 !important;
}
.x6-widget-selection-box {
  border: 1px dashed #5f95ff;
  margin-top: -3px;
  margin-left: -3px;
}
.x6-widget-selection-inner {
  border: 1px dashed #5f95ff;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: -400;
  }
}
.animate-text1,
.animate-text2,
.animate-text3,
.animate-text4 {
  font-weight: bold;
  fill: none;
  stroke-width: 2px;
  stroke-dasharray: 90 310;
  animation: stroke 3s infinite linear;
}
.animate-text1 {
  stroke: #873bf4;
  text-shadow: 0 0 2px #873bf4;
  animation-delay: -1.5s;
}
.animate-text2 {
  stroke: #ff6e06;
  text-shadow: 0 0 2px #ff6e06;
  animation-delay: -3s;
}
</style>
