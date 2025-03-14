import { defineNuxtPlugin } from '#app'
import katex from 'katex'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('katex', katex)
})