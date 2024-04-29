<template>
  <div class='row'>
    <div class="mb-4 row text-start">
      <label for="medicine_name" class="form-label text-light">Name:</label>
      <input class="form-control al_left" type="text" v-model="form_name"  @input="event => text = event.target.value" />
		 </div>
    <div class="mb-4 row text-start">
      <label for="target_label" class="form-label text-light">Target Date:</label>
      <input type="date" id="target_date" v-model='formatted_td'>
      <label v-if="num_target_days > 0" class="form-field-label" for="target_label">
        {{ num_target_days }} days
      </label>
		 </div>
      <div class="mb-4 row text-start">
			  <label for="start_label" class="form-label text-light">Start Date:</label>
        <input type="date" id="start_date" v-model='formatted_sd'>
        <label v-if="days_on_meds > 0" class="form-field-label" for="start_label">
					{{ days_on_meds }} days
				</label>
			</div>
      <div>
        <button class='btn btn-dark' @click='form_submit'>Save</button>
      </div>
  </div>
</template>

<script setup>
const props = defineProps({
  updateUserInfo: {
    type: Function
  }
})
import { $medicine_list, $name, $target_date, $target_days, $start_date, $days_on } from '../store.js'
import { ref } from "vue";
const medList = $medicine_list.value;
const name = ref($name.value);
const target_date = ref($target_date.value);
const target_days = ref($target_days.value);
const start_date = ref($start_date.value);
const on_days = ref($days_on.value);

let picker_format = (value) => {
  let month = value.split('/')[0];
  let day = value.split('/')[1];
  let year = value.split('/')[2];
  return `${year}-${month}-${day}`;
}

let date_format = (value) => {
  let year = value.split('-')[0];
  let month = value.split('-')[1];
  let day = value.split('-')[2];
  return `${month}/${day}/${year}`;
}

let time_between_dates = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return parseFloat(diffDays);
}

let entry_verification = (value) => {
  if(value !='' && value != null && value != undefined){
    if (typeof value === 'string' && value.trim().length > 0) {
    return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

let formatted_td;
if(entry_verification($target_date.value)){
  formatted_td = picker_format($target_date.value);
}

let formatted_sd;
if(entry_verification($start_date.value)){
  formatted_sd = picker_format($start_date.value);
}

let form_name;

if(entry_verification($name.value)){
  form_name = $name.value;
} else {
  form_name = '';
}

let form_target_date;
let form_start_date;

if(entry_verification(formatted_td)){
  let date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1);
  let day = date.getDate();
  let today = `${month}/${day}/${year}`
  let td = time_between_dates(new Date(today), new Date(target_date.value));
  $target_days.set(td);
}

if(entry_verification(formatted_sd)){
  let date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1);
  let day = date.getDate();
  let today = `${month}/${day}/${year}`;
  let ts = time_between_dates(new Date(start_date.value), new Date(today));
  ts = ts + 1;
  $days_on.set(ts);
}

let days_on_meds = $days_on.value;
let num_target_days = $target_days.value;

let form_submit = () => {

  if(entry_verification(form_name)){
    let name = form_name.trim();
    $name.set(name);
  }

  if(entry_verification(formatted_td)){
    let reformatted_td = date_format(formatted_td);
    $target_date.set(reformatted_td);
  }

  if(entry_verification(formatted_sd)){
    let reformatted_sd = date_format(formatted_sd);
    $start_date.set(reformatted_sd);
  }

  props.updateUserInfo();
}

</script>

<style scoped>
.form-field-label {
  color: #ffffff;
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