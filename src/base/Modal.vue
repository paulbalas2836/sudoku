<template>
  <transition name="modal-fade">
    <div class="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div
        class="bg-white shadow-2xl overflow-x-auto flex flex-col rounded-md w-full max-w-lg px-8 py-4"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header
          class="flex justify-center items-center mb-2 pl-6 py-2 relative flex-col"
          id="modalTitle"
        >
          <slot name="header"> </slot>
        </header>

        <section class="relative py-5" id="modalDescription">
          <slot name="body"></slot>
        </section>
      </div>
    </div>
  </transition>
</template>
