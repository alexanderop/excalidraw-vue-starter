<script setup lang="ts">
defineProps<{ name: string }>();
</script>
<template>
  <svg
    v-if="name === 'menu'"
    aria-hidden="true"
    focusable="false"
    role="img"
    viewBox="0 0 24 24"
    class=""
    fill="none"
    stroke-width="2"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <g stroke-width="1.5">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </g>
  </svg>
  <svg
    v-else-if="name === 'library'"
    aria-hidden="true"
    focusable="false"
    role="img"
    viewBox="0 0 24 24"
    class=""
    fill="none"
    stroke-width="2"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <g stroke-width="1.75">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"
      ></path>
      <path d="M15 4l0 16"></path>
    </g>
  </svg>
  <svg
    v-else-if="name === 'undo'"
    aria-hidden="true"
    focusable="false"
    role="img"
    viewBox="0 0 20 20"
    class=""
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M7.5 10.833 4.167 7.5 7.5 4.167M4.167 7.5h9.166a3.333 3.333 0 0 1 0 6.667H12.5"
      stroke-width="1.25"
    ></path>
  </svg>
  <svg
    v-else-if="name === 'redo'"
    aria-hidden="true"
    focusable="false"
    role="img"
    viewBox="0 0 20 20"
    class=""
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M12.5 10.833 15.833 7.5 12.5 4.167M15.833 7.5H6.667a3.333 3.333 0 1 0 0 6.667H7.5"
      stroke-width="1.25"
    ></path>
  </svg>
  <svg
    v-else-if="name === 'help'"
    aria-hidden="true"
    focusable="false"
    role="img"
    viewBox="0 0 24 24"
    class=""
    fill="none"
    stroke-width="2"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <g stroke-width="1.5">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="12" cy="12" r="9"></circle>
      <line x1="12" y1="17" x2="12" y2="17.01"></line>
      <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4"></path>
    </g>
  </svg>
</template>
