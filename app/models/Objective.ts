import Entity from "./Entiry";
import StatusObjective from "./StatusObjective";

export default class Objective extends Entity {

    constructor(ojective?: {
        title: string,
        priority: number,
        description: string,
        id_project: number,
        id_type_objective: number,
        id_parent_objective: number,
        id_status_objective: number,
    }) {
        super();
        this.tableName = 'objectives';
        this.filterView = 'filter_objectives';
        this.data = ojective;
    }

    async add(): Promise<any> {
        const {
            title,
            priority,
            description,
            id_project,
            id_type_objective,
            id_parent_objective,
            id_status_objective,
        } = this.data;
        let newId = await this.query(`INSERT INTO public.${this.tableName} (
            title,
            priority,
            description,
            id_project,
            id_type_objective,
            id_parent_objective,
            id_status_objective
            ) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id;`,
            [
                title,
                priority,
                description,
                Number(id_project),
                Number(id_type_objective),
                id_parent_objective,
                Number(id_status_objective),
            ]);
        return newId.rows[0].id;
    }


    async remove(id: any): Promise<any> {
        const curerntProjectId = await this.getProjectIdByObjective(id.id);
        const allObjectivesBYProject = (await this.getByProjectId(curerntProjectId)).items;
        const draftStatusId = (await new StatusObjective().getByTitle('архив')).id;

        for (let o = 0; o < allObjectivesBYProject.length; o++) {
            const curObjFromDB = allObjectivesBYProject[o];
            if (curObjFromDB.id_parent_objective === Number(id.id)) {
                await this.update({ id_parent_objective: null }, curObjFromDB.id);
            }
        }
        await this.update({ id_parent_objective: null, id_status_objective: draftStatusId }, Number(id.id));


        //     await this.query(`DELETE FROM public.${this.tableName} WHERE id in (${id.id})`, [])
    }

    public async getProjectIdByObjective(idObjective: number): Promise<any> {
        return (await this.query(`SELECT * FROM public.${this.tableName} WHERE id = $1 ORDER BY id`, [Number(idObjective)])).rows[0].id_project;
    }


    public async getByProjectId(idProject: number): Promise<any> {
        let listData = (await this.query(`SELECT * FROM public.${this.tableName} WHERE id_project = $1 ORDER BY id`, [Number(idProject)])).rows;
        return {
            info: {
                countRows: listData.length,
            },
            items: listData,
        }
    }

}