import { Crucigram } from "./crucigram";
import { Task } from "./task";

export interface Activity{

    id?: number;

    name?: string;

    type?: string;

    user_id?: number;

    created_at?: Date;

    verticals?: Crucigram[];

    horizontals?: Crucigram[];

    task?: Task;

    state?: string;

}