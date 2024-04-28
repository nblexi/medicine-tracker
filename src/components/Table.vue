<template>
  <div>
    <table class='w-100'>
      <tr>
        <th class='pt-2 px-2'>name</th>
        <th class='pt-2 px-2'>/blister</th>
        <th class='pt-2 px-2'>blisters</th>
        <th class='pt-2 px-2'>loose</th>
        <th class='pt-2 px-2'>pillbox (portion)</th>
        <th class='pt-2 px-2'>pills</th>
        <th class='pt-2 px-2'>days</th>
        <th class='pt-2 px-2'>needed for target</th>
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
        <td class='pt-2 px-2'>{{ medicine.will_run_out }}</td>
        <td class='save' :id='medicine.name' @click='save_medicine(medicine.name)'><i class="bi bi-floppy2"></i></td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { $medicine_list, $admin } from '../store.js'
const medList = $medicine_list.value;
const target_date = $admin.value.target_date;
let target_days = $admin.value.target_days;

const props = defineProps({
  updateTable: {
    type: Function
  }
})

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

    console.log(today)
    console.log(target_date)
    target_days = time_between_dates(new Date(today), new Date(target_date));
    $admin.set({target_days: target_days, ...$admin.value});

    let total_pills = ((blister_number * ppb) + loose_number + (pillbox_number * dose));
    let total_days = parseFloat(total_pills / (frequency * dose));
    let needed_for_target = Math.ceil(target_days * (dose * frequency));
    let need_pills = Math.ceil(needed_for_target - total_pills);
    let need_blisters = Math.ceil(need_pills / ppb);




    date.setDate(date.getDate() + total_days);
    let will_run_out = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

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