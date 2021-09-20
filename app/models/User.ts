import Entity from "./Entiry";
import Permissions from "./Permissions";
import Role from "./Role";
const bcrypt = require('bcryptjs');

export default class User extends Entity {
    private filterVieewGroup: any = 'filter_users_group';
    private filterVieewGroupAuth: any = 'filter_users_group_auth';

    constructor(user?: {
        name: string,
        sername: string,
        secondname: string,
        login: string,
        password: string,
        id_role: number,
        contacts: string
    }) {
        super();
        this.tableName = 'userauth';
        this.filterView = 'filter_users_group';
        this.data = user;
    }

    async add(): Promise<any> {
        this.data.id_role = !this.data.id_role ? (await new Role().getByName('member')).id : this.data.id_role;
        this.data.password = !this.data.password ? bcrypt.hashSync('007', 8) : this.data.password;
        const {
            name,
            sername,
            secondname,
            login,
            password,
            id_role,
            contacts
        } = this.data;
        let newId = await this.query(`INSERT INTO public.${this.tableName} (
            name,
            sername,
            secondname,
            login,
            password,
            id_role,
            contacts
            ) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id;`,
            [
                name,
                sername,
                secondname,
                login,
                password,
                Number(id_role),
                contacts
            ]);

        newId = newId.rows[0].id;;
        if (this.data.projects && this.data.projects.length)
            await new Permissions(this.data.projects.map((mp: any) => { return { id_project: mp.id, id_user: newId } })).add();
        return newId;
    }

    public async getById(id: number): Promise<any> {
        return (await this.query(`SELECT * FROM public.${this.filterVieewGroupAuth}(null,null,null,null,null,null,$1)`, [Number(id)])).rows[0];
    }


    public async getByLogin(login: string): Promise<any> {
        return (await this.query(`SELECT * FROM public.${this.filterVieewGroupAuth}($1,null,null,null,null,null,null)`, [login])).rows[0];
    }


    public async get(): Promise<any> {
        let listData = (await this.query(`SELECT * FROM public.${this.filterVieewGroup}(null,null,null,null,null,null,null)`, [])).rows;
        return {
            info: {
                countRows: listData.length,
            },
            items: listData,
        }
    }


    async update(data: any, id: number): Promise<any> {
        console.log(data, id);
        let setStr: any = [];
        for (let prop in data) {
            if (!['projects', 'permissions'].includes(prop)) {
                const val = data[prop];
                setStr.push(`${prop === 'from' || prop === 'to' ? `"${prop}"` : prop}=${prop !== 'active' && prop !== 'main' ? (!val ? null : `'${val}'`) : (!val && val !== false ? null : `'${val}'`)
                    }`);
            }
        }
        console.log('update', setStr);
        await this.query(`UPDATE public.${this.tableName} SET ${setStr} WHERE id = $1`, [Number(id)]);

        // Удаляем все разрещенные проекты у текущего юзера
        await new Permissions().removeByIdUser(id);
        // Добавляем новые разрешенные проекты
        if (data.projects.length)
            await new Permissions(data.projects.map((mp: any) => { return { id_project: mp.id, id_user: id } })).add();

    }

}