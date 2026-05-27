<template >
    <div>
        <form action="">
            <label for="user">Usuario</label>
            <input type="text" name="user" id="user" v-model="user">
            <label for="password">Contraseña</label>
            <input type="password" name="password" id="password" v-model="password">
            <button type="submit">Iniciar sesión</button>
            <p>{{ message }}</p>
        </form>
    </div>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'

const user:Ref<string> = ref('')
const password:Ref<string> = ref('')
const message:Ref<string> = ref('')

</script>
<style lang="">

</style>