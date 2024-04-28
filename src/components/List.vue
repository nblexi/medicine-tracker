<template>
  <div class='mb-5 text-start'>
    <h3 class='text-start mb-3'>Medicine List:</h3>
      <div v-for="medicine in medList" class='mb-4'>
        <h5 class='text-lg-start'>{{medicine.name}}</h5>
        <span>Taken {{medicine.frequency}} {{frequency_label(medicine.frequency)}} a day, </span>
        <span>{{medicine.dose}} {{dose_label(medicine.dose)}} per dose, </span>
        <span>{{medicine.ppb}} {{dose_label(medicine.ppb)}} per blister</span>
				<span class='me-2' @click='remove(medicine.name)'><br><i class="bi bi-archive"></i></span>
      </div>
  </div>
</template>

<script setup>
import { $medicine_list } from '../store.js'
let medList = $medicine_list.value;
const props = defineProps({
  updateList: {
    type: Function
  }
})

let frequency_label = (freq) => {
	if (freq == 1) {
		return "time";
	} else {
		return "times";
	}
}

let remove = (name) => {
	console.log('remove')
	console.log(name)
  let index = medList.findIndex(item => item.name === name);
  if (index !== -1) {
  	medList.splice(index, 1);
		$medicine_list.set(medList);
		console.log($medicine_list.value)
		props.updateList();
  }
}

let dose_label = (dose) => {
	if (dose == 1) {
		return "pill";
	} else if (dose < 1) {
		return "of a pill";
	} else {
		return "pills";
	}
}
</script>

<style scoped>
h3, h5, span {
  color: rgb(209, 209, 209);
}
.me-2 {
	cursor: pointer;
}

@import'~bootstrap-icons/font/bootstrap-icons.css'
</style>