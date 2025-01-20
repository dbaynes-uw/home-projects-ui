<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <h2>Edit Book {{ book.title }}</h2>
  <div class="edit">
    <button id="link-as-button">
      <router-link  :to="{ name: 'BookList' }">Back to Book List</router-link>
    </button>
    <button id="link-as-button">
      <router-link  :to="{ name: 'BookDetails' }">View the Card</router-link>
    </button>
    <br/>
    <br/>
    <form class="card-display" @submit.prevent="updateBook">
      <div class="form-container">
        <v-text-field
          label="Title"
          v-model="book.title"
          required
        />
        <v-text-field
          label="Author"
          v-model="book.author"
          required
        />
        <v-text-field
          label="Click calendar at right to change Date Written"
          v-model="book.date_written"
          type="date"
        />
        <v-text-field
          label="Click calendar at right to change Date Read"
          v-model="book.date_read"
          type="date"
        />
        <v-text-field
          label="URL to Review"
          v-model="book.url_to_review"
        />        
        <v-textarea
          label="Notes"
          v-model="book.notes"
          rows="3"
          cols="40"
        />
        <br/>
        <button class="button" id="link-as-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {},
  created() {
    this.$store.dispatch("fetchBook", this.id);
  },
  computed: {
    book() {
      return this.$store.state.book;
    },
  },

  data() {
    return {};
  },
  methods: {
    async updateBook() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Book from List ",
        message:
          "Are you sure you want to update " + 
          this.book.title,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        const book = {
          ...this.book,
          updated_by: this.$store.state.created_by,
        };
        if (this.$store.dispatch("updateBook", book)) {
          this.$router.push({ name: "BookDetails", params: { id: book.id } });
        }
      }
    },
  },
};
</script>
<style></style>