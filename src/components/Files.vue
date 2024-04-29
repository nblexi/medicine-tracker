<template>
  <div class='mt-5 download'>
    <label class="custom-file-upload" @click='edit_button_state'>
      <input type="file" id='fileUpload' name='filename'/>
      Select File
    </label>
    <button class='btn btn-outline-dark' id='upload' @click='updateAll'>Upload</button>
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
import { $medicine_list, $name, $start_date, $target_date, $target_days, $days_on} from '../store.js'
import { ref } from "vue";
let medList = $medicine_list.value;
let name = $name.value;
let start_date = $start_date.value;
let target_date = $target_date.value;
let target_days = $target_days.value;
let days_on_meds = $days_on.value;

let delete_text = ref('Clear Data');
let del_rounds = 0;

let edit_button_state = () => {
  let upload_button = document.getElementById('upload');
  setTimeout(() => {
    upload_button.classList.remove('btn-outline-dark');
    upload_button.classList.add('btn-info');
  }, 1000);

}

let updateAll = () => {
  let user_name;
  let user_start_date;
  let user_target_date;
  let user_target_days;

  if(document.getElementById('fileUpload').files.length == 0) {
    return;
  }

  let upload_button = document.getElementById('upload');
  upload_button.classList.add('btn-outline-dark');
  upload_button.classList.remove('btn-info');

  const fileInput = document.getElementById('fileUpload');
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

      $name.set(user_name);
      $start_date.set(user_start_date);
      $target_date.set(user_target_date);
      $target_days.set(user_target_days);

     rows.slice(1).map((row) => {
        const values = row.split(',');
        if(values != '') {
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
    $name.set('');
    $start_date.set('');
    $target_date.set('');
    $target_days.set('');
    $days_on.set('');
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
input[type="file"] {
  display: none;
}
.custom-file-upload {
  border: 1px solid #565656;
  border-radius: 8px;
  display: inline-block;
  padding: 6px 12px;
  margin: 1px, 5px;
  cursor: pointer;
}
.download {
  display: flex;
  justify-content:space-around;
  padding: 5px;
  border-radius: 8px;
  background-color: rgb(207, 239, 213);
}
h3, h5, span {
  color: rgb(209, 209, 209);
}

@import'~bootstrap-icons/font/bootstrap-icons.css'
</style>