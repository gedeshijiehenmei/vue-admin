<template>
  <div id="userInfo">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8"
            ><el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="users.query"
              clearable
              @clear="getUserInfo"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserInfo"
              ></el-button> </el-input
          ></el-col>
          <el-col :span="4"
            ><el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="userInfo" border style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch
                @change="userchangestate(scope.row)"
                active-color="#13ce66"
                v-model="scope.row.mg_state"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditVisible(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUserInfo(scope.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配权限"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="userInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>
    <!-- 添加用户模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <p>当前用户:{{ roleInfo.username }}</p>
      <p>当前角色:{{ roleInfo.role_name }}</p>
      <p>
        分配新角色：<el-select v-model="setRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userInfo",
  data() {
    var checkemail = (rule, value, callback) => {
      const regemail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regemail.test(value)) {
        return callback();
      }
      return callback(new Error("请输入合法的邮箱"));
    };
    var checkmobile = (rule, value, callback) => {
      const regmobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (regmobile.test(value)) {
        return callback();
      }
      return callback(new Error("请输入合法的手机号"));
    };
    return {
      users: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userInfo: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" }
        ]
      },
      roleInfo: {},
      //隐藏分配权限模态框
      setRoleDialogVisible: false,
      // 所有角色分配的数据列表
      roleList: [],
      setRoleId: ""
    };
  },
  crested() {},
  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const { data: res } = await this.$http.get("/users", {
        params: this.users
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userInfo = res.data.users;
      this.total = res.data.total;
      console.log(this.userInfo);
    },
    handleSizeChange(newSize) {
      this.users.pagesize = newSize;
      this.getUserInfo();
      console.log(newSize);
    },
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.users.pagenum = newPage;
      this.getUserInfo();
    },
    async userchangestate(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error(res.meta.msg);
      }
      this.$message({
        message: res.meta.msg,
        type: "success"
      });
      console.log(res);
    },
    //监听对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //点击添加按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post("users", this.addForm);
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          this.addDialogVisible = false;
          this.getUserInfo();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async showEditVisible(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        console.log(res);
        this.$message.success(res.meta.msg);
        this.editDialogVisible = false;
        this.getUserInfo();
      });
    },
    //删除
    delUserInfo(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("users/" + id);
          this.getUserInfo();
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
    //分配权限
    async setRole(roleInfo) {
      this.roleInfo = roleInfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.roleList = res.data;
      this.setRoleDialogVisible = true;
    },
    //更新分配角色
  async saveRoleInfo() {
    if (!this.setRoleId) {
      return this.$message.error("请选择要分配的角色");
    }
   const {data:res}=await this.$http.put(`users/${this.roleInfo.id}/role`, {
      rid: this.setRoleId
    });
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    this.$message.success(res.meta.msg);
    this.getUserInfo();
    this.setRoleDialogVisible = false;
  },
  setRoleDialogClosed(){
    this.setRoleId='';
    this.roleInfo={}
  }
  },
  
};
</script>
<style lang="scss" scoped></style>
