<template>
  <div id="app">
    <div>Drop the excel files for the cagematch teams and the latest doodle in this box. Ignore the loading bar that never fills.</div>
    <vue-dropzone
      ref="myVueDropzone"
      id="dropzone"
      :options="dropzoneOptions">
    </vue-dropzone>
    <h1>Clean up names</h1>
    <div class="card-container">
      <div class="card-column">
        <div class="card">
          <div class="card-title">Cagematch member names</div>
          <div>Check these for duplicates. If there are names next to each other that refer to the same person, make them match and the extras will disappear. Green dots indicate that schedule data is available.</div>
          <ul>
            <li v-for="member in teamMembers">
              <input type="text" v-model="member.name">
              <span class="dot green-dot" v-if="findDoodlePerson(member.name)"></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="card-column">
        <div class="card">
          <div class="card-title">Names from Doodle</div>
          <div>Red dots mean that the name doesn't match anyone on a Cagematch team. It's probably because whoever filled out the Doodle wrote something stupid instead of their name. Change the name so it matches EXACTLY (case-sensitive) the name of the appropriate Cagematch team member.</div>
          <ul>
            <li v-for="person in people">
              <input type="text" v-model="person.name">
              <span class="dot red-dot" v-if="!findTeamMember(person.name)"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <h1>Select date</h1>
    <div class="chip-container">
      <div v-for="date in dates" class="chip date" v-on:click="selectedDate = date" :class="{selected: selectedDate == date}">
        {{date.format("dddd, MMMM DD @ hh:mm A")}}
      </div>
    </div>

    <h1>Teams</h1>
    <div class="card-container">
      <div class="card-column">
        <h1>First Half</h1>
        <div class="card-container">
          <div v-for="team in firstHalfTeams" class="card" :class="{complete: teamComplete(team)}">
            <div class="card-title">{{team.name}}</div>
            <div class="card-content">
              <ul>
                <li v-for="member in team.members">
                  <input type="text" v-model="member.name">
                  <span class="dot green-dot" v-if="isAvailable(member.name)"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="card-column">
        <h1>Second Half</h1>
        <div class="card-container">
          <div v-for="team in secondHalfTeams" class="card" :class="{complete: teamComplete(team)}">
            <div class="card-title">{{team.name}}</div>
            <div class="card-content">
              <ul>
                <li v-for="member in team.members">
                  <input type="text" v-model="member.name">
                  <span class="dot green-dot" v-if="isAvailable(member.name)"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import XLSX from 'xlsx'
import _ from 'lodash'
import parseDates from './parse-dates'
import parsePeople from './parse-people'
import parseTeams from './parse-teams'
import dropzoneOptions from './dropzone-options'

let data = {
  dates: [],
  people: [],
  teams: [],
  selectedDate: null,
};

window.data = data // DEBUG

function findDoodlePerson(name) {
  return _.find(data.people, {name})
}

function isAvailable(name) {
  let person = findDoodlePerson(name);
  if (person) {
    return _.find(person.dates, date => date == data.selectedDate)
  } else {
    return false;
  }
}

function teamComplete(team) {
  return team.members.filter(member => isAvailable(member.name)).length >= (parseInt(team.min) || team.members.length)
}

export default {
  name: 'app',
  components: {
    vueDropzone: vue2Dropzone
  },
  data () {
    data.dropzoneOptions = dropzoneOptions(this, 'handleDoodleData')
    return data;
  },
  computed: {
    teamMembers() {
      return _.chain(this.teams).
        map(team => team.members).
        flatten().
        sortBy('name').
        uniqBy('name').
        value()
    },
    firstHalfTeams() {
      return _.chain(this.teams).
        filter({half: '1'}).
        sortBy(team => teamComplete(team, this.selectedDate), -1). // this.selectedDate triggers recomputed
        reverse().
        value()
    },
    secondHalfTeams() {
      return _.chain(this.teams).
        filter({half: '2'}).
        sortBy(team => teamComplete(team, this.selectedDate), -1). // this.selectedDate triggers recomputed
        reverse().
        value()
    }
  },
  methods: {
    isAvailable,
    teamComplete,
    findDoodlePerson,

    handleDoodleData(workbook) {
      if (workbook.Sheets.Poll) {
        let sheet = XLSX.utils.sheet_to_json(workbook.Sheets.Poll);
        this.dates = parseDates(sheet);
        this.people = parsePeople(sheet, this.dates);
      } else {
        let sheet = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
        this.teams = parseTeams(sheet);
      }
    },
    findTeamMember(name) {
      return _.chain(this.teams).
        map(team => team.members).
        flatten().
        find({name})
        .value()
    },
  }
}
</script>

<style lang="scss">
body {
  background-color: #F2F2F2;
}

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

a {
  color: #42b983;
}

.card-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .card {
    width: 300px;
  }
}

.card-column {
  padding: 15px;
}

.card {
  background-color: white;
  margin: 15px;
  padding: 15px;
  max-width: 100%;

  border: 1px solid lightgray;
  // border-radius: 5px;
  box-shadow: 0 2px 5px 1px lightgray;

  .card-title {
    font-size: 24px;
  }

  &.complete {
    background-color: lightgreen;
  }
}

.dot {
  width: 10px;
  height: 10px;
  margin-top: 4px;
  border-radius: 999px;
  display: inline-block;
}

.red-dot {
  background-color: red;
}

.green-dot {
  background-color: green;
}

.chip-container {
  display: flex;
  flex-wrap: wrap;
}

.chip {
  margin: 5px;
  padding: 5px;
  background-color: white;
  border-radius: 5px;
  border: 1px solid gray;
  cursor: pointer;

  &.selected {
    background-color: green;
    color: white;
  }
}
</style>
