<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/form">Form</router-link> |
    <router-link to="/table">Table</router-link> |
    <router-link to="/user">User</router-link>
  </nav>
  <router-view/>
</template>

<style>
body {
  background-color: #483e5a;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #6283a4;
}

nav a.router-link-exact-active {
  color: #42b983;
}

@import'~bootstrap/dist/css/bootstrap.css'
</style>
