import Status from "./Status";

export default class StatusProject extends Status {

    constructor(status?: {
        title: string,
        description: string,
    }) {
        super(status);
        this.tableName = 'statuses_projects';
    }
}