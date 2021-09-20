import Entity from "./Entiry";
import StatusProduct from "./StatusProduct";

export default class Product extends Entity {

    constructor(product?: {
        title: string,
        priority: number,
        main: boolean,
        description: string,
        id_project: number,
        id_parent_product: number,
        id_status_product: number,
        finished_product: string,
        date_create: number,
        date_completion: string,
        date_frozen: string
    }) {
        super();
        this.tableName = 'products';
        this.filterView = 'filter_products';
        this.data = product;
    }

    async add(): Promise<any> {
        const {
            title,
            priority,
            main,
            description,
            id_project,
            id_parent_product,
            id_status_product,
            finished_product,
            date_create,
            date_completion,
            date_frozen,
        } = this.data;
        let newId = await this.query(`INSERT INTO public.${this.tableName} (
            title,
            priority,
            main,
            description,
            id_project,
            id_parent_product,
            id_status_product,
            finished_product,
            date_create,
            date_completion,
            date_frozen
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id;`,
            [
                title,
                priority,
                Boolean(main),
                description,
                Number(id_project),
                id_parent_product,
                Number(id_status_product),
                finished_product,
                date_create,
                date_completion,
                date_frozen,
            ]);
        return newId.rows[0].id;
    }


    async remove(id: any): Promise<any> {
        const curerntProjectId = await this.getProjectIdByProduct(id.id);
        const allProductBYProject = (await this.getByProjectId(curerntProjectId)).items;
        const draftStatusId = (await new StatusProduct().getByTitle('архив')).id;

        for (let o = 0; o < allProductBYProject.length; o++) {
            const curPrcFromDB = allProductBYProject[o];
            if (curPrcFromDB.id_parent_product === Number(id.id)) {
                await this.update({ id_parent_product: null }, curPrcFromDB.id);
            }
        }
        await this.update({ id_parent_product: null, id_status_product: draftStatusId }, Number(id.id));

    }

    public async getProjectIdByProduct(idProduct: number): Promise<any> {
        return (await this.query(`SELECT * FROM public.${this.tableName} WHERE id = $1 ORDER BY id`, [Number(idProduct)])).rows[0].id_project;
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