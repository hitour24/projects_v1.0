import Status from "./Status";

export default class StatusObjective extends Status {

    constructor(status?: {
        title: string,
        description: string,
    }) {
        super(status);
        this.tableName = 'statuses_objectives';
    }
}