<template>
  <div style="width: 100%; height: 100%">
    <el-tabs>
      <el-tab-pane label="线条">
        <el-row>
          <el-col :span="8">Line Width</el-col>
          <el-col :span="12">
            <el-slider
              :min="1"
              :max="25"
              :step="1"
              size="mini"
              v-model="strokeWidth"
              @change="onStrokeWidthChange"
            />
          </el-col>
          <el-col :span="2">
            <div class="result">{{ strokeWidth }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">outLine Width</el-col>
          <el-col :span="12">
            <el-slider
              :min="1"
              :max="25"
              :step="1"
              size="mini"
              v-model="outStrokeWidth"
              @change="onOutStrokeWidthChange"
            />
          </el-col>
          <el-col :span="2">
            <div class="result">{{ outStrokeWidth }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">Line Color</el-col>
          <el-col :span="14">
            <el-input
              type="color"
              v-model="stroke"
              size="mini"
              style="width: 100%"
              @change="onStrokeChange"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">outLine Color</el-col>
          <el-col :span="14">
            <el-input
              type="color"
              v-model="outStroke"
              size="mini"
              style="width: 100%"
              @change="onOutStrokeChange"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">Dasharray</el-col>
          <el-col :span="12">
            <el-slider
              :min="0"
              :max="10"
              :step="1"
              size="mini"
              v-model="strokeDasharray"
              @change="onStrokeDasharray"
            />
          </el-col>
          <el-col :span="2">
            <div class="result">{{ strokeDasharray }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">Animation</el-col>
          <el-col :span="12">
            <el-slider
              :min="0"
              :max="50"
              :step="1"
              size="mini"
              v-model="animation"
              @change="onAnimation"
            />
          </el-col>
          <el-col :span="2">
            <div class="result">{{ animation }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">Connector</el-col>
          <el-col :span="14">
            <el-select
              style="width: 100%"
              size="mini"
              v-model="connector"
              @change="onConnectorChange"
            >
              <el-option value="normal">Normal</el-option>
              <el-option value="smooth">Smooth</el-option>
              <el-option value="rounded">Rounded</el-option>
              <el-option value="jumpover">Jumpover</el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">Router</el-col>
          <el-col :span="14">
            <el-select
              style="width: 100%"
              size="mini"
              v-model="edgeRouter"
              @change="onEdgeRouter"
            >
              <el-option value="normal">Normal</el-option>
              <el-option value="orth">Orth</el-option>
              <el-option value="oneSide">OneSide</el-option>
              <el-option value="manhattan">Manhattan</el-option>
              <el-option value="metro">Metro</el-option>
              <el-option value="er">Er</el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row v-show="edgeRouter == 'er'">
          <el-col :span="8">Edge Offset</el-col>
          <el-col :span="12">
            <el-slider
              :min="8"
              :max="64"
              :step="1"
              size="mini"
              v-model="edgeOffset"
            />
          </el-col>
          <el-col :span="2">
            <div class="result">{{ edgeOffset }}</div>
          </el-col>
        </el-row>
        <el-row v-show="edgeRouter == 'er'">
          <el-col :span="8">Edge Direction</el-col>
          <el-col :span="14">
            <el-select style="width: 100%" size="mini" v-model="edgeDirection">
              <el-option value="L">L</el-option>
              <el-option value="R">R</el-option>
              <el-option value="H">H</el-option>
              <el-option value="T">T</el-option>
              <el-option value="B">B</el-option>
              <el-option value="V">V</el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">Node ZIndex</el-col>
          <el-col :span="12">
            <el-slider
              size="mini"
              :min="0"
              :max="100"
              :step="1"
              v-model="ZIndex"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2">
            <div class="result">{{ ZIndex }}</div>
          </el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item title="标签">
            <el-row>
              <el-col :span="8">label</el-col>
              <el-col :span="14">
                <!-- v-model="label" -->
                <el-input
                  v-model="label"
                  size="mini"
                  style="width: 100%"
                  @change="onLabelChange"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">字体大小</el-col>
              <el-col :span="14">
                <el-slider
                  v-model="labelFontsize"
                  size="mini"
                  @change="changelabelFont"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">字体颜色</el-col>
              <el-col :span="14">
                <el-input
                  type="color"
                  @change="changelabelcolor"
                  v-model="labelcolor"
                  size="mini"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">背景颜色</el-col>
              <el-col :span="14">
                <el-input
                  type="color"
                  v-model="labelbroundcolor"
                  size="mini"
                  ref="bgLabel"
                  @change="changelabelbroundcolor"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">边框颜色</el-col>
              <el-col :span="14">
                <el-input
                  type="color"
                  v-model="labelbordercolor"
                  size="mini"
                  @change="changelabelbordercolor"
                />
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="起始箭头">
            <el-row>
              <el-col :span="8">箭头类型</el-col>
              <el-col :span="16">
                <el-select
                  v-model="fillmarkers"
                  @change="onStartMarker"
                  size="mini"
                >
                  <el-option value="">无箭头</el-option>
                  <el-option value="block">实心箭头</el-option>
                  <el-option value="classic">经典箭头</el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">箭头偏移量</el-col>
              <el-col :span="13">
                <el-slider
                  size="mini"
                  :step="1"
                  @input="offsetChange"
                  v-model="offsetX"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">箭头宽度</el-col>
              <el-col :span="13">
                <el-slider
                  size="mini"
                  :step="1"
                  @input="onmarkerWidth"
                  v-model="markerwidth"
                />
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { isArray } from "@antv/x6/lib/util/lang/lang";
import FlowGraph from "../../../graph";
export default {
  name: "index",
  data() {
    return {
      activeNames: "起始箭头",
      curCell: null,
      fillmarkers: "",
      offsetX: 50,
      markerwidth: 50,
      labelFontsize: 16,
      labelcolor: "red",
      labelbroundcolor: "red",
      labelbordercolor: "red",
    };
  },
  computed: {
    strokeWidth: {
      get() {
        return this.$store.state.flow.strokeWidth;
      },
      set(val) {
        this.$store.commit("flow/updatestrokeWidth", val);
      },
    },
    outStrokeWidth: {
      get() {
        return this.$store.state.flow.outStrokeWidth;
      },
      set(val) {
        this.$store.commit("flow/updateoutStrokeWidth", val);
      },
    },
    stroke: {
      get() {
        return this.$store.state.flow.stroke;
      },
      set(val) {
        this.$store.commit("flow/updatestroke", val);
      },
    },
    outStroke: {
      get() {
        return this.$store.state.flow.outStroke;
      },
      set(val) {
        this.$store.commit("flow/updateoutStroke", val);
      },
    },
    strokeDasharray: {
      get() {
        return this.$store.state.flow.strokeDasharray;
      },
      set(val) {
        this.$store.commit("flow/updatestrokeDasharray", val);
      },
    },
    animation: {
      get() {
        return this.$store.state.flow.animation;
      },
      set(val) {
        this.$store.commit("flow/updateanimation", val);
      },
    },
    connector: {
      get() {
        return this.$store.state.flow.connector;
      },
      set(val) {
        this.$store.commit("flow/updateconnector", val);
      },
    },
    edgeRouter: {
      get() {
        return this.$store.state.flow.edgeRouter;
      },
      set(val) {
        this.$store.commit("flow/updateedgeRouter", val);
      },
    },
    edgeOffset: {
      get() {
        return this.$store.state.flow.edgeOffset;
      },
      set(val) {
        this.$store.commit("flow/updateedgeOffset", val);
      },
    },
    edgeDirection: {
      get() {
        return this.$store.state.flow.edgeDirection;
      },
      set(val) {
        this.$store.commit("flow/updateedgeDirection", val);
      },
    },
    ZIndex: {
      get() {
        return this.$store.state.flow.ZIndex;
      },
      set(val) {
        this.$store.commit("flow/updateZIndex", val);
      },
    },
    label: {
      get() {
        console.log(
          "this.$store.state.flow.label: ",
          this.$store.state.flow.label
        );
        return this.$store.state.flow.label;
      },
      set(val) {
        this.$store.commit("flow/updatelabel", val);
      },
    },
    fillMarker: {
      get() {
        return this.$store.state.flow.fillMarker;
      },
      set(val) {
        this.$store.commit("flow/updatemarkert", val);
        console.log(val);
      },
    },
  },
  props: { id: String },
  watch: {
    id: {
      handler() {
        const { graph } = FlowGraph;
        const cell = graph.getCellById(this.id);
        console.log("cell: ", cell);
        if (!cell || !cell.isEdge()) {
          return;
        }
        this.curCell = cell;
        this.ZIndex = cell.getZIndex();
        const connector = cell.getConnector() || {
          name: "normal",
        };
        this.stroke = cell.attr("line/stroke");
        this.strokeWidth = cell.attr("line/strokeWidth");
        this.connector = connector.name;
        // this.label = cell.getLabels()[0]?.attrs?.text?.text || "";
        // console.log("cell.getLabels()[0]?.attrs: ", cell.getLabels()[0]?.attrs);
        // console.log("this.label: ", this.label);
      },
      deep: false,
      immediate: false,
    },
    edgeOffset: {
      handler() {
        this.curCell?.prop("router/args", {
          offset: this.edgeOffset,
          direction: this.edgeDirection,
        });
      },
      immediate: false,
    },
    edgeDirection: {
      handler() {
        this.curCell?.prop("router/args", {
          offset: this.edgeOffset,
          direction: this.edgeDirection,
        });
      },
      immediate: false,
    },
    ZIndex: {
      handler() {
        if (this.curCell) {
          this.curCell?.setZIndex(this.ZIndex);
        }
      },
      immediate: false,
    },
  },
  mounted() {
    let inputBgLabel = this.$refs.bgLabel;
    console.log("inputBgLabel: ", inputBgLabel);
    inputBgLabel.onchange = (e) => {
      console.log("e: ", e);
    };
  },
  methods: {
    // 线边的宽度
    onStrokeWidthChange() {
      this.curCell?.attr("line/strokeWidth", this.strokeWidth);
      console.log(this.curCell, "----->>>");
    },
    // 外线边的宽度
    onOutStrokeWidthChange() {
      this.curCell?.attr("outline/strokeWidth", this.outStrokeWidth);
    },
    // 线边颜色
    onStrokeChange() {
      this.curCell?.attr("line/stroke", this.stroke);
    },
    // 外线边颜色
    onOutStrokeChange() {
      this.curCell?.attr("outline/stroke", this.outStroke);
    },
    // 虚线
    onStrokeDasharray() {
      this.curCell?.attr("line/strokeDasharray", this.strokeDasharray);
    },
    // 动画
    onAnimation() {
      this.curCell?.attr(
        "line/style/animation",
        `ant-line ${this.animation}s infinite linear`
      );
    },
    // 连接方式
    onConnectorChange() {
      this.curCell?.setConnector(this.connector);
    },
    // 路由
    onEdgeRouter() {
      this.curCell?.setRouter({ name: this.edgeRouter });
    },
    onLabelChange() {
      // let labels = this.curCell.labels;
      console.log(" this.curCell.labels: ", this.curCell.labels);
      console.log("this.label: ", this.label);
      let labels;
      if (this.curCell.labels.length > 0) {
        // labels = this.curCell.labels;
        labels = JSON.parse(JSON.stringify(this.curCell.labels));
        labels.forEach((label) => {
          console.log("label: ", label);
          if (label.attrs.text) {
            console.log("label.attrs.label: ", label.attrs.label);

            label.attrs.text.text = this.label;
          } else {
            label.attrs.text = {
              fontSize: 30,
              text: this.label,
            };
          }
          // label.text = this.label;
        });
      } else {
        labels = [
          {
            attrs: {
              text: {
                fontSize: 30,
                text: this.label,
              },
            },
          },
        ];
      }

      console.log("labels: ", labels);

      this.curCell.setLabels(labels);
    },
    onStartMarker(val) {
      this.curCell?.attr("line/sourceMarker", val);
    },
    offsetChange(val) {
      console.log("val: ", val);
      this.curCell?.setZIndex(10);
      let sourceMarker = this.curCell?.attr().line.sourceMarker;
      if (!sourceMarker) return;
      console.log("sourceMarker: ", sourceMarker);
      sourceMarker = JSON.parse(JSON.stringify(sourceMarker)) || sourceMarker;
      sourceMarker.offset = val;
      this.curCell?.attr("line/sourceMarker", sourceMarker);
    },
    onmarkerWidth(val) {
      if (val > 0) {
        let sourceMarker = this.curCell?.attr().line.sourceMarker;
        if (!sourceMarker) return;

        sourceMarker = JSON.parse(JSON.stringify(sourceMarker));
        sourceMarker.width = val;
        this.curCell?.attr("line/sourceMarker", sourceMarker);
      }
    },
    changelabelFont(val) {
      if (val > 0) {
        // let labelwidth = this.curCell?.attr().line.style;
        // labelwidth = JSON.parse(JSON.stringify(labelwidth));
        // labelwidth.fontSize = val;
        let labels;
        if (this.curCell.labels.length > 0) {
          labels = JSON.parse(JSON.stringify(this.curCell.labels));
          labels.forEach((label) => {
            console.log("label: ", label);
            if (label.attrs.text) {
              console.log("label.attrs.label: ", label.attrs.label);
              label.attrs.text.fontSize = val;
            } else {
              label.attrs.text = {
                fontSize: val,
                text: this.label,
              };
            }
            // label.text = this.label;
          });
        } else {
          labels = [
            {
              attrs: {
                text: {
                  fontSize: val,
                  text: this.label,
                },
              },
            },
          ];
        }

        console.log("labels:FFF ", labels);
        this.curCell.setLabels(labels);
        // this.curCell?.attr("text/style", labelwidth);
      }
    },
    changelabelcolor(val) {
      let labelcolor = this.curCell?.attr().line.style;
      labelcolor = JSON.parse(JSON.stringify(labelcolor));
      console.log("labelcolor: ", labelcolor);
      labelcolor.fill = val;
      this.curCell?.attr("text/style", labelcolor);
    },
    changelabelbroundcolor(val) {
      let labels;
      if (this.curCell.labels.length > 0) {
        // labels = this.curCell.labels;
        labels = JSON.parse(JSON.stringify(this.curCell.labels));
        labels.forEach((label) => {
          console.log("label: ", label);
          if (label.attrs.rect) {
            console.log("label.attrs.label: ", label.attrs.label);
            label.attrs.rect.fill = val;
          } else {
            label.attrs.rect = {
              fill: val,
            };
          }
          // label.text = this.label;
        });
      } else {
        labels = [
          {
            attrs: {
              text: {
                fontSize: 15,
                text: this.label,
              },
              rect: {
                fill: val,
              },
            },
          },
        ];
      }

      // labelsA[0].attrs.
      this.curCell.setLabels(labels);
      console.log(this.curCell, "----->>>");
    },
    changelabelbordercolor(val) {
         // let labels = this.curCell.labels;
      console.log(" this.curCell.labels: ", this.curCell.labels);
      console.log("this.label: ", this.label);
      let labels;
      if (this.curCell.labels.length > 0) {
        // labels = this.curCell.labels;
        labels = JSON.parse(JSON.stringify(this.curCell.labels));
        labels.forEach((label) => {
          console.log("label: ", label);
          if (label.attrs.rect) {
            console.log("label.attrs.label: ", label.attrs.label);

            label.attrs.rect.stroke = val;
          } else {
            label.attrs.rect = {
              stroke: val,
            };
          }
          // label.text = this.label;
        });
      } else {
        labels = [
          {
            attrs: {
              rect: {
                stroke: val,
              },
            },
          },
        ];
      }

      console.log("labels: ", labels);

      this.curCell.setLabels(labels);
    },
  },
};
</script>
<style scoped>
.el-row {
  margin-bottom: 5px;
}
</style>

