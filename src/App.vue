<template>
  <div id="app">
    <vue-dropzone
      ref="myVueDropzone"
      id="dropzone"
      :options="dropzoneOptions">
    </vue-dropzone>

    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import XLSX from 'xlsx'
import moment from 'moment'
window.moment = moment
window.xlsx = XLSX

function handleDoodleData(data) {
  let days = Object.values(data[2]);
  let times = Object.values(data[3]);

  let dayIndex = 0;
  let timeIndex = 0;
  let dates = [];
  while(timeIndex < times.length) {
    let day = days[dayIndex];
    let time = times[timeIndex];
    let dateString = `${day} ${time}`;
    console.log('dateString', dateString);

    timeIndex++;
  }

  console.log("DAYS", days);
  console.log("TIMES", times);
}

export default {
  name: 'app',
  components: {
    vueDropzone: vue2Dropzone
  },
  data () {
    let instance = this;

    return {
      msg: 'Welcome to Your Vue.js App',
      dropzoneOptions: {
        accept(file, done) {
          var reader = new FileReader();

          reader.addEventListener("loadend", event => {
            file = event.target.result
            let workbook = XLSX.read(file, {type: "array", cellStyles: true});
            let data = XLSX.utils.sheet_to_json(workbook.Sheets.Poll);
            handleDoodleData(data);
          });

          reader.readAsArrayBuffer(file);
        },

        autoQueue: false, // stop upload

        // stuff that's not used, because we're not uploading,
        // but dropzone complains if you don't include it
        url: 'https://httpbin.org/post',
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: { "My-Awesome-Header": "header value" },
      }
    };
  },
  methods: {

  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
