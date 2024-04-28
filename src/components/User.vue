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
import { $medicine_list, $admin } from '../store.js'
import { ref } from "vue";
const medList = $medicine_list.value;
const name = ref($admin.value.name);
const target_date = ref($admin.value.target_date);
const target_days = ref($admin.value.target_days);
const start_date = ref($admin.value.start_date);
const on_days = ref($admin.value.on_days);

let picker_format = (value) => {
  let month = value.split('/')[0];
  let day = value.split('/')[1];
  let year = value.split('/')[2];
  return `${year}-${month}-${day}`;
}

let date_format = (value) => {
  console.log(value)
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
if($admin.value.target_date != null || $admin.value.target_date != undefined){
  formatted_td = picker_format($admin.value.target_date);
}

let formatted_sd;
if($admin.value.start_date != null || $admin.value.start_date != undefined){
  formatted_sd = picker_format($admin.value.start_date);
}

let form_name;

if(entry_verification($admin.value.name)){
  form_name = $admin.value.name;
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
  $admin.set({target_days: td, ...$admin.value});
}

if(entry_verification(formatted_sd)){
  let date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1);
  let day = date.getDate();
  let today = `${month}/${day}/${year}`;
  let ts = time_between_dates(new Date(start_date.value), new Date(today));
  ts = ts + 1;
  $admin.set({on_days: ts, ...$admin.value});
}

let days_on_meds = $admin.value.on_days;
let num_target_days = $admin.value.target_days;

let form_submit = () => {
  let name = form_name.trim();
  if(entry_verification(name) && entry_verification(formatted_sd) && entry_verification(formatted_td)){
    let reformatted_td = date_format(formatted_td);
    console.log(reformatted_td)
    let reformatted_sd = date_format(formatted_sd);
    $admin.set({target_date: reformatted_td, start_date: reformatted_sd, name: name, ...$admin.value});
  } else {
    console.log('Invalid data');
  }
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