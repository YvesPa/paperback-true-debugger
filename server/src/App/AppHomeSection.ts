import { HomeSection, PartialSourceManga } from "@paperback/types";

export class AppHomeSection implements HomeSection {
    readonly id: string;
    readonly title: string;
    items: PartialSourceManga[];
    containsMoreItems: boolean;
    readonly type: string;

    constructor(info: {
        id: string,
        title: string,
        type: string,
        items?: PartialSourceManga[],
        containsMoreItems: boolean,
    }) {
        this.id = info.id;
        this.title = info.title;
        this.items = info.items ?? [];
        this.containsMoreItems = info.containsMoreItems;
        this.type = info.type;
    }
}