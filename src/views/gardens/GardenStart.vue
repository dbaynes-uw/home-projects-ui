<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Home Gardening</h2>
    </v-card-title>
    <br/>
    <ul>
      <span v-if="waterings.id">
        <li class="left">
          <button id="button-as-link">
            <router-link  :to="{ name: 'WateringDisplay' }">Watering Layout</router-link>
          </button>
        </li>
      </span>
      <span v-else>
        <li class="left">
          <button id="button-as-link">
           <router-link  :to="{ name: 'WateringCreate' }">Create Watering</router-link>
          </button>
        </li>
      </span>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'GardenPlantList' }">Gardens</router-link>
        </button>
      </li>
    </ul>
    <br/>
  </v-card>
</template>
<script>
let time = null;  // define time be null
//import { v4 as uuidv4 } from "uuid";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  name: "GardenStart",
 //props: {
 //  location: {
 //    type: String, required: true
 //  }
 //},
  components: {
    ConfirmDialogue,
  },
  data() {
    return {
      current_vendor: '',
      product_active: true,
      showShoppingList: true,
      showFlag: false,
      passedMessage: '',
      toggle0: false,
      toggle1: false,
      toggle2: false,
      toggleInPlay: false,
      isVendorToggled: true,
      isProductToggled: null,
      home_safe: false,
      toggleArr: [],
      isFormValid: false,
      isAuthorValid: false,
      isTitleValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  created() {
    this.$store.dispatch("fetchWaterings");
  },
  computed: {
    waterings() {
    return this.$store.state.waterings;
    },
  },
  methods: {
    //onSubmit() {
    //  const sub_products_by_location = {
    //    ...this.products_by_location,
    //    id: uuidv4(),
    //    created_by: this.$store.state.user.resource_owner.email,
    //  };
    //  
    //  if (this.$store.dispatch("putVendorsProducts", sub_products_by_location)) {
    //    alert("Vendors Products List Updated Successfully")
    //    location.reload();
    //  } else {
    //    alert("Error adding Products in ProductLocaionsList View ");
    //  }
    //},
    isChecked(item, active) {
      item.active = active == true ? false : true
      return item.active
    },
    shoppingListDisplay(showFlag) {
      return this.showShoppingList = showFlag == true ? false : true
    },
    toggleLocation(index) {
      clearTimeout(time)
      time=setTimeout(() => {
        this.isVendorToggled = index === this.isVendorToggled? null : index
      }, 300)
    },
    doubleClickLocation(location) {
      console.log("DBLCLICK LOC", `${location}`)
      clearTimeout(time);
      this.$router.push({ name: 'ProductLocationList', params: { location: `${location}` } });

    },
    doubleClickVendor(vendor) {
      
      clearTimeout(time);
      this.$router.push({ name: 'VendorEdit', params: { id: `${vendor.id}` } });

    },
    doubleClickProduct(product) {
      clearTimeout(time);
      this.$router.push({ name: 'ProductEdit', params: { id: `${product.id}`} });

    },
    toggleVendor(index) {
      this.isProductToggled = index === this.isProductToggled? null : index
    }    
  },
};
</script>
<style lang="css">
.a {
  text-decoration: none;
}
.button,
button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5em;
  height: 2em;
  margin: 0.5em;
  border-radius: 5px;
  background: linear-gradient(to right, #d6d3d3, #EEEEEE); 
  text-decoration: none;
  
  font-size: 1em;
  color: white;
  border: none;
  outline: none;
}
ul {
    display: table;
    width: 100%;
}
li {
    display: table-cell;
}
li.left {text-align: left;}
li.right {text-align: right;}
.row-height {
  height: 2rem !important;
  margin: 0 0px 0;
}
input[type=checkbox] { 
  width: 10%;
  height: 1rem;
}
.checkbox-right {
  font-size: 1.25rem;
  position: relative;
  top: -2.65rem !important;
  left: 4rem !important;
}
/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 90%;
  /*Xwidth: 50%;*/
  padding: 2px;
  /*height: 300px; /* Should be removed. Only for demonstration */
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
.v-icon {
  color: darkslategrey;
  top: -0.2rem;
}
#form-container {
  text-align: left;
  width: 100% !important;
}
/*[type="checkbox"],
#notes {
  width: 100%;
  height: 4rem;
}*/
.button {
  margin: 30px;
  /*background-color: #39495c;*/
  background-color: lightgray;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 60px;
  color: white;
  padding: 20px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
label {
  font-size: 20px;
  margin-bottom: 5px;
}
input {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
select {
  border-color: darkgreen;
}
legend {
  font-size: 28px;
  font-weight: 700;
  margin-top: 20px;
}
.label-visible {
  top: -35px;
  left: 4px;
  visibility: visible;
}
.label-invisible {
  top: -10px;
  left: 4px;
  visibility: hidden;
}
.input-field {
  margin-top: 30px;
  position: relative;
}
.input-field > input {
  width: 100%;
}
.input-field > p {
  position: absolute;
  font-size: 14px;
  transition: 0.3s;
}
</style>
