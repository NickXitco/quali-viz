import React, { FC, useEffect, useState } from 'react'
import styles from './App.module.scss'
import { QualifyingResponse, RaceResponse, SeasonResponse } from './interfaces'
import { Temporal } from '@js-temporal/polyfill'
import cx from 'classnames'

export interface SessionViewProps {
	session: QualifyingResponse | null
}
export const SessionView: FC<SessionViewProps> = (props) => {
	if (!props.session) return null

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Pos</th>
						<th>No</th>
						<th>Driver</th>
						<th>Constructor</th>
						<th>Q1</th>
						<th>Q2</th>
						<th>Q3</th>
					</tr>
				</thead>
				<tbody>
					{props.session.results.map((result, i) => (
						<tr key={i}>
							<td>{result.driver.Position}</td>
							<td>{result.driver.DriverNumber}</td>
							<td>{result.driver.FullName}</td>
							<td style={{ background: `#${result.driver.TeamColor}` }}>{result.driver.TeamName}</td>
							<td>{durationToString(result.driver.Q1)}</td>
							<td>{durationToString(result.driver.Q2)}</td>
							<td>{durationToString(result.driver.Q3)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export const getMSFromDuration = (d: string) => {
	try {
		return Temporal.Duration.from(d).total('milliseconds')
	} catch (error) {
		return 0
	}
}

export const durationToString = (d: string) => {
	try {
		const temporal = Temporal.Duration.from(d)

		console.log(temporal.total('milliseconds'))

		if (temporal.minutes) {
			return `${temporal.minutes.toString().padStart(1, '0')}:${temporal.seconds.toString().padStart(2, '0')}:${temporal.milliseconds.toString().padStart(3, '0')}`
		}

		return `${temporal.seconds.toString().padStart(2, '0')}:${temporal.milliseconds.toString().padStart(3, '0')}`
	} catch (error) {
		return ''
	}
}

export const App: FC = () => {
	const [seasons, setSeasons] = useState<SeasonResponse[]>([])
	const [races, setRaces] = useState<RaceResponse[]>([])
	const [selectedSeason, setSelectedSeason] = useState('2022')
	const [selectedRace, setSelectedRace] = useState<RaceResponse | null>(null)
	const [selectedSession, setSelectedSession] = useState<QualifyingResponse | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch('https://ergast.com/api/f1/seasons.json?limit=100')
			.then((res) => res.json())
			.then((data) => {
				const seasons = data.MRData.SeasonTable.Seasons.reverse().filter((season: SeasonResponse) => parseInt(season.season) >= 2018)
				// TODO work on ergast fallback for 2006-2018
				setSeasons(seasons)
				setSelectedSeason(seasons[0].season)
			})
	}, [])

	useEffect(() => {
		fetch(`https://ergast.com/api/f1/${selectedSeason}.json`)
			.then((res) => res.json())
			.then((data) => {
				const races: RaceResponse[] = data.MRData.RaceTable.Races
				const today = new Date()
				today.setDate(today.getDate() + 2)
				const filteredRaces = races.filter((race) => new Date(race.date) < today)
				setRaces(filteredRaces)
				setSelectedRace(races[0])
			})
	}, [selectedSeason])

	useEffect(() => {
		if (!selectedRace) return
		setLoading(true)
		fetch(`http://127.0.0.1:8000/?y=${selectedSeason}&r=${selectedRace.round}`)
			.then((res) => res.json())
			.then((data) => {
				const response: QualifyingResponse = data
				setLoading(false)
				setSelectedSession(response)
			})
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
				<label
					htmlFor="season"
					className={styles.vh}
				>
					Season:
				</label>
				<select
					name="season"
					id="season"
					onChange={(e) => {
						setSelectedSeason(e.target.value)
					}}
					className={styles.season_dropdown}
				>
					{seasons.map((season, i) => {
						return (
							<option
								key={i}
								value={season.season}
							>
								{season.season}
							</option>
						)
					})}
				</select>

				<label
					htmlFor="race"
					className={styles.vh}
				>
					Race:
				</label>
				<select
					name="race"
					id="race"
					onChange={(e) => {
						setSelectedRace(races[parseInt(e.target.value) - 1])
					}}
				>
					{races.map((race) => {
						return (
							<option
								key={race.round}
								value={race.round}
							>
								{race.raceName}
							</option>
						)
					})}
				</select>
				<p>Round {selectedRace ? selectedRace.round : 1}</p>
			</div>

			<div className={styles.session_view}>{loading ? <span className={styles.loader}></span> : <SessionView session={selectedSession} />}</div>

			<div className={cx(styles.quali_selector, { [styles.quali_selector_closed]: loading })}>
				<fieldset>
					<input
						type={'radio'}
						id={'q1'}
						name={'q'}
						value={'q1'}
						className={styles.vh}
					/>
					<label htmlFor="q1">Q1</label>
					<input
						type={'radio'}
						id={'q2'}
						name={'q'}
						value={'q2'}
						className={styles.vh}
					/>
					<label htmlFor="q2">Q2</label>
					<input
						type={'radio'}
						id={'q3'}
						name={'q'}
						value={'q3'}
						className={styles.vh}
					/>
					<label htmlFor="q3">Q3</label>
				</fieldset>
			</div>
		</div>
	)
}
