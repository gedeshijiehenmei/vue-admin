<template>
  <el-container class="home-box">
    <el-header
      ><div><img src="../assets/logo.png" /><span>悦游旅游管理系统</span></div>
      <el-button type="primary" @click="loginout">退出</el-button></el-header
    >
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="collapse-btn" @click="collapseBtn">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="white"
          active-text-color="#ffd04b"
          unique-opened
          :collapse-transition="false"
          :collapse="iscollapse"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{ item.authName }}</span>
            </template>
              <el-menu-item
                v-for="item2 in item.children"
                :key="item2.id"
                  :index="'/' + item2.path+''"
                @click="saveactivePath('/' + item2.path)"
                ><i class="el-icon-menu"></i>{{ item2.authName }}</el-menu-item
              >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      iscollapse: false,
      menuList: [],
      activePath: ""
    };
  },
  created() {
    this.getMenus();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    collapseBtn() {
      this.iscollapse = !this.iscollapse;
    },
    async getMenus() {
      const { data: res } = await this.$http.get("/menus");
      if (res.meta.status != 200) return res.meta.msg;
      this.menuList = res.data;
      console.log(this.menuList);
    },
    //菜单点击高亮
    saveactivePath(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>
<style lang="scss" scoped>
.home-box {
  height: 100vh;
}
.el-header {
  background-color: #545c64;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      color: white;
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #545c64;
  height: 100%;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #cccccc;
}
.collapse-btn {
  color: white;
  font-size: 18px;
  letter-spacing: 0.2em;
  text-align: center;
  cursor: pointer;
}
</style>
