import { Group } from "./group";

export interface User {

    id?: number;

    name?: string;

    lastname?: string;

    email?: string;

    username?: string;

    telephone?: string;

    password?: string;

    role?: string;

    created_at?: string;

    groups?: Group[];

    monitor?: string;

    group_id?: number;

}
