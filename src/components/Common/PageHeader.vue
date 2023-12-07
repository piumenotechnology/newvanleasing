<template>
   <b-colxx xxs="12" class="mb-4">
      <h1>
         <b-link @click.prevent="$router.go(-1)" class="heading-icon">
            <i class="simple-icon-arrow-left" />
         </b-link>
         {{ title }}</h1>
      <piaf-breadcrumb />
      <slot></slot>
      <!-- <div class="separator mb-5"></div> -->
   </b-colxx>
</template>
<script>
export default {
   props: ["title"]
}
</script>