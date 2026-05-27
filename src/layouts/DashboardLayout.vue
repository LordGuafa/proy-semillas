<template>

    <div>
        <div class="nav-bar">
             <AuxBar/>
        </div>

        <div class="side-bar">
            <SideBar/>
        </div>
        <div class="main-content">
            <slot></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import AuxBar from '@/components/AuxBar.vue'
import SideBar from '@/components/SideBar.vue'


</script>
<style lang="">

</style>