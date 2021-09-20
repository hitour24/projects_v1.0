import Status from "./Status";

export default class TypeObjective extends Status {

    constructor(status?: {
        title: string,
        description: string,
    }) {
        super(status);
        this.tableName = 'type_objective';
    }
}