<template>
  <div id="app">
    <!-- <login></login> -->
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>
<script>
// import login from "./components/login";
export default {
  name: "app",
  components: {
   // login
  }
};
</script>

<style lang="scss">
#app{
  height: 100%;
}
</style>
