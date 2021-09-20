import Entity from "./Entiry";
import Role from "./Role";

export default class RoleProject extends Role {

    constructor(roleProject?: {
        title: string,
        name: string,
        description: string,
    }) {
        super();
        this.tableName = 'roles_project';
        this.data = roleProject;
    }


    public async getByName(name: string): Promise<any> {
        return (await this.query(`SELECT * FROM public.${this.tableName} WHERE name = $1 ORDER BY id`, [name])).rows[0];
    }

}