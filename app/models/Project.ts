import Auth from "./Auth";
import Entity from "./Entiry";
import Member from "./Member";
import Objective from "./Objective";
import Product from "./Product";
import RoleProject from "./RoleProject";
import StatusObjective from "./StatusObjective";
import StatusProduct from "./StatusProduct";
import StatusProject from "./StatusProject";
import User from "./User";
const bcrypt = require('bcryptjs');

export default class Project extends Entity {

    constructor(project?: {
        title: string,
        description: string,
        solution_options: string,
        rationale_option: string,
        pbs: string,
        wbs: string,
        resources: string,
        risks: string,
        id_status: number,
        products_objectives: boolean,
        task_plan: boolean,
        rp_command_time: boolean,
        rp_resource: boolean,
        start_realization: boolean,
        date_initiation: string,
        date_start: string,
        date_completion: string,
        date_frozen: string,
        date_success: string,
        requirements_hr_addit_services: boolean,
        vital: boolean,
        id_custom: string,
    }) {
        super();
        this.tableName = 'projects';
        this.filterView = 'filter_projects';
        this.data = project;
    }

    async add(): Promise<any> {
        const {
            title,
            description,
            solution_options,
            rationale_option,
            pbs,
            wbs,
            resources,
            risks,
            id_status_project,
            products_objectives,
            task_plan,
            rp_command_time,
            rp_resource,
            start_realization,
            date_initiation,
            date_start,
            date_completion,
            date_frozen,
            date_success,
            id_custom
            // requirements_hr_addit_services,
            // vital
        } = this.data;
        // console.log(this.data);
        let newId = await this.query(`INSERT INTO public.${this.tableName} (
            title,
            description,
            solution_options,
            rationale_option,
            pbs,
            wbs,
            resources,
            risks,
            id_status_project,
            products_objectives,
            task_plan,
            rp_command_time,
            rp_resource,
            start_realization,
            date_initiation,
            date_start,
            date_completion,
            date_frozen,
            date_success,
            id_custom
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING id;`,
            [
                title,
                description,
                solution_options,
                rationale_option,
                pbs,
                wbs,
                resources,
                risks,
                Number(id_status_project),
                Boolean(products_objectives),
                Boolean(task_plan),
                Boolean(rp_command_time),
                Boolean(rp_resource),
                Boolean(start_realization),
                !date_initiation ? null : date_initiation,
                !date_start ? null : date_start,
                !date_completion ? null : date_completion,
                !date_frozen ? null : date_frozen,
                !date_success ? null : date_success,
                id_custom
                // requirements_hr_addit_services,
                // vital
            ]);
        newId = newId.rows[0].id;
        try {
            for (let item in this.data) {
                let curData = this.data[item];


                //Созане целей
                if (item.startsWith('objectives') && Array.isArray(curData)) {
                    curData = curData.filter((f: any) => !f.remove);
                    for (let i = 0; i < curData.length; i++) {
                        const curObjective = curData[i];
                        curObjective.id_project = newId; //присовили id проекта
                        curObjective.id_parent_objective = (curObjective.parent || curObjective.parent === 0) ? curData.find((ff: any) => ff.index === curObjective.parent).id : null;
                        curObjective.id_type_objective = curObjective.id_type_objective.id;
                        curObjective.id_status_objective = curObjective.id_status_objective.id;
                        console.log(curObjective);
                        curObjective.id = await new Objective(curObjective).add();
                    }
                }

                //Созане продуктов
                if (item.startsWith('products') && Array.isArray(curData)) {
                    curData = curData.filter((f: any) => !f.remove);
                    for (let i = 0; i < curData.length; i++) {
                        const curObjective = curData[i];
                        curObjective.id_project = newId; //присовили id проекта
                        curObjective.id_parent_product = (curObjective.parent || curObjective.parent === 0) ? curData.find((ff: any) => ff.index === curObjective.parent).id : null;
                        curObjective.id_status_product = curObjective.id_status_product.id;
                        console.log(curObjective);
                        curObjective.id = await new Product(curObjective).add();
                    }
                }

                //Созане учатсников
                if (item.startsWith('members') && Array.isArray(curData)) {
                    let memberWithBigRole = null;
                    for (let i = 0; i < curData.length; i++) {
                        const curMember = curData[i];
                        curMember.id_project = newId; //присовили id проекта
                        //TODO:: роли 
                        console.log(curMember);
                        //Если участник проекта есть в системе как пользователь то добавляем ему роль с большим приоритетом в проекте 
                        //мначе заводим его в системеи, а затем присваиваем ему роль с большим приоритетом в проекте
                        if (curMember.id_user < 0) {
                            curMember.password = bcrypt.hashSync('007', 8);
                            const newIDUSer = await new User(curMember).add();
                            curMember.id_user = newIDUSer;
                        }
                        //Проверяем - если это не копия учтаника с большой ролью то присваемваем ему роль
                        // if (curMember.login !== memberWithBigRole) {
                        await new Member(curMember).add();
                        // }
                        //Сохраняем логин устаника с высокой ролью
                        // if (curMember.roleProject === 'project_manager') {
                        //     memberWithBigRole = curMember.login;
                        // }

                    }
                }
                //Присваеиваем роль "Созатель проекта" тому, кто создал
                if (item === 'creator') {
                    const id_role_project = (await new RoleProject().getByName('creator')).id;
                    await new Member({ id_user: curData.id, id_project: newId, id_role_project: id_role_project, project_worker: '' }).add();
                }
            }

            return newId;
        } catch (er) {
            console.log('Ошбика создания проекта', er);
            await this.remove({ id: newId });
            throw Error();
        }
    }

    async update(data: any, id: number): Promise<any> {
        let setStr: any = [];
        //Обновление таблицы PROJECTS
        for (let prop in data) {
            const val = data[prop];
            if (!Array.isArray(val) && prop !== 'creator') {
                // if (!prop.startsWith('objectives') && !prop.startsWith('products') && !prop.startsWith('members')) {
                setStr.push(`${['from', 'to'].includes(prop) ? `"${prop}"` : prop}=${!['active', 'main', 'products_objectives', 'task_plan', 'rp_command_time', 'rp_resource', 'start_realization'].includes(prop) ? (!val ? null : `'${val}'`) : (!val && val !== false ? null : `'${val}'`)
                    } `);
                // }
            }
        }
        console.log('update', setStr);
        await this.query(`UPDATE public.${this.tableName} SET ${setStr} WHERE id = $1`, [Number(id)]);

        //Обновляем цели, продукты и участников проекта
        const allStatusesObjectives = (await new StatusObjective().get()).items;
        const allObjectivesBYProject = (await new Objective().getByProjectId(id)).items;

        const allStatusesProducts = (await new StatusProduct().get()).items;
        const allProductsBYProject = (await new Product().getByProjectId(id)).items;
        for (let item in data) {
            let curData = data[item];

            //Обновление целей
            if (item.startsWith('objectives') && Array.isArray(curData)) {
                //curData = curData.filter((f: any) => !f.remove);
                for (let i = 0; i < curData.length; i++) {
                    const curObjective = curData[i];
                    //Если цель уже есть в БД то обновляем ее иначе создаем новую
                    if (curObjective.id) {
                        //Проверка на удаление цели
                        const removed = curObjective.remove;
                        if (removed) {
                            //Если цель удалена, то проставляем статус "архив" 
                            curObjective.id_status_objective = allStatusesObjectives.find((f: any) => f.title.toLowerCase() === 'архив').id;
                            //+ удаляем ее как родителя в других целях в БД у этого проекта
                            //+ удаляем ее родителей
                            for (let o = 0; o < allObjectivesBYProject.length; o++) {
                                const curObjFromDB = allObjectivesBYProject[o];
                                if (curObjFromDB.id_parent_objective === curObjective.id) {
                                    await new Objective().update({ id_parent_objective: null }, curObjFromDB.id);
                                }
                            }
                            await new Objective().update({ id_parent_objective: null, id_status_objective: curObjective.id_status_objective }, curObjective.id);
                        } else {
                            curObjective.id_type_objective = curObjective.id_type_objective.id;
                            curObjective.id_status_objective = curObjective.id_status_objective.id;
                            curObjective.id_parent_objective = (curObjective.parent || curObjective.parent === 0) ? curData.find((ff: any) => ff.index === curObjective.parent).id : null;
                            await new Objective().update({
                                title: curObjective.title,
                                description: curObjective.description,
                                id_parent_objective: curObjective.id_parent_objective,
                                id_type_objective: curObjective.id_type_objective,
                                id_status_objective: curObjective.id_status_objective
                            }, curObjective.id)
                        }
                    } else {
                        const removed = curObjective.remove;
                        //Если цель удалена и ее нет в БД
                        if (!removed) {
                            curObjective.id_project = id; //присовили id проекта
                            curObjective.id_parent_objective = (curObjective.parent || curObjective.parent === 0) ? curData.find((ff: any) => ff.index === curObjective.parent).id : null;
                            curObjective.id_type_objective = curObjective.id_type_objective.id;
                            curObjective.id_status_objective = curObjective.id_status_objective.id;
                            console.log(curObjective);
                            curObjective.id = await new Objective(curObjective).add();
                        }
                    }
                }
            }


            //Обновление продуктов
            if (item.startsWith('products') && Array.isArray(curData)) {
                //curData = curData.filter((f: any) => !f.remove);
                for (let i = 0; i < curData.length; i++) {
                    const curProduct = curData[i];
                    //Если продукт уже есть в БД то обновляем ее иначе создаем новый
                    if (curProduct.id) {
                        //Проверка на удаление продукта
                        const removed = curProduct.remove;
                        if (removed) {
                            //Если продукт удален, то проставляем статус "архив" 
                            curProduct.id_status_product = allStatusesProducts.find((f: any) => f.title.toLowerCase() === 'архив').id;
                            //+ удаляем ее как родителя в других целях в БД у этого проекта
                            //+ удаляем ее родителей
                            for (let o = 0; o < allProductsBYProject.length; o++) {
                                const curProdFromDB = allProductsBYProject[o];
                                if (curProdFromDB.id_parent_product === curProduct.id) {
                                    await new Product().update({ id_parent_product: null }, curProdFromDB.id);
                                }
                            }
                            await new Product().update({ id_parent_product: null, id_status_product: curProduct.id_status_product }, curProduct.id);
                        } else {
                            curProduct.id_status_product = curProduct.id_status_product.id;
                            curProduct.id_parent_product = (curProduct.parent || curProduct.parent === 0) ? curData.find((ff: any) => ff.index === curProduct.parent).id : null;
                            await new Product().update({
                                title: curProduct.title,
                                description: curProduct.description,
                                id_parent_product: curProduct.id_parent_product,
                                id_status_product: curProduct.id_status_product,
                                finished_product: curProduct.finished_product,
                                date_create: curProduct.date_create,
                                date_completion: curProduct.date_completion,
                                date_frozen: curProduct.date_frozen,
                                main: curProduct.main
                            }, curProduct.id)
                        }
                    } else {
                        const removed = curProduct.remove;
                        //Если цель удалена и ее нет в БД
                        if (!removed) {
                            curProduct.id_project = id; //присовили id проекта
                            curProduct.id_parent_product = (curProduct.parent || curProduct.parent === 0) ? curData.find((ff: any) => ff.index === curProduct.parent).id : null;
                            curProduct.id_status_product = curProduct.id_status_product.id;
                            console.log(curProduct);
                            curProduct.id = await new Product(curProduct).add();
                        }
                    }
                }
            }


            //Обновление участников
            if (item.startsWith('members') && Array.isArray(curData)) {
                console.log('start update members');
                //Читим учтаников этого проекта КРОМЕ "CREATOR" и созаем по новой с новыми ролями
                await new Member().removeByIdProject(id);
                for (let i = 0; i < curData.length; i++) {
                    const curOMember = curData[i];
                    curOMember.id_project = id; //присовили id проекта
                    // if (curOMember.id_user < 0) {
                    //     curOMember.password = bcrypt.hashSync('007', 8);
                    //     const newIDUSer = await new User(curOMember).add();
                    //     curOMember.id_user = newIDUSer;
                    //     await new Member(curOMember).add();
                    // } else {
                    //     await new Member().updateByIdUserPeojectId({
                    //         id_role_project: curOMember.id_role_project,
                    //         project_worker: curOMember.project_worker,
                    //     }, curOMember.id_user, curOMember.id_project);
                    //     console.log({
                    //         id_role_project: curOMember.id_role_project,
                    //         project_worker: curOMember.project_worker,
                    //     }, curOMember.id_user, curOMember.id_project);
                    // }


                    if (curOMember.id_user < 0) {
                        curOMember.password = bcrypt.hashSync('007', 8);
                        const newIDUSer = await new User(curOMember).add();
                        curOMember.id_user = newIDUSer;
                    }
                    //Проверяем - если это не копия учтаника с большой ролью то присваемваем ему роль
                    // if (curMember.login !== memberWithBigRole) {
                    await new Member(curOMember).add();

                }
            }


        }
    }


    public async get(barer?: string): Promise<any> {
        return await this.find({ id: null, title: null }, barer);
    }


    async remove(id: any): Promise<any> {
        const draftStatusId = (await new StatusProject().getByTitle('архив')).id;
        await this.query(`UPDATE public.${this.tableName} SET id_status_project = ${draftStatusId} WHERE id in (${id.id})`, [])
    }


    async find(data: any, barer?: string): Promise<any> {
        const token = await Auth.checkToken(String(barer));
        //Если не админ то выводим только те проектсы котрые есть у текущего юзера
        console.log(token.role, 'projects from local storage', token.projects);
        if (token.role !== 'admin' && token.role !== 'limited_admin' && token.role !== 'advanced_reader') {
            //Если фильтр пуст то только подставляем те проектс ыоторые есть  уэтого юзера
            //Иначе проверяем его фильтр и если есть проекты которых нет в спсике бзера - исключаем иъ
            const idsPjcs = token.projects.map((_m: any) => String(_m.id));
            console.log(idsPjcs);
            data.id = data.id ? String(data.id).split(',').filter((_fp: any) => idsPjcs.includes(_fp)) : idsPjcs;
            data.id = data.id && data.id.length ? data.id : [-1];
            data.id = data.id.join(',');
        }


        let dataStr = [];
        // console.log(data);
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
            // console.log(dataStr);
        }
        let filteredData = (await this.query(`SELECT * FROM "public".${this.filterView} (${dataStr})`, [])).rows;
        return {
            info: {
                countRows: filteredData.length,
            },
            items: filteredData.map((_mp: any) => {
                return {
                    ..._mp,

                }
            }),
        }
    }


}