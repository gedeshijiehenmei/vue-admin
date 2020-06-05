<template>
  <div id="login" class="login">
    <div class="login-box">
      <div class="img-box">
        <img src="../assets/logo.png" />
      </div>
      <el-form
        label-width="0px"
        :model="loginFrom"
        class="login_from"
        :rules="loginFromRules"
        ref="loginFromRef"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginFrom.username"
            prefix-icon="el-icon-s-check"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-s-check"
            v-model="loginFrom.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      loginFrom: {
        username: "admin",
        password: "123456"
      },
      loginFromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 11, message: "长度在 5到 11个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 5到 10个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //登录
    login() {
      this.$refs.loginFromRef.validate(async valid => {
        console.log(valid);
        if (!valid) return;
        // let data = {
        //   username: this.loginFrom.username,
        //   password: this.loginFrom.password
        // };

       const {data:res} = await this.$http.post('login',this.loginFrom)
       console.log(res)        
      
            if (res.meta.status == 200) {
              this.$message({
                message: res.meta.msg,
                type: "success"
              });
              window.sessionStorage.setItem('token',res.data.token);
              this.$router.push("/home")
            } else {
              this.$message.error(res.meta.msg);
            }
          })
              },
    //重置表单
    resetLoginFrom() {
      this.$refs.loginFromRef.resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.login{
  background-color: aqua;
  height: 100vh;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .img-box {
    border-radius: 50%;
    background-color: white;
    width: 130px;
    height: 130px;
    position: absolute;
    border: 1px solid #eeeeee;
    box-shadow: 0 0 10px #dddddd;
    padding: 10px;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      background-color: #eeeeee;
    }
  }
}
.login_from {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
