<template>
  <div class="garden-create-page">
    <section class="page-shell">
      <div class="page-shell-title-row">
        <h1>Add Garden</h1>
        <div class="page-shell-nav-row">
          <router-link class="page-link-button" :to="{ name: 'Gardens' }">
            Back to Gardens
          </router-link>
        </div>
      </div>

      <BaseForm @submit.prevent="createGarden" ref="form">
        <div class="form-row">
          <div class="form-col full-width">
            <BaseTextField
              v-model="garden.name"
              label="Garden Name"
              :error-messages="nameError"
              @blur="validateGardenName"
            >
              <template v-slot:prepend-inner>
                <BaseIcon class="icon-css">mdi-magnify</BaseIcon>
              </template>
            </BaseTextField>
          </div>

          <div class="form-col full-width">
            <BaseTextarea
              label="Notes"
              v-model="garden.notes"
            >
              <template v-slot:prepend-inner>
                <BaseIcon class="icon-css">mdi-note</BaseIcon>
              </template>
            </BaseTextarea>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col full-width action-row">
            <BaseButton variant="primary" size="medium" type="submit" aria-label="Create the garden">
              Create Garden
            </BaseButton>
            <router-link :to="{ name: 'Gardens' }" class="back-link-btn" aria-label="Go back to the gardens list">
              <BaseButton variant="secondary" size="medium" type="button">
                Back to List
              </BaseButton>
            </router-link>
          </div>
        </div>
      </BaseForm>
    </section>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton.vue';
import { v4 as uuidv4 } from 'uuid';
const store = useStore();
const router = useRouter();

const garden = reactive({
  name: '',
  notes: '',
  created_by: '',
  status: 'Active',
});

const nameError = ref('');

const validateGardenName = () => {
  const valid = Boolean(garden.name && garden.name.trim());
  nameError.value = valid ? '' : 'Please enter Garden Name';
  return valid;
};

const createGarden = async () => {
  if (validateGardenName()) {
    const gardenData = {
      id: uuidv4(),
      name: garden.name.trim(),
      notes: garden.notes,
      status: garden.status,
      created_by: store.state.user.resource_owner.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await store.dispatch("createGarden", gardenData);
    if (store.state.garden) {
      router.push({ name: "Gardens" });
    } else {
      alert("Error adding Garden Name" + garden.name);
    }
  } else {
    alert("Please correct required fields and resubmit");
  }
};
</script>
<style scoped>
.garden-create-page {
  width: 100%;
}

.page-shell {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.page-shell-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.85rem;
}

.page-shell-title-row h1 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.25;
}

.page-shell-nav-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.page-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.85rem;
  border-radius: 0.6rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.35rem;
}

.form-col {
  flex: 1;
  min-width: 0;
}

.full-width {
  width: 100%;
  flex: 0 0 100%;
}

.action-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.back-link-btn {
  text-decoration: none;
}

@media (max-width: 768px) {
  .page-shell-title-row {
    flex-direction: column;
    align-items: stretch;
  }

  .page-shell-nav-row,
  .page-link-button {
    width: 100%;
  }
}
</style>
