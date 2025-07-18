import {defineStore} from 'pinia'
import {ref, watch} from 'vue'

const OLD_KEY = 'isIconButton'
const NEW_KEY = 'is_icon_button'

export const usePreferencesStore = defineStore('preferences', () => {
	let initValue = false

	if (localStorage.getItem(NEW_KEY) !== null) {
		initValue = localStorage.getItem(NEW_KEY) === 'true'
	} else if (localStorage.getItem(OLD_KEY) !== null) {
		initValue = localStorage.getItem(OLD_KEY) === 'true'
		localStorage.setItem(NEW_KEY, String(initValue))
		localStorage.removeItem(OLD_KEY) // 兩週後移除
	}

	const isIconButton = ref(initValue)

	watch(isIconButton, val => {
		localStorage.setItem(NEW_KEY, String(val))
	})

	return {
		isIconButton,
	}
})
