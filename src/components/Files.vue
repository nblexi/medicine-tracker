<template>
  <div class='mt-5 bg-light'>
    <input class='' type="file" id="fileInput" name="filename">
    <button class='btn btn-outline-dark' @click='updateAll'>Upload</button>
  </div>
  <div class='mt-4'>
    <button class='w-100 btn btn-lg btn-info' @click='downloadAll'>Download</button>
  </div>
  <div class='mt-4'>
    <button class='w-100 btn btn-lg btn-danger' id='del' @click='deleteAll'>{{delete_text}}</button>
  </div>
</template>

<script setup>
const props = defineProps({
  updateUserInfo: {
    type: Function
  }
})
import { $medicine_list, $admin} from '../store.js'
import { ref } from "vue";
let medList = $medicine_list.value;
let name = $admin.value.name;
let start_date = $admin.value.start_date;
let target_date = $admin.value.target_date;
let target_days = $admin.value.target_days;

let delete_text = ref('Clear Data');
let del_rounds = 0;

let updateAll = () => {
  let user_name;
  let user_start_date;
  let user_target_date;
  let user_target_days;

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      // Process the contents of the file
      // For example, you can parse the CSV data and update the medList array
      // Here's a simple example assuming the CSV has a header row and each row is comma-separated
      const rows = contents.split('\n');
      const header = rows[0].split(',');
      user_name = header[0];
      user_start_date = header[1];
      user_target_date = header[2];
      user_target_days = header[3];

      $admin.set({
        name: user_name,
        start_date: user_start_date,
        target_date: user_target_date,
        target_days: user_target_days
      });

     rows.slice(1).map((row) => {
        const values = row.split(',');
        if(values != '') {
          console.log(values);

          let payload = {
            name: values[0],
            frequency: values[1],
            dose: values[2],
            ppb: values[3],
            blister_number: values[4],
            loose_number: values[5],
            pillbox_number: values[6],
            total_pills: values[7],
            total_days: values[8],
            needed_for_target: values[9],
            need_pills: values[10],
            need_blisters: values[11],
            will_run_out: values[12]
          };

          medList.push(payload);
        }
      })
      console.log(medList)
      $medicine_list.set(medList);
    };
    reader.readAsText(file);
  }
  setTimeout(() => {
    props.updateUserInfo();
  }, 500);
}

let downloadAll = () => {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Add CSV header
  csvContent += `${name},${start_date},${target_date},${target_days}\n`;

  // Add data rows
  medList.forEach((item) => {
    csvContent += `${item.name},${item.frequency},${item.dose},${item.ppb},${item.blister_number},${item.loose_number},${item.pillbox_number},${item.total_pills},${item.total_days},${item.needed_for_target},${item.need_pills},${item.need_blisters},${item.will_run_out}\n`;
  });

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "data.csv";
  link.click();
}

let deleteAll = () => {
  let clear_data = () => {
    $medicine_list.set([]);
    $admin.set({
      name: '',
      start_date: '',
      target_date: '',
      target_days: ''
    });
    props.updateUserInfo();
  }

  let del_button = document.getElementById('del');

  if(del_rounds == 0) {
    del_button.classList.remove('btn-danger');
    del_button.classList.add('btn-warning');
    delete_text.value = 'Confirm Clear All Data';
    del_rounds++;
  } else {
    clear_data();
    del_button.classList.remove('btn-warning');
    del_button.classList.add('btn-secondary');
    delete_text.value = 'Data Cleared';

    setTimeout(() => {
    del_button.classList.remove('btn-secondary');
    del_button.classList.add('btn-danger');
    delete_text.value = 'Clear Data';
    }, "3500");
    del_rounds = 0;
  }

}

</script>

<style scoped>
h3, h5, span {
  color: rgb(209, 209, 209);
}

@import'~bootstrap-icons/font/bootstrap-icons.css'
</style>