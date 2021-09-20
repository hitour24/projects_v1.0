import Entity from "./Entiry";
import RoleProject from "./RoleProject";

export default class Member extends Entity {

    constructor(member?: {
        id_project: number,
        id_role_project: number,
        id_user: number,
        project_worker: string,
    }) {
        super();
        this.tableName = 'members';
        this.data = member;
    }

    async add(): Promise<any> {
        const {
            id_project,
            id_role_project,
            id_user,
            project_worker,
        } = this.data;
        let newId = await this.query(`INSERT INTO public.${this.tableName} (
            id_project,
            id_role_project,
            id_user,
            project_worker
            ) VALUES ($1,$2,$3,$4) RETURNING id;`,
            [
                id_project,
                id_role_project,
                id_user,
                project_worker
            ]);
        return newId.rows[0].id;
    }


    async updateByIdUserPeojectId(data: any, idUser: number, idProject: number): Promise<any> {
        let setStr: any = [];
        for (let prop in data) {
            const val = data[prop];
            setStr.push(`${prop === 'from' || prop === 'to' ? `"${prop}"` : prop}=${prop !== 'active' && prop !== 'main' ? (!val ? null : `'${val}'`) : (!val && val !== false ? null : `'${val}'`)
                }`);
        }
        console.log('update', setStr);
        await this.query(`UPDATE public.${this.tableName} SET ${setStr} WHERE id_user = $1 AND id_project = $2`, [Number(idUser), Number(idProject)]);
    }


    async removeByIdProject(idProject: any): Promise<any> {
        const id_role_project = (await new RoleProject().getByName('creator')).id;
        await this.query(`DELETE FROM public.${this.tableName} WHERE id_project = $1 AND id_role_project <> $2`, [Number(idProject), Number(id_role_project)])
    }

}