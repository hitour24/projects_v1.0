import Entity from "./Entiry";

export default class Status extends Entity {

    constructor(status?: {
        title: string,
        description: string,
    }) {
        super();
        this.tableName = '';
        this.data = status;
    }

    async add(): Promise<any> {
        const {
            title,
            description,
        } = this.data;
        let newId = await this.query(`INSERT INTO public.${this.tableName} (
            title,
            description
            ) VALUES ($1,$2) RETURNING id;`,
            [
                title,
                description,
            ]);
        return newId.rows[0].id;
    }


    public async getByTitle(title: string): Promise<any> {
        return (await this.query(`SELECT * FROM public.${this.tableName} WHERE title = $1 ORDER BY id`, [title])).rows[0];
    }

}