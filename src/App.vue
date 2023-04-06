<template>
  <nav id="center-nav">
    <router-link :to="{ name: 'About' }">About</router-link> |
    <router-link :to="{ name: 'EventList' }">Events</router-link> |
    <router-link :to="{ name: 'EventStatistics' }">Statistics</router-link> |
    <router-link :to="{ name: 'TrailList' }">Trails</router-link> |
    <router-link :to="{ name: 'UserList' }">Users</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: "Franklin Gothic Medium", Arial, sans-serif;
  line-height: 1.6;
  background: #e8f7f0;
}
body {
  font-family: "Franklin Gothic Medium", Arial, sans-serif;
  line-height: 1.6;
  background: #e8f7f0;
}
.container {
  max-width: 1100px;
  margin: auto;
  overflow: auto;
  padding: 0 2rem;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav a.router-link-exact-active {
  color: #42b983;
}
#center-nav {
  font-size: 1.5rem;
  padding: 10px;
  text-align: center;
}
.p-align-left {
  text-align: left;
  padding-top: 0em;
  margin-block-start: 0em;
  margin-block-end: 0em;
}
.ul-left {
  text-align: left;
  padding-inline-start: 1rem;
  margin-block-start: 0em;
  margin-block-end: 0em;
}
.events {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.event-link {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
i {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #fff;
  cursor: pointer;
}
.legend {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.complete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #35495e;
}
.incomplete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #41b882;
}
.is-complete {
  background: #35495e;
  color: #fff;
}
.text-style {
  font-family: "Franklin Gothic Medium", Arial, sans-serif;
  font-size: 1.15rem;
}
#select-box {
  height: 2rem;
}
@media (max-width: 500px) {
  .events {
    grid-template.columns: 1fr;
  }
}
</style>
