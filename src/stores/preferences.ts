import {defineStore} from 'pinia'
import {ref, watch} from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
	const isIconButton = ref(localStorage.getItem('isIconButton') === 'true')

	watch(isIconButton, val => {
		localStorage.setItem('isIconButton', String(val))
	})

	return {
		isIconButton,
	}
})
