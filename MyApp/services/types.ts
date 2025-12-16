

export interface Meet {
    meetID:number,
    meetName:string,
    dateFrom:string,
    dateTo:string,
    location:string,
    hostClub:string,
    poolName:string,
    numberOfLanes:number, // 6
    firstLane:number, // 1
    meetType:string,
    poolLength:number,
    poolLengthUnit:string, // meter
    hasStartlists:boolean,
    hasHeatlists:boolean,
    hasResults:boolean,
    hasFinals:boolean,
    hasSchedule:boolean,
    hasClubs:boolean,
    hasLivetiming:boolean
}

export interface Discipline{
    disciplineID:number,
    length:number
    art:string,
    sex:string,
    poolLength:string, // 25 meter
}

export interface Heat{
    attendingDisciplineVal:number,
    swimmerID:number,
    heatNumber:number,
    lane:number,
    registeredTime:string,
    swimmerName:string,
    clubName:string
}

export interface Result{
    swimmerID:number,
    disciplineID:number,
    meetID:number,
    date:string,
}

export interface Schedule{
    session:string,
    disciplineName:string,
    heatNumber?:number,
    time:string
}

export interface Club{
    clubID:number,
    clubName:string
}

export interface Swimmer{
    swimmerID:number,
    firstName:string,
    lastName:string,
    yearBorn:number,
    ageGroup:string,
    sex:string,
    clubID:number
}

export interface AttendingClub{
    meetID:number,
    clubID:number
}

export interface AttendingSwimmer{
    meeID:number,
    swimmerID:number
}

export interface AttendingDiscipline{
    val:number,
    name:string,
    meetID:number,
    disciplineID:number
}
