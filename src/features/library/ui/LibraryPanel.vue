<script setup lang="ts">
import {
  Search,
  LibraryBig,
  MessageCircle,
  Presentation,
  EllipsisVertical,
  Pin,
} from '@lucide/vue';
</script>
<template>
  <section class="library-content" aria-label="Library contents">
    <div class="library-tabs" role="toolbar" aria-label="Sidebar sections">
      <button disabled aria-label="Search unavailable">
        <Search :size="16" /></button
      ><button aria-label="Library items" aria-pressed="true">
        <LibraryBig :size="16" /></button
      ><button disabled aria-label="Comments unavailable">
        <MessageCircle :size="16" /></button
      ><button disabled aria-label="Presentation unavailable">
        <Presentation :size="16" /></button
      ><button
        class="library-pin"
        disabled
        aria-label="Pin library unavailable"
      >
        <Pin :size="16" />
      </button>
    </div>
    <button
      class="library-options"
      disabled
      aria-label="Library options unavailable"
    >
      <EllipsisVertical :size="16" />
    </button>
    <div class="library-empty">
      <h3>No items added yet...</h3>
      <p>
        Reusable shapes will live here.<br />Library imports arrive with
        drawing.
      </p>
      <button class="browse-libraries" disabled>Browse libraries</button>
    </div>
  </section>
</template>
