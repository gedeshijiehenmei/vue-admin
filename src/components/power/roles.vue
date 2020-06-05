<template>
  <div id="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              :class="['tbbottom', index === 0 ? 'tbtop' : '', 'vcenter']"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightsByid(scope.row, item1.id)"
                  >{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'tbtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsByid(scope.row, item2.id)"
                      >{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightsByid(scope.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="assignPermissionsBtn(scope.row)"
              >分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="提示" :visible.sync="rolesDialogVisible"  width="50%" @close="setRightsDialogVisibleClosed">
      <el-tree
        :data="roleList"
        :props="rolestProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "rights",
  data() {
    return {
      roleList: [],
      rolesDialogVisible: false,
      roleList: [],
      rolestProps: {
        children: "children",
        label: "authName"
      },
      defKeys: [],
      roleId:''
    };
  },
  crested() {},
  mounted() {
    this.geRrights();
  },
  methods: {
    async geRrights() {
      const { data: res } = await this.$http.get("roles");
      console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.roleList = res.data;
    },
    removeRightsByid(role, rightid) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightid}`
          );
          role.children = res.data;
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
    async assignPermissionsBtn(role) {
      this.roleId=role.id
      const { data: res } = await this.$http.get("rights/tree");

      this.roleList = res.data;
      console.log(this.roleList);
      //递归获取三级节点的id
      console.log(this.defKeys)
      console.log(role)
      this.getleafKeys(role, this.defKeys);
      this.rolesDialogVisible = true;
    },
    //通过递归函数的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getleafKeys(node, arr) {
      //如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getleafKeys(item, arr);
      });
    },
    //监听关闭对话框
    setRightsDialogVisibleClosed(){
      this.defKeys=[]
    },
    async allotRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr= keys.join(',')
      console.log(idStr)
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{
        rids :idStr
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.geRrights()
        this.rolesDialogVisible=false
    }
  }
};
</script>
<style lang="scss" scoped>
.el-col {
  margin: 7px 0;
}
.tbtop {
  border-top: 1px solid #eeeeee;
}
.tbbottom {
  border-bottom: 1px solid #eeeeee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
