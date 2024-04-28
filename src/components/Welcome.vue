<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>
      Fill out user information first, or upload user file to begin
    </h3>
    <div>
      <p>target date must be filled before medication for targets</p>
      <p>re-save medication to reload targets</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h3, p, ul, li {
  color: #d2d2d2;
}
h3 {
  margin: 40px 0 0;
}
p {
  margin: 0;
}
a {
  color: #42b983;
}
</style>
