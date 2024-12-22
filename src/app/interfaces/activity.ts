import { Crucigram } from "./crucigram";

export interface Activity{

    id?: number;

    name?: string;

    type?: string;

    user_id?: number;

    created_at?: Date;

    verticals?: Crucigram[];

    horizontals?: Crucigram[];

    state?: string;

}