import Member from "../models/Member";
import Objective from "../models/Objective";
import Project from "../models/Project";
import Product from "../models/Product";
import Role from "../models/Role";
import StatusObjective from "../models/StatusObjective";
import StatusProduct from "../models/StatusProduct";
import StatusProject from "../models/StatusProject";
import TypeObjective from "../models/TypeObjective";
import User from "../models/User";
import Auth from "../models/Auth";
import RoleProject from "../models/RoleProject";
import Permissions from "../models/Permissions";

const getFactory = () => {
    return {
        "projects": Project,
        "members": Member,
        "objectives": Objective,
        "products": Product,
        "roles": Role,
        "statuses_objectives": StatusObjective,
        "statuses_products": StatusProduct,
        "statuses_projects": StatusProject,
        "type_objective": TypeObjective,
        "userauth": User,
        "roles_project": RoleProject,
        "permissions": Permissions,
    };
}

export const add = async (req: any, res: any, next: any) => {
    const entity = req.params.entity;
    const body = req.body;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    console.log(body);
    Auth.checkToken(barer)
        .then(() => {
            let factory: any = getFactory();
            new factory[entity](body).add()
                .then((data: any) => {
                    res.json(data);
                })
                .catch((err: any) => {
                    console.log(err);
                    res.status(400).json({ message: `Не удалось доабвить строку в справочник - ${entity}` });
                })
        })
        .catch((er) => {
            console.log(er);
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: er.message });
        });
}


export const remove = async (req: any, res: any, next: any) => {
    const entity = req.params.entity;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    console.log(req.body);
    Auth.checkToken(barer)
        .then(() => {
            let factory: any = getFactory();
            new factory[entity]().remove(req.body)
                .then((data: any) => {
                    res.json(data);
                })
                .catch((er: any) => {
                    console.log(er);
                    res.status(400).json({ message: `Не удалось удалить строку из справочника - ${entity}` });
                })
        })
        .catch((er) => {
            console.log(er);
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: er.message });
        });
}

export const find = async (req: any, res: any, next: any) => {
    const entity = req.params.entity;
    const body = req.body;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });

    Auth.checkToken(barer)
        .then(() => {
            let factory: any = getFactory();
            new factory[entity]().find(body, barer)
                .then((data: any) => {
                    res.json(data);
                })
                .catch((er: any) => {
                    console.log(er);
                    res.status(400).json({ message: `Не удалось отфильтровать каталог ${entity}` });
                })
        })
        .catch((er) => {
            console.log(er);
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: er.message });
        });
}


export const update = async (req: any, res: any, next: any) => {
    const entity = req.params.entity;
    const id = req.params.id;
    const body = req.body;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });

    Auth.checkToken(barer)
        .then(() => {
            let factory: any = getFactory();
            new factory[entity](barer).update(body, Number(id))
                .then((data: any) => {
                    res.json(data);
                })
                .catch((er: any) => {
                    console.log(er);
                    res.status(400).json({ message: `Не удалось обновить строку из справочника - ${entity}` });
                })
        })
        .catch((er) => {
            console.log(er);
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: er.message });
        });
}

export const get = async (req: any, res: any, next: any) => {
    const entity = req.params.entity;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });

    Auth.checkToken(barer)
        .then(() => {

            let factory: any = getFactory();
            new factory[entity]().get(barer)
                .then((data: any) => {
                    res.json(data);
                })
                .catch(() => {
                    res.status(400).json({ message: `Не удалось получить справочник - ${entity}` });
                })
        })
        .catch((er) => {
            console.log(er);
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: er.message });
        });
}
