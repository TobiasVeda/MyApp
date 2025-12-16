

export interface Meet {
    id:number, // document id
    name:string,
    dateFrom:string,
    dateTo:string,
    location:string
}

export interface MeetDetails{
    id:number,
    startLists:boolean,
    heatLists:boolean,
    results:boolean,
    finals:boolean,
    schedule:boolean,
    clubs:boolean,
    livetiming:boolean
}

export interface Discipline{
    id:string, // meetID-i
    meetID:number, // FK
    name:string,
    // startTime:string
}

export interface Heat{
    id:string, // disciplineID-i
    disciplineID:string, // FK
    heatNumber:number,
    lanes:{
        laneNumber:number,
        swimmerID:number, // FK
        swimmerRegisteredTime:string,
        // swimmerResultTime:string
    }[]
}

export interface Result{
    id:string, // disciplineID-i
    disciplineID:string, // FK
    ageGroup:string,
    ranking:{
        place:number,
        swimmerID:number, // FK
        swimmerResultTime:string,
    }[]
}

// What a table...
export interface Schedule{
    index:number, // might not be needed anymore
    id:string,
    meetID:number, //FK
    name:string,
    start:string,
    isDate:boolean,
    isPause:boolean,
    isEnd:boolean,
    heats:string[]
}

export interface Swimmer{
    id:number,
    clubID: number,
    name:string,
}

export interface Club{
    id:number,
    name:string
}

export interface AttendingClubs{
    id:number, //meetID
    clubIDs:number[]
}

export interface AttendingSwimmers{
    id:string, //meetID-clubID
    swimmerIDs:number[]
}
