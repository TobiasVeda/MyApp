import * as SQLite from 'expo-sqlite';
import {AttendingDiscipline, Discipline, Heat, Meet, Swimmer} from "@/services/types";

const dbName = "daba";

export async function upsertMeetIDAndName(meetID:number, meetName:string):Promise<SQLite.SQLiteRunResult|null>{

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        const result = await db.runAsync(`
        INSERT INTO meet (meet_id, meet_name) VALUES (?, ?)
        ON CONFLICT (meet_id) DO UPDATE SET meet_name = excluded.meet_name
        `, meetID, meetName);

        return result;
    } catch (e) {
        console.log(e);
        return null
    }
}

export async function upsertMeet(meet: Meet): Promise<SQLite.SQLiteRunResult | null> {
    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        const result = await db.runAsync(`
            INSERT INTO meet (
                meet_id,
                meet_name,
                host_club,
                location,
                pool_name,
                date_from,
                date_to,
                number_of_lanes,
                first_lane,
                meet_type,
                pool_length,
                pool_length_unit,
                has_startlists,
                has_heatlists,
                has_results,
                has_finals,
                has_schedule,
                has_clubs,
                has_livetiming
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(meet_id) DO UPDATE SET
                meet_name = excluded.meet_name,
                host_club = excluded.host_club,
                location = excluded.location,
                pool_name = excluded.pool_name,
                date_from = excluded.date_from,
                date_to = excluded.date_to,
                number_of_lanes = excluded.number_of_lanes,
                first_lane = excluded.first_lane,
                meet_type = excluded.meet_type,
                pool_length = excluded.pool_length,
                pool_length_unit = excluded.pool_length_unit,
                has_startlists = excluded.has_startlists,
                has_heatlists = excluded.has_heatlists,
                has_results = excluded.has_results,
                has_finals = excluded.has_finals,
                has_schedule = excluded.has_schedule,
                has_clubs = excluded.has_clubs,
                has_livetiming = excluded.has_livetiming
            `,
            meet.meetID,
            meet.meetName,
            meet.hostClub,
            meet.location,
            meet.poolName,
            meet.dateFrom,
            meet.dateTo,
            meet.numberOfLanes,
            meet.firstLane,
            meet.meetType,
            meet.poolLength,
            meet.poolLengthUnit,
            meet.hasStartlists,
            meet.hasHeatlists,
            meet.hasResults,
            meet.hasFinals,
            meet.hasSchedule,
            meet.hasClubs,
            meet.hasLivetiming
        );
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function upsertDiscipline(discipline:Discipline):Promise<number|null>{

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        // DO UPDATE instead of DO NOTHING to get the id
        const result = await db.getFirstAsync<{discipline_id:number}>(`
            INSERT INTO discipline (length, art, sex, pool_length)
            VALUES (?, ?, ?, ?)
            ON CONFLICT (length, art, sex, pool_length)
            DO UPDATE SET length = excluded.length
            RETURNING discipline_id;
        `, discipline.length, discipline.art, discipline.sex, discipline.poolLength);

        return result?.discipline_id ?? null;
    } catch (e) {
        console.log(e);
        return null
    }
}


export async function upsertAttendingDiscipline(atDiscipline:AttendingDiscipline):Promise<SQLite.SQLiteRunResult|null>{

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        const result = await db.runAsync(`
        INSERT INTO attending_discipline (val, meet_id, name, discipline_id)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (val, meet_id) DO NOTHING;
        `, atDiscipline.val , atDiscipline.meetID, atDiscipline.name, atDiscipline.disciplineID);

        return result;
    } catch (e) {
        console.log(e);
        return null
    }
}

export async function upsertSwimmerIDAndName(swimmerID:number, swimmerName:string):Promise<SQLite.SQLiteRunResult|null>{

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        const result = await db.runAsync(`
        INSERT INTO swimmer (swimmer_id, first_name) VALUES (?, ?)
        ON CONFLICT (swimmer_id) DO UPDATE SET first_name = excluded.first_name
        `, swimmerID, swimmerName);

        return result;
    } catch (e) {
        console.log(e);
        return null
    }
}

export async function upsertHeat(heat:Heat):Promise<SQLite.SQLiteRunResult|null>{

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        const result = await db.runAsync(`
            INSERT INTO heat (attending_discipline_val, swimmer_id, heat_number, lane, registered_time, swimmer_name, club_name)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (attending_discipline_val, swimmer_id)
            DO UPDATE SET heat_number = excluded.heat_number, lane = excluded.lane, registered_time = excluded.registered_time;
        `, heat.attendingDisciplineVal, heat.swimmerID, heat.heatNumber, heat.lane, heat.registeredTime, heat.swimmerName, heat.clubName);

        return result;
    } catch (e) {
        console.log(e);
        return null
    }
}



export async function getAllMeets():Promise<Meet[]|null>{

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        const result = await db.getAllAsync<any>(`SELECT * FROM meet`);
        let meet:Meet[] = [];

        for (const row of result) {
            meet.push({
                meetID: row.meet_id,
                meetName: row.meet_name,
                hostClub: row.host_club,
                location: row.location,
                poolName: row.pool_name,
                dateFrom: row.date_from,
                dateTo: row.date_to,
                numberOfLanes: row.numberOfLanes,
                firstLane: row.firstLane,
                meetType: row.meetType,
                poolLength: row.poolLength,
                poolLengthUnit: row.poolLengthUnit,
                hasStartlists: !!row.has_startlists,
                hasHeatlists: !!row.has_heatlists,
                hasResults: !!row.has_results, // turns 1/0 to true/false
                hasFinals: !!row.has_finals,
                hasSchedule: !!row.has_schedule,
                hasClubs: !!row.has_clubs,
                hasLivetiming: !!row.has_livetiming
            });
        }
        return meet;
    } catch (e) {
        console.log(e);
        return null
    }
}


export async function getAllAttendingDisciplinesWhere(meetID:number):Promise<AttendingDiscipline[]|null>{

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        const result = await db.getAllAsync<any>(`
        SELECT * FROM meet, attending_discipline 
        WHERE meet.meet_id = attending_discipline.meet_id AND
        attending_discipline.meet_id = ?
        `, meetID);
        let disciplines:AttendingDiscipline[] = [];

        for (const row of result) {
            disciplines.push({
                val: row.val,
                name: row.name,
                meetID: row.meet_id,
                disciplineID: row.discipline_id
            });
        }
        return disciplines;
    } catch (e) {
        console.log(e);
        return null
    }
}

export async function getAllHeatsWhere(meetID:number, val:number):Promise<Heat[]|null>{

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        const result = await db.getAllAsync<any>(`
        SELECT * FROM meet, attending_discipline, heat 
        WHERE meet.meet_id = attending_discipline.meet_id AND 
        attending_discipline.val = heat.attending_discipline_val AND
        meet.meet_id = ? AND
        heat.attending_discipline_val = ?;
            `, meetID, val);

        let heats:Heat[] = [];

        for (const row of result) {
            heats.push({
                attendingDisciplineVal: row.attending_discipline_val,
                swimmerID: row.swimmer_id,
                heatNumber: row.heat_number,
                lane: row.lane,
                registeredTime: row.registered_time,
                swimmerName: row.swimmer_name,
                clubName: row.club_name
            });
        }
        return heats;
    } catch (e) {
        console.log(e);
        return null
    }
}


export async function getAllSwimmersOfDisciplineWhere(meetID:number, val:number):Promise<Swimmer[]|null>{

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        const result = await db.getAllAsync<any>(`
        SELECT * FROM meet, attending_discipline, heat, swimmer 
        WHERE meet.meet_id = attending_discipline.meet_id AND 
        attending_discipline.val = heat.attending_discipline_val AND
        heat.swimmer_id = swimmer.swimmer_id AND
        meet.meet_id = ? AND
        heat.attending_discipline_val = ?;
            `, meetID, val);

        let swimmers:Swimmer[] = [];

        for (const row of result) {
            swimmers.push({
                swimmerID: row.swimmer_id,
                firstName: row.first_name,
                lastName: row.last_name,
                yearBorn: row.year_born,
                ageGroup: row.age_group,
                sex: row.sex,
                clubID: row.club_id
            });
        }
        return swimmers;
    } catch (e) {
        console.log(e);
        return null
    }
}


export async function hardResetDB() {
    try {
        await SQLite.deleteDatabaseAsync(dbName);
        window.location.reload();
        console.log("Database deleted");
    } catch (e) {
        console.log(e);
    }
}

export async function dropDB(){
    try {
        const db = await SQLite.openDatabaseAsync(dbName);
        await db.execAsync(`
        DROP TABLE IF EXISTS club;
        DROP TABLE IF EXISTS swimmer;
        DROP TABLE IF EXISTS meet;
        DROP TABLE IF EXISTS discipline;
        DROP TABLE IF EXISTS attending_club;
        DROP TABLE IF EXISTS attending_swimmer;
        DROP TABLE IF EXISTS results;
        DROP TABLE IF EXISTS attending_discipline;
        DROP TABLE IF EXISTS heat;
    `);
    } catch (e) {
        console.log(e);
    }

}

export async function createDB(){

    try {
        const db = await SQLite.openDatabaseAsync(dbName);

        await db.execAsync(`
        CREATE TABLE IF NOT EXISTS meet (
            meet_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
            meet_name TEXT,
            host_club TEXT,
            location TEXT,
            pool_name TEXT,
            date_from TEXT,
            date_to TEXT,
            number_of_lanes INTEGER,
            first_lane INTEGER,
            meet_type TEXT,
            pool_length INTEGER,
            pool_length_unit TEXT,
            has_startlists INTEGER,
            has_heatlists INTEGER,
            has_results INTEGER,
            has_finals INTEGER,
            has_schedule INTEGER,
            has_clubs INTEGER,
            has_livetiming INTEGER
        );
        CREATE TABLE IF NOT EXISTS club (
            club_id INTEGER PRIMARY KEY NOT NULL UNIQUE, 
            club_name TEXT
        );
        CREATE TABLE IF NOT EXISTS swimmer (
            swimmer_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
            first_name TEXT,
            last_name TEXT,
            year_born INTEGER,
            age_group TEXT,
            sex TEXT,
            club_id INTEGER,
            FOREIGN KEY (club_id) REFERENCES club(club_id)
        );
        CREATE TABLE IF NOT EXISTS discipline (
            discipline_id INTEGER PRIMARY KEY AUTOINCREMENT,
            length TEXT,
            art TEXT,
            sex TEXT,
            pool_length TEXT,
            UNIQUE (length, art, sex, pool_length)
        );
        CREATE TABLE IF NOT EXISTS attending_club (
            meet_id INTEGER NOT NULL,
            club_id INTEGER NOT NULL,
            FOREIGN KEY (meet_id) REFERENCES meet(meet_id),
            FOREIGN KEY (club_id) REFERENCES club(club_id)
        );
        CREATE TABLE IF NOT EXISTS attending_swimmer (
            meet_id INTEGER NOT NULL,
            swimmer_id INTEGER NOT NULL,
            FOREIGN KEY (swimmer_id) REFERENCES swimmer(swimmer_id),
            FOREIGN KEY (meet_id) REFERENCES meet(meet_id)
        );
        CREATE TABLE IF NOT EXISTS results (
            swimmer_id INTEGER NOT NULL,
            discipline_id INTEGER NOT NULL,
            meet_id INTEGER NOT NULL,
            timestamp TEXT,
            FOREIGN KEY (swimmer_id) REFERENCES swimmer(swimmer_id),
            FOREIGN KEY (discipline_id) REFERENCES discipline(discipline_id),
            FOREIGN KEY (meet_id) REFERENCES meet(meet_id)
        );
        CREATE TABLE IF NOT EXISTS attending_discipline (
            val INTEGER,
            meet_id INTEGER NOT NULL,
            name TEXT,
            discipline_id INTEGER NOT NULL,
            UNIQUE (val, meet_id),
            FOREIGN KEY (meet_id) REFERENCES meet(meet_id),
            FOREIGN KEY (discipline_id) REFERENCES discipline(discipline_id)
        );
        CREATE TABLE IF NOT EXISTS heat (
            attending_discipline_val INTEGER NOT NULL,
            swimmer_id INTEGER NOT NULL,
            heat_number INTEGER,
            lane INTEGER,
            registered_time TEXT,
            swimmer_name TEXT,
            club_name TEXT,
            UNIQUE (attending_discipline_val, swimmer_id),
            FOREIGN KEY (swimmer_id) REFERENCES swimmer(swimmer_id),
            FOREIGN KEY (attending_discipline_val) REFERENCES attending_discipline(val)
        );
    `);

    } catch (e) {
        console.log(e);
    }

}


