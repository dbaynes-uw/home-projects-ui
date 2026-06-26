<template>
  <transition name="fade">
    <div class="popup-modal" v-if="isVisible">
      <div class="window">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "PopupModal",
  data: () => ({
    isVisible: false,
  }),
  methods: {
    open() {
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
    },
  },
};
</script>
<style scoped>
/* css class for the transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.popup-modal {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.window {
  background: #fff;
  border-radius: 5px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  width: min(100%, 480px);
  max-width: 480px;
  max-height: calc(100vh - 1.5rem);
  overflow-y: auto;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem;
}

@media (max-width: 600px) {
  .popup-modal {
    /* Keep some breathing room from notch/home indicator and center vertically. */
    padding: calc(0.75rem + env(safe-area-inset-top)) 0.9rem calc(0.75rem + env(safe-area-inset-bottom));
    align-items: center;
  }

  .window {
    width: min(86vw, 360px);
    max-width: 360px;
    max-height: min(72vh, calc(100vh - 3.25rem - env(safe-area-inset-top) - env(safe-area-inset-bottom)));
    padding: 0.7rem;
    border-radius: 8px;
  }
}
</style>
