import { IEntity } from "./interfaces/IEntity";
import DB from "./db";

export default class Entity implements IEntity {
    protected tableName: string = '';
    protected filterView: string = '';
    protected data: any = '';

    constructor() {

    }
    protected async query(query: string, data: any[]): Promise<any> {
        return await await DB.executeQuery(query, data);
    }
    async update(data: any, id: number): Promise<any> {
        let setStr: any = [];
        for (let prop in data) {
            const val = data[prop];
            setStr.push(`${prop === 'from' || prop === 'to' ? `"${prop}"` : prop}=${prop !== 'active' && prop !== 'main' ? (!val ? null : `'${val}'`) : (!val && val !== false ? null : `'${val}'`)
                }`);
        }
        console.log('update', setStr);
        await this.query(`UPDATE public.${this.tableName} SET ${setStr} WHERE id = $1`, [Number(id)]);
    }
    async add(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async remove(id: any): Promise<any> {
        await this.query(`DELETE FROM public.${this.tableName} WHERE id in (${id.id})`, [])
    }

    public async get(): Promise<any> {
        let listData = (await this.query(`SELECT * FROM public.${this.tableName} ORDER BY id`, [])).rows;
        return {
            info: {
                countRows: listData.length,
            },
            items: listData,
        }
    }


    public async getById(id: number): Promise<any> {
        return (await this.query(`SELECT * FROM public.${this.tableName} WHERE id = $1`, [Number(id)])).rows[0];
    }

    async find(data: any): Promise<any> {
        let dataStr = [];
        console.log(data);
        for (let pr in data) {
            let curr = data[pr];
            if (pr === 'coins') {
                curr = (curr === 'null' || !curr || curr === '' ? "null" : `'{${curr.split(', ').map((m: any) => `"${m}"`).join(', ')}}'`);
            } else if (pr === 'from') {
                curr = (curr === 'null' || !curr || curr === '' ? "null" : `'{${curr.map((m: any) => `"${m}"`).join(', ')}}'`);
            } else if (pr === 'active') {
                curr = (curr === 'null' || curr === null || curr === '' ? "null" : curr);
            } else {
                curr = (curr === 'null' || !curr || curr === '' ? "null" : `'${curr}'`);
            }
            dataStr.push(curr);
            console.log(dataStr);
        }
        let filteredData = (await this.query(`SELECT * FROM "public".${this.filterView} (${dataStr})`, [])).rows;
        return {
            info: {
                countRows: filteredData.length,
            },
            items: filteredData,
        }
    }

}