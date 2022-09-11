import { DriverResult, Qualifying, QualifyingResponse } from './interfaces'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Temporal } from '@js-temporal/polyfill'
import styles from './SessionView.module.scss'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const click = require('./click.ogg')

export interface SessionViewProps {
	session: QualifyingResponse | null
	qualiSelected: number
}
export const SessionView: FC<SessionViewProps> = (props) => {
	if (!props.session) return null

	return (
		<div className={styles.sectors}>
			<Sector
				sector={1}
				quali={props.qualiSelected}
				results={props.session.results}
			/>
			<Sector
				sector={2}
				quali={props.qualiSelected}
				results={props.session.results}
			/>
			<Sector
				sector={3}
				quali={props.qualiSelected}
				results={props.session.results}
			/>
		</div>
	)
}

interface SectorProps {
	sector: number
	quali: number
	results: DriverResult[]
}

const sounds: HTMLAudioElement[] = []

for (let i = 0; i < 20; i++) {
	const snd = new Audio(click)
	snd.volume = 0.5
	sounds.push(snd)
}

export const Sector: FC<SectorProps> = (props) => {
	const [running, setRunning] = useState(false)
	const driverRefs = useRef<Array<HTMLLIElement | null>>([])
	const sectorTimes = getSectorTimes(props)

	useEffect(() => {
		if (running) {
			const offsets = sectorTimes.map((sector) => sector.sectorTime.subtract(sectorTimes[0].sectorTime).total('milliseconds'))

			const seen: boolean[] = []
			for (const driver of driverRefs.current) {
				if (driver) {
					driver.style.opacity = '0'
				}
			}

			const startTime = performance.now()
			const step = () => {
				const currentTime = performance.now()
				const dif = currentTime - startTime
				for (let i = 0; i < offsets.length; i++) {
					if (offsets[i] <= dif && !seen[i]) {
						seen[i] = true
						sounds[i].play().then()
						const el = driverRefs.current[i]
						if (el) {
							el.style.opacity = '1'
						}
					}
				}

				if (!seen[offsets.length - 1]) {
					window.requestAnimationFrame(step)
				}
			}

			window.requestAnimationFrame(step)

			setRunning(false)
		}
	}, [running])

	return (
		<div>
			<div
				className={styles.sector_box}
				onClick={() => {
					setRunning(true)
				}}
			>
				sector {props.sector}
			</div>
			<div className={styles.sector_times}>
				<ul className={styles.sector_times_ul}>
					{sectorTimes.map((sector, i) => {
						return (
							<li
								className={styles.result}
								key={sector.driver.Abbreviation + props.quali + props.sector + sector.sectorTime.toString()}
								ref={(el) => (driverRefs.current[i] = el)}
							>
								<div
									style={{ background: `#${sector.driver.TeamColor}` }}
									className={styles.color_tag}
								></div>
								<span className={styles.result_abbreviation}>{sector.driver.Abbreviation}</span>

								<span className={styles.result_time}>{durationToString(sector.sectorTime.round({ largestUnit: 'minute' }))}</span>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

const getSectorTimes = (props: SectorProps) => {
	const sectors = []

	for (const result of props.results) {
		let quali: Qualifying | null
		switch (props.quali) {
			case 3:
				quali = result.q3
				break
			case 2:
				quali = result.q2
				break
			default:
				quali = result.q1
		}

		if (!quali) {
			continue
		}

		let sectorTime: Temporal.Duration
		const s1Time = Temporal.Duration.from(quali.Sector1Time)
		const s2Time = Temporal.Duration.from(quali.Sector2Time)
		const s3Time = Temporal.Duration.from(quali.Sector3Time)

		switch (props.sector) {
			case 3:
				sectorTime = s1Time.add(s2Time).add(s3Time)
				break
			case 2:
				sectorTime = s1Time.add(s2Time)
				break
			default:
				sectorTime = s1Time
		}

		sectors.push({
			driver: result.driver,
			sectorTime: sectorTime,
		})
	}
	return sectors.sort((a, b) => a.sectorTime.subtract(b.sectorTime).total('milliseconds'))
}

export const getMSFromDuration = (d: string) => {
	try {
		return Temporal.Duration.from(d).total('milliseconds')
	} catch (error) {
		return 0
	}
}

export const durationToString = (d: Temporal.Duration) => {
	try {
		if (d.minutes) {
			return `${d.minutes.toString().padStart(1, '0')}:${d.seconds.toString().padStart(2, '0')}:${d.milliseconds.toString().padStart(3, '0')}`
		}

		return `${d.seconds.toString().padStart(2, '0')}:${d.milliseconds.toString().padStart(3, '0')}`
	} catch (error) {
		return ''
	}
}
