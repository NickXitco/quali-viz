export interface SeasonResponse {
	season: string
	url: string
}

export interface RaceResponse {
	season: number
	round: number
	url: string
	raceName: string
	Circuit: {
		circuitId: string
		url: string
		circuitName: string
		Location: {
			lat: number
			long: number
			locality: string
			country: string
		}
	}
	date: string
	time: string
}

export interface Event {
	Country: string
	EventDate: string
	EventFormat: string
	EventName: string
	F1ApiSupport: boolean
	Location: string
	OfficialEventName: string
	RoundNumber: number
	Session1: string
	Session1Date: string
	Session2: string
	Session2Date: string
	Session3: string
	Session3Date: string
	Session4: string
	Session4Date: string
	Session5: string
	Session5Date: string
}

export interface QualifyingResponse {
	event: Event
	results: DriverResult[]
}

export interface DriverResult {
	driver: Driver
	q1: Qualifying | null
	q2: Qualifying | null
	q3: Qualifying | null
}

export interface Driver {
	Abbreviation: string
	BroadcastName: string
	DriverNumber: string
	FirstName: string
	FullName: string
	GridPosition: number
	LastName: string
	Points: number
	Position: number
	Q1: string
	Q2: string
	Q3: string
	Status: string
	TeamColor: string
	TeamName: string
	Time: string
}

export interface Qualifying {
	Compound: string
	Driver: string
	DriverNumber: string
	FreshTyre: boolean
	IsAccurate: boolean
	IsPersonalBest: boolean
	LapNumber: number
	LapStartTime: string
	LapTime: string
	PitInTime: string
	PitOutTime: string
	Sector1SessionTime: string
	Sector1Time: string
	Sector2SessionTime: string
	Sector2Time: string
	Sector3SessionTime: string
	Sector3Time: string
	SpeedFL: number
	SpeedI1: number
	SpeedI2: number
	SpeedST: number
	Stint: number
	Team: string
	Time: string
	TrackStatus: string
	TyreLife: number
}
