import { SafeUrl } from "@angular/platform-browser";
import { Option } from "./option";

export interface Question {

    id?: number;

    keyword?: string;

    question?: string;

    file?: File;

    realtype?: string;

    created_at?: string;

    user_id?: number;

    options?: Option[];

    image?: SafeUrl;

}
