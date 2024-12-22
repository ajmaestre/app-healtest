import { Question } from "./question";

export interface Test{

    id?: number;

    name?: string;
    
    dateinit?: Date;

    dateend?: Date;

    user_id?: number;

    questions?: Question[];

    state?: string;

    dateResult?: Date;

}