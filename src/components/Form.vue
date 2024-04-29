<template>
  <div id='row'>
    <div>
      <div class="mb-4">
				<label for="medicine_name" class="form-label text-light">Medicine Name:</label>
				<input class="form-control al_left" type="text" v-model="form_name"  @input="event => text = event.target.value" placeholder="Estradiol Valerate" />
		 </div>
      <div class="mb-4">
			<label for="medicine_frequency" class="form-label text-light">Medicine Frequency:</label>
				<input class="form-control" v-model="form_frequency" type="text" placeholder="3" />
				<label class="form-text text-light" for="input2">
					How many times a day?
				</label>
		 </div>
      <div class="mb-4">
			 <label for="medicine_dose" class="form-label text-light">Medicine Dose:</label>
				 <input class="form-control" v-model="form_dose" type="text" placeholder="1" />
				 <label class="form-text text-light" for="input2">
						How many pills per dose? (.25 for a quarter pill per dose)
				 </label>
			</div>
      <div class="mb-4">
				<label for="medicine_dose" class="form-label text-light">Pills Per Blister</label>
					<input class="form-control" v-model="form_ppb" type="text" placeholder="28" />
					<label class="form-text text-light" for="input2">
						 How many pills come per blister?
					</label>
			 </div>
			<button class='btn btn-dark' @click='form_submit'>Add</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  updateList: {
    type: Function
  },
  updateForm: {
    type: Function
  }
})
import { $medicine_list, $target_date } from '../store.js'
const medList = $medicine_list.value;
const target_date = $target_date.value;

let medicine_name;
let medicine_frequency;
let medicine_dose;
let pills_per_blister;

let form_name = ref("");
let form_frequency = ref("");
let form_dose = ref("");
let form_ppb = ref("");

let form_value_verification = (value) => {
  if(value != '' && value != null && value != undefined){
    if (typeof value === 'string' && value.trim().length > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

let form_submit = () => {
  if(form_value_verification(form_name.value) && form_value_verification(form_frequency.value) && form_value_verification(form_dose.value) && form_value_verification(form_ppb.value)){


    medicine_name = form_name.value.trim();
    medicine_frequency = parseFloat(form_frequency.value.trim());
    medicine_dose = parseFloat(form_dose.value.trim());
    pills_per_blister = parseFloat(form_ppb.value.trim());

    if (medList.some(item => item.name === medicine_name)) {
      update();
    } else {
      add();
    }
    form_name = '';
    form_frequency = '';
    form_dose = '';
    form_ppb = '';
    props.updateForm();
    props.updateList();
  } else {
    console.log('Invalid form data');
  }
}


let update = (medicine_name) => {
  let index = medList.findIndex(item => item.name === medicine_name);
  if (index !== -1) {
    medicine_list[index] = {
    name: medicine_name,
    frequency: medicine_frequency,
    dose: medicine_dose,
    ppb: pills_per_blister
    };
  }
}

let add = () => {
  const date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1);
  let day = date.getDate();
  let todays_date = `${month}/${day}/${year}`;

  let newArray = [...medList];

  newArray.push({
    name: medicine_name,
    frequency: medicine_frequency,
    dose: medicine_dose,
    ppb: pills_per_blister,
    blister_number: 0,
    loose_number: 0,
    pillbox_number: 0,
    total_pills: 0,
    total_days: 0,
    needed_for_target: 0,
    need_pills: 0,
    need_blisters: 0,
    will_run_out: todays_date,

  });

  $medicine_list.set(newArray);
}

</script>

<style scoped>
.al_left {
  text-align: left;
}
input {
  text-align: center;
  background-color: #262626;
  border: 1px solid #272727;
  border-color: #000000;
  color: rgb(255, 255, 255);
}

::placeholder {
  color: rgb(127, 127, 127);
  opacity: 1; /* Firefox */
}
</style>