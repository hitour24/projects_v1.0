import Entity from "./Entiry";

export default class Permissions extends Entity {

    constructor(member?: {
        id_project: number,
        id_user: number,
    }[]) {
        super();
        this.tableName = 'allowed_projects_edited';
        this.data = member;
    }

    async add(): Promise<any> {
        const arrVal: any[] = [];
        let strValues = '';
        this.data.forEach((cur: any) => {
            const { id_project, id_user } = cur;
            arrVal.push(`(${Number(id_project)}, ${Number(id_user)})`);
        });
        strValues = arrVal.join(',');
        // return strValues;
        await this.query(`INSERT INTO public.${this.tableName} (id_project, id_user) VALUES ${strValues}`, []);


    }

    async removeByIdUser(idUser: any): Promise<any> {
        await this.query(`DELETE FROM public.${this.tableName} WHERE id_user = $1`, [Number(idUser)])
    }


}