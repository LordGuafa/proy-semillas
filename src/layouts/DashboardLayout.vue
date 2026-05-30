<template>

    <div>
           <div class="nav-bar">
             <AuxBar/>
        </div>

        <div class="side-bar">
            <SideBar/>
        </div>
        <div class="main-content">
            <slot name="dashboard"></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import AuxBar from '@/components/AuxBar.vue'
import SideBar from '@/components/SideBar.vue'
import Header from '@/components/Header.vue'


</script>
<style lang="">

</style>