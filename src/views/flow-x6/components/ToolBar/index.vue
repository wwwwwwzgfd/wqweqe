<template>
  <div class="bar">
    <el-tooltip class="item" effect="dark" content="清除 (Cmd + D)" placement="bottom">
      <el-button name="delete" @click="handleClick" class="item-space" size="small" >
        删除
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="清除选中元素 (Del)" placement="bottom">
      <el-button name="checked" @click="handleClick" class="item-space" size="small" >
        删除选中
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="撤销 (Cmd + Z)" placement="bottom">
      <el-button :disabled="!canUndo" name="undo" @click="handleClick" class="item-space" size="small" >
        undo
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="Redo (Cmd + Shift + Z)" placement="bottom">
      <el-button :disabled="!canRedo" name="redo" @click="handleClick" class="item-space" size="small" >
        redo
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="复制 (Cmd + Shift + Z)" placement="bottom">
      <el-button name="copy" @click="handleClick" class="item-space" size="small" >
        copy
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="剪切 (Cmd + X)" placement="bottom">
      <el-button name="cut" @click="handleClick" class="item-space" size="small" >
        cut
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="粘贴 (Cmd + V)" placement="bottom">
      <el-button name="paste" @click="handleClick" class="item-space" size="small" >
        paste
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="保存PNG (Cmd + S)" placement="bottom">
      <el-button name="savePNG" @click="handleClick" class="item-space" size="small">
        savePNG
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="保存SVG (Cmd + S)" placement="bottom">
      <el-button name="saveSVG" @click="handleClick" class="item-space" size="small">
        saveSVG
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="打印 (Cmd + P)" placement="bottom">
      <el-button name="print" @click="handleClick" class="item-space" size="small">
        print
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="导出 (Cmd + P)" placement="bottom">
      <el-button name="toJSON" @click="handleClick" class="item-space" size="small">
        toJSON
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="导出 (Cmd + P)" placement="bottom">
      <el-button name="toJSON" @click="add" class="item-space" size="small">
        放大
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="导出 (Cmd + P)" placement="bottom">
      <el-button name="toJSON" @click="addcount" class="item-space" size="small">
        缩小
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="导出 (Cmd + P)" placement="bottom">
      <el-button name="toJSON" @click="groups" class="item-space" size="small">
        群组
      </el-button>
    </el-tooltip>
  </div>
</template>
<script>
import FlowGraph from '../../graph'
import { DataUri } from '@antv/x6'
export default {
  data() {
    return {
      canUndo: null,
      canRedo: null,
      graph:''
    }
  },
  created() {
    this.myInit()
  },
  methods: {
    myInit() {
      this.graph = FlowGraph.graph
      const { history } = this.graph
      this.canUndo = history.canUndo()
      this.canRedo = history.canRedo()
      history.on('change', () => {
      this.canUndo = history.canUndo()
      this.canRedo = history.canRedo()
     
    })
    this.graph.bindKey('ctrl+z', () => {
      if (history.canUndo()) {
        history.undo()
      }
      return false
    })
    this.graph.bindKey('ctrl+shift+z', () => {
      if (history.canRedo()) {
        history.redo()
      }
      return false
    })
    this.graph.bindKey('ctrl+d', () => {
      this.graph.clearCells()
      return false
    })
    this.graph.bindKey('ctrl+s', () => {
      this.graph.toPNG((datauri) => {
        DataUri.downloadDataUri(datauri, 'chart.png')
      })
      return false
    })
    this.graph.bindKey('ctrl+p', () => {
      this.graph.printPreview()
      return false
    })
    this.graph.bindKey('ctrl+c', this.copy)
    this.graph.bindKey('ctrl+v', this.paste)
    this.graph.bindKey('ctrl+x', this.cut)
    },
    copy() {
      const { graph } = FlowGraph
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    },

    cut () {
      const { graph } = FlowGraph
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    },

    paste () {
      const { graph } = FlowGraph
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    },
  add(){
    this.graph.zoom(0.2)
  },     
  addcount(){
       this.graph.zoom(-0.2)
  },
  groups(){
    document.querySelector('.x6-widget-selection-inner').classList.remove('selectbg')
    document.querySelector('.x6-widget-selection-inner').classList.add('selectbg')
    
    console.log(document.querySelector('.x6-widget-selection-inner').classList.keys())
  },
    handleClick(event) {
      const { graph } = FlowGraph
      const name = (event.currentTarget).name
      switch (name) {
        case 'undo':
          graph.history.undo()
          break
        case 'redo':
          graph.history.redo()
          break
        case 'delete':
          graph.clearCells()
          break
        case 'checked':
        const cells = graph.getSelectedCells()
          if (cells.length) {
            graph.removeCells(cells)
          }
          break
        case 'savePNG':
          graph.toPNG((dataUri) => {
            // 下载
            DataUri.downloadDataUri(dataUri, 'chartx.png')
          }, {
            backgroundColor:'white',
            padding: {
              top: 20,
              right: 30,
              bottom: 40,
              left: 50,
            },
            quality:1
          })
          break
        case 'saveSVG':
          graph.toSVG((dataUri) => {
            // 下载
            DataUri.downloadDataUri(DataUri.svgToDataUrl(dataUri), 'chart.svg')
          })
          break
        case 'print':
          graph.printPreview()
          break
        case 'copy':
          this.copy()
          break
        case 'cut':
          this.cut()
          break
        case 'paste':
          this.paste()
          break
        case 'toJSON':
          console.log(graph.toJSON())
          window.localStorage.setItem('graphJson', JSON.stringify(graph.toJSON()))
          // graph.fromJSON({cells:[graph.toJSON().cells[0],graph.toJSON().cells[1]]})
          break
        default:
          break
      }
      
    }
  }
}
</script>
<style scoped>
.bar{
  width: 100%;
  z-index: 99999;
  margin-right:16px;
}
.item-space{
  margin-left:16px;
}
</style>
