export class ContextMenuItem {

    text: string;
    subtext: string | null;

    constructor(text: string, subtext: string | null = null) {
        this.text = text;
        this.subtext = subtext;
    }

}
