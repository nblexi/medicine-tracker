<template>
  <div class='mx-auto w-50 container'>
    <User :key="userInfoKey" :updateUserInfo='forceRerender'/>
    <Files :updateUserInfo='forceRerender'/>
  </div>
</template>

<script>
import User from '@/components/User.vue'
import Files from '@/components/Files.vue'

export default {
  name: 'UserView',
  components: {
    User,
    Files
  },
  data() {
    return {
      userInfoKey: 0,
    };
  },
  methods: {
    forceRerender() {
      this.userInfoKey += 1;
    }
  }

}
</script>
