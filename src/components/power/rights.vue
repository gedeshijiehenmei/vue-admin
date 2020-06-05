<template>
  <div id="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsList" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限姓名"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="info" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "rights",
  data() {
    return {
      rightsList: []
    };
  },
  crested() {},
  mounted() {
    this.geRrights();
  },
  methods: {
    async geRrights() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.rightsList = res.data;
    }
  }
};
</script>
<style lang="scss" scoped></style>
