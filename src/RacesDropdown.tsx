import React, { FC, useRef, useState } from 'react'
import cx from 'classnames'
import styles from './RacesDropdown.module.scss'
import { useOnClickOutside } from './useOnClickOutside'
import PerfectScrollbar from 'react-perfect-scrollbar'

interface RacesDropdownProps {
	items: string[]
	onChange: (index: number) => void
}

export const RacesDropdown: FC<RacesDropdownProps> = (props) => {
	const [selected, setSelected] = useState(0)
	const [open, setOpen] = useState(false)
	const ref = useRef(null)
	useOnClickOutside(ref, () => setOpen(false))

	const selectItem = (index: number) => {
		if (index !== selected) {
			props.onChange(index)
		}
		setOpen(false)
		setSelected(index)
	}

	if (props.items.length === 0) {
		return null
	}

	// TODO make buttons invisible to accessibility if not opened

	return (
		<div
			className={cx(styles.dropdown)}
			ref={ref}
		>
			<button
				className={cx(styles.dropdown_header_button)}
				onClick={() => setOpen(!open)}
			>
				<span>{props.items[selected]}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 19.61 10.31"
					className={styles.dropdown_arrow}
				>
					<g>
						<path
							fill={'#fff'}
							d="M9.81,10.31c-.13,0-.26-.05-.35-.15L.15,.85C-.05,.66-.05,.34,.15,.15S.66-.05,.85,.15L9.81,9.1,18.76,.15c.2-.2,.51-.2,.71,0s.2,.51,0,.71L10.16,10.16c-.09,.09-.22,.15-.35,.15Z"
						/>
					</g>
				</svg>
			</button>
			<PerfectScrollbar className={cx(styles.scrollbar, { [styles.scrollbar_open]: open })}>
				<ul className={cx(styles.dropdown_items)}>
					{props.items.map((item, i) => (
						<li key={i}>
							<button
								onClick={() => selectItem(i)}
								className={cx(styles.dropdown_item, { [styles.dropdown_item_selected]: i === selected })}
							>
								<span>{item}</span>
							</button>
						</li>
					))}
				</ul>
			</PerfectScrollbar>
		</div>
	)
}
