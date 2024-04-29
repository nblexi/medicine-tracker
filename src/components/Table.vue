<template>
  <div>
    <table class='w-100'>
      <tr>
        <th class='pt-2 px-2'>name</th>
        <th class='pt-2 px-2'>pills/blister</th>
        <th class='pt-2 px-2'># blisters</th>
        <th class='pt-2 px-2'># loose pills</th>
        <th class='pt-2 px-2'># doses in pillbox</th>
        <th class='pt-2 px-2'>total pills</th>
        <th class='pt-2 px-2'>total days</th>
        <th class='pt-2 px-2'>pills needed to reach target</th>
        <th class='pt-2 px-2'>pills to get</th>
        <th class='pt-2 px-2'>blisters to get</th>
        <th class='pt-2 px-2'>will run out</th>
      </tr>
      <tr v-for="medicine in medList" >
        <td class='pt-2 px-2'>{{ medicine.name }}</td>
        <td class='pt-2 px-2'>{{ medicine.ppb }}</td>
        <td class='pt-2 px-2'><input class="form-control custom" name="blister" :value='medicine.blister_number'/></td>
        <td class='pt-2 px-2'><input class="form-control custom" name="loose" :value='medicine.loose_number'/></td>
        <td class='pt-2 px-2'><input class="form-control wider_custom" name="pillbox" :value='medicine.pillbox_number'/></td>
        <td class='pt-2 px-2'>{{ truncateToDecimals(parseFloat(medicine.total_pills))}}</td>
        <td class='pt-2 px-2'>{{ truncateToDecimals(parseFloat(medicine.total_days)) }}</td>
        <td class='pt-2 px-2'>{{ Math.ceil(parseFloat(medicine.needed_for_target)) }}</td>
        <td class='pt-2 px-2'>{{ truncateToDecimals(Math.ceil(parseFloat(medicine.need_pills))) }}</td>
        <td class='pt-2 px-2'>{{ Math.ceil(parseFloat(medicine.need_blisters)) }}</td>
        <td class='pt-2 px-2'>{{ prettyPrintDate(medicine.will_run_out) }}</td>
        <td class='save' :id='medicine.name' @click='save_medicine(medicine.name)'><i class="bi bi-floppy2"></i></td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { $medicine_list, $target_date, $target_days } from '../store.js'
const medList = $medicine_list.value;
const target_date = $target_date.value;
const target_days = $target_days.value;

const props = defineProps({
  updateTable: {
    type: Function
  }
})

let prettyPrintDate = (date) => {
  if(date === '') return '';

  let month = date.split('/')[0];
  let day = date.split('/')[1];
  let year = date.split('/')[2];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let monthName = months[month - 1];

  return `${monthName} ${day}, ${year}`;
}

function truncateToDecimals(num, dec = 2) {
  const calcDec = Math.pow(10, dec);
  return Math.trunc(parseFloat(num) * calcDec) / calcDec;
}

let time_between_dates = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return parseFloat(diffDays);
}

let save_medicine = (name) => {
  let index = medList.findIndex(item => item.name === name);
  if (index !== -1) {
    let blister_number = parseFloat(document.getElementsByName('blister')[index].value);
    let loose_number = parseFloat(document.getElementsByName('loose')[index].value);
    let pillbox_number = parseFloat(document.getElementsByName('pillbox')[index].value);

    let ppb = parseFloat(medList[index].ppb);
    let dose = parseFloat(medList[index].dose);
    let frequency = parseFloat(medList[index].frequency);


    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1);
    let day = date.getDate();
    let today = `${month}/${day}/${year}`

    let td = time_between_dates(new Date(today), new Date(target_date));
    $target_date.set(target_days);

    let total_pills = ((blister_number * ppb) + loose_number + (pillbox_number * dose));
    let total_days = parseFloat(total_pills / (frequency * dose));
    let needed_for_target = Math.ceil(target_days * (dose * frequency));
    let need_pills = Math.ceil(needed_for_target - total_pills);
    let need_blisters = Math.ceil(need_pills / ppb);

    if(isNaN(needed_for_target) || needed_for_target == 0) {
      needed_for_target = 0;
      need_pills = 0;
      need_blisters = 0;
    }

    date.setDate(date.getDate() + total_days);

    let will_run_out = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    let tempArray = [...medList];

    tempArray[index] = {
      name: name,
      frequency: medList[index].frequency,
      dose: medList[index].dose,
      ppb: medList[index].ppb,
      blister_number: blister_number,
      loose_number: loose_number,
      pillbox_number: pillbox_number,
      total_pills: total_pills,
      total_days: total_days,
      needed_for_target: needed_for_target,
      need_pills: need_pills,
      need_blisters: need_blisters,
      will_run_out: will_run_out,
    };
    $medicine_list.set(tempArray);

    props.updateTable();
  }
}

</script>

<style scoped>
table {
  color: rgb(209, 209, 209);
  border:1px solid black;
  width: 100%;
}
th {
  border:1px solid black;
}
td {
  border:1px solid black;
}
input {
  text-align: center;
  background-color: #483e5a;
  border: none;
  color: rgb(255, 255, 255);

}
.custom {
  width: 50px;
}
.wider_custom {
  width: 100px;
}
.save{
  cursor: pointer;
}

@import'~bootstrap-icons/font/bootstrap-icons.css'
</style>