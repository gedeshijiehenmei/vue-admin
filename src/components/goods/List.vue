<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="goods.query"
            class="input-with-select"
            clearable
            @clear="getGoodeInfo"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodeInfo"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goClickAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsInfo" style="width: 100%">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="119px"
        >
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="95px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="95px">
        </el-table-column>
        <el-table-column prop="" label="创建时间" width="140px">
            <template slot-scope="slot">
                {{slot.row.add_time|dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" prop="" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
               @click="delGoodsInfo(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goods.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="goods.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goods: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      goodsInfo:[],
      total:0
    };
  },
  crested() {},
  mounted() {
    this.getGoodeInfo();
  },
  methods: {
    async getGoodeInfo() {
      const { data: res } = await this.$http.get("/goods", {
        params: this.goods
      });
      console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.goodsInfo = res.data.goods;
      this.total = res.data.total;
    },
    //删除商品信息
    delGoodsInfo(id){
        console.log(id)
         this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("goods/" + id);
           console.log(res)
          this.getGoodeInfo();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(newSize){
         this.goods.pagesize = newSize;
         this.getGoodeInfo();

    },
    handleCurrentChange(newPage){
        this.goods.pagenum = newPage;
         this.getGoodeInfo();

    },
    goClickAdd(){
        this.$router.push('/good/add')
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table{
    font-size: 12px;
}
</style>
