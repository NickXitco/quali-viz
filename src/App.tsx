import React, { FC, useEffect, useState } from 'react'
import styles from './App.module.scss'
import { QualifyingResponse, RaceResponse, SeasonResponse } from './interfaces'
import cx from 'classnames'
import { SeasonsDropdown } from './SeasonsDropdown'
import { RacesDropdown } from './RacesDropdown'
import { SessionView } from './SessionView'

export const App: FC = () => {
	const [seasons, setSeasons] = useState<SeasonResponse[]>([{ season: '2022', url: '' }])
	const [races, setRaces] = useState<RaceResponse[]>([])
	const [selectedSeason, setSelectedSeason] = useState<SeasonResponse>({ season: '2022', url: '' })
	const [selectedRace, setSelectedRace] = useState<RaceResponse | null>(null)
	const [selectedSession, setSelectedSession] = useState<QualifyingResponse | null>(null)
	const [selectedQualifying, setSelectedQualifying] = useState(0)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch('https://ergast.com/api/f1/seasons.json?limit=100')
			.then((res) => res.json())
			.then((data) => {
				const seasons = data.MRData.SeasonTable.Seasons.reverse().filter((season: SeasonResponse) => parseInt(season.season) >= 2018)
				// TODO work on ergast fallback for 2006-2018
				setSeasons(seasons)
				setSelectedSeason(seasons[0])
			})
	}, [])

	useEffect(() => {
		fetch(`https://ergast.com/api/f1/${selectedSeason.season}.json`)
			.then((res) => res.json())
			.then((data) => {
				const races: RaceResponse[] = data.MRData.RaceTable.Races
				const today = new Date()
				today.setDate(today.getDate() + 1)
				const filteredRaces = races.filter((race) => new Date(race.date) < today)
				setRaces(filteredRaces)
				setSelectedRace(races[0])
			})
	}, [selectedSeason])

	useEffect(() => {
		if (!selectedRace) return
		setLoading(true)
		fetch(`http://127.0.0.1:8000/?y=${selectedSeason.season}&r=${selectedRace.round}`)
			.then((res) => res.json())
			.then((data) => {
				const response: QualifyingResponse = data
				setLoading(false)
				setSelectedSession(response)
			})

		// TODO add a fail case for all but especially this fetch
	}, [selectedRace])

	return (
		<div className={styles.App}>
			<div>
				<h1>
					<span>Sounds of</span>
					<br />
					Qualifying
				</h1>
			</div>
			<div className={styles.dropdowns}>
				<SeasonsDropdown
					items={seasons.map((season) => season.season)}
					onChange={(index: number) => {
						setSelectedSeason(seasons[index])
					}}
				/>

				<RacesDropdown
					items={races.map((race) => race.raceName)}
					onChange={(index: number) => {
						setSelectedRace(races[index])
					}}
				/>
				{selectedRace && <p className={styles.round_number}>Round {selectedRace.round}</p>}
			</div>

			<div className={styles.session_view}>
				{loading ? (
					<span className={styles.loader}></span>
				) : (
					<SessionView
						qualiSelected={selectedQualifying}
						session={selectedSession}
					/>
				)}
			</div>

			<div className={cx(styles.quali_selector, { [styles.quali_selector_closed]: loading })}>
				{/* TODO Make qualifying button animate as the progress bar for the session*/}
				{/* TODO Add focus visualization to the labels*/}
				<fieldset>
					<input
						type={'radio'}
						id={'q1'}
						name={'q'}
						value={'q1'}
						className={styles.vh}
						onChange={(e) => {
							if (e.target.checked) {
								setSelectedQualifying(1)
							}
						}}
					/>
					<label htmlFor="q1">Q1</label>
					<input
						type={'radio'}
						id={'q2'}
						name={'q'}
						value={'q2'}
						className={styles.vh}
						onChange={(e) => {
							if (e.target.checked) {
								setSelectedQualifying(2)
							}
						}}
					/>
					<label htmlFor="q2">Q2</label>
					<input
						type={'radio'}
						id={'q3'}
						name={'q'}
						value={'q3'}
						className={styles.vh}
						onChange={(e) => {
							if (e.target.checked) {
								setSelectedQualifying(3)
							}
						}}
					/>
					<label htmlFor="q3">Q3</label>
				</fieldset>
			</div>
		</div>
	)
}
