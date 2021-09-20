import Entity from "./Entiry";

export default class Role extends Entity {

    constructor(role?: {
        title: string,
        name: string,
        description: string,
    }) {
        super();
        this.tableName = 'roles';
        this.data = role;
    }

    async add(): Promise<any> {
        const {
            title,
            name,
            description,
        } = this.data;
        let newId = await this.query(`INSERT INTO public.${this.tableName} (
            title,
            name,
            description
            ) VALUES ($1,$2,$3) RETURNING id;`,
            [
                title,
                name,
                description
            ]);
        return newId.rows[0].id;
    }


    public async getByName(name: string): Promise<any> {
        return (await this.query(`SELECT * FROM public.${this.tableName} WHERE name = $1 ORDER BY id`, [name])).rows[0];
    }

}