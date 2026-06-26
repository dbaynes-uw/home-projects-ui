<template>
  <popup-modal ref="popup">
    <h2 class="confirm-title">{{ title }}</h2>
    <p class="confirm-message">{{ message }}</p>
    <div class="btns">
      <button class="cancel-btn" @click="_cancel">{{ cancelButton }}</button>
      <span class="ok-btn" @click="_confirm">{{ okButton }}</span>
    </div>
  </popup-modal>
</template>
<script>
import PopupModal from "./PopupModal.vue";
export default {
  name: "ConfirmDialogue",
  components: { PopupModal },
  data: () => ({
    // Parameters that change depending on the type of dialogue
    book: "",
    title: undefined,
    message: undefined, // Main text content
    okButton: undefined, // Text for confirm button; leave it empty because we don"t know what we"re using it for
    cancelButton: "Back", // text for cancel button
    // Private variables
    resolvePromise: undefined,
    rejectPromise: undefined,
  }),
  methods: {
    show(opts = {}) {
      this.title = opts.title;
      this.message = opts.message;
      this.okButton = opts.okButton;
      if (opts.cancelButton) {
        this.cancelButton = opts.cancelButton;
      }
      // Once we set our config, we tell the popup modal to open
      this.$refs.popup.open();
      // Return promise so the caller can get results
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },
    _confirm() {
      this.$refs.popup.close();
      this.resolvePromise(true);
    },
    _cancel() {
      this.$refs.popup.close();
      this.resolvePromise(false);
      // Or you can throw an error
      // this.rejectPromise(new Error("User canceled the dialogue"))
    },
  },
};
</script>
<style scoped>
.confirm-title {
  margin-top: 0;
  margin-bottom: 0.35rem;
  line-height: 1.25;
}

.confirm-message {
  margin: 0 0 0.6rem;
  line-height: 1.35;
}

.btns {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
.ok-btn {
  color: red;
  text-decoration: underline;
  line-height: 2.5rem;
  cursor: pointer;
  white-space: nowrap;
}

.cancel-btn {
  padding: 0.5em 1em;
  background-color: #d5eae7;
  color: #35907f;
  border: 2px solid #0ec5a4;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
}

@media (max-width: 600px) {
  .btns {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.4rem;
  }

  .confirm-title {
    font-size: 1.05rem;
    margin-bottom: 0.25rem;
  }

  .confirm-message {
    margin-bottom: 0.45rem;
    font-size: 0.95rem;
  }

  .ok-btn {
    line-height: 1.9rem;
    font-size: 0.92rem;
    white-space: nowrap;
  }

  .cancel-btn {
    padding: 0.42em 0.72em;
    font-size: 0.86rem;
    text-transform: none;
  }
}
</style>
