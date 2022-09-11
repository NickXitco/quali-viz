import { useEffect } from 'react'

export const useOnClickOutside = (ref: any, handler: (ev: UIEvent) => any) => {
	useEffect(() => {
		const mouseListener = (e: UIEvent) => {
			if (!ref.current || ref.current.contains(e.target)) {
				return
			}
			handler(e)
		}

		const keyHandler = (e: KeyboardEvent) => {
			if (e.key === 'Esc' || e.key === 'Escape') {
				handler(e)
			}
		}

		document.addEventListener('mousedown', mouseListener)
		document.addEventListener('touchstart', mouseListener)
		document.addEventListener('keyup', keyHandler)
		return () => {
			document.removeEventListener('mousedown', mouseListener)
			document.removeEventListener('touchstart', mouseListener)
			document.removeEventListener('keyup', keyHandler)
		}
	}, [ref, handler])
}
