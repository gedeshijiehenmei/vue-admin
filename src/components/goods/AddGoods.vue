<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 信息提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="activeIndex - 0"
        finish-status="success"
        align-center
        :space="200"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight ">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品照片" name="3"
            ><el-upload
              :action="activeUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handelSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload></el-tab-pane
          >
          <el-tab-pane label="商品内容" name="4"
            ><quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="add-btn" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览 -->
      <el-dialog
        title="图片预览"
        :visible.sync="previewDialogVisible"
        width="50%"
      >
        <img :src="previewPath" alt="" class="previewImg" />
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      catelist: [],
      manyTableData: [],
      onlyTableData: [],
      previewPath: "",
      previewDialogVisible: false,
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      activeUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      headerObj: { Authorization: window.sessionStorage.getItem("token") },
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      }
    };
  },
  crested() {},
  mounted() {
    this.getcategories();
  },
  methods: {
    async getcategories() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.catelist = res.data;
      console.log(this.catelist);
    },
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    async tabClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        console.log(res.data);
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewDialogVisible = true;
    },
    //处理图片移除的操作
    handleRemove(file) {
      console.log(file);
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex(x => {
        x.pic === filePath;
      });
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    //监听图片上传成功的事件
    handelSuccess(response) {
      console.log(response)
      //拼接得到一图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //将图片信息push到pics数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    //添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请把必填项填写完整");
        }
        const from = _.cloneDeep(this.addForm);
        from.goods_cat = from.goods_cat.join(",");
        console.log(from);
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            att_value: item.attr_vals.join(" ")
          };
          this.addForm.attrs.push(newInfo);
        });
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            att_value: item.attr_vals
          };
          this.addForm.attrs.push(newInfo);
        });
        from.attrs = this.addForm.attrs;
        console.log(from);
        //发起请求添加商品
        const { data: res } = await this.$http.post("goods", from).catch((err) => {console.log(err)});
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.$router.push("/goods");
      });
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 15px 0 0;
}
.previewImg {
  width: 100%;
}
.add-btn {
  margin-top: 15px;
}
</style>
