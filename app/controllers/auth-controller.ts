import Auth from "../models/Auth";
const bcrypt = require('bcryptjs');




/**
 * Овнолеие контактов пользователя
 * @param req 
 * @param res 
 * @param next 
 */
export const updateContacts = (req: any, res: any, next: any) => {
    const { contacts } = req.body;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    if (!contacts) res.status(400).json({ message: 'Не удалось обновить имя пользователя! не надйено имя' });
    Auth.updateContacts(contacts, barer)
        .then(() => {
            res.json({});
        })
        .catch(er => {
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: 'Не удалось обновить имя' });
        })
}


/**
 * Овнолеие отчества пользователя
 * @param req 
 * @param res 
 * @param next 
 */
export const secondName = (req: any, res: any, next: any) => {
    const { secondname } = req.body;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    if (!secondname) res.status(400).json({ message: 'Не удалось обновить имя пользователя! не надйено имя' });
    Auth.updateSecondName(secondname, barer)
        .then(() => {
            res.json({});
        })
        .catch(er => {
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: 'Не удалось обновить имя' });
        })
}


/**
 * Овнолеие фамилии пользователя
 * @param req 
 * @param res 
 * @param next 
 */
export const updateSername = (req: any, res: any, next: any) => {
    const { sername } = req.body;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    if (!sername) res.status(400).json({ message: 'Не удалось обновить имя пользователя! не надйено имя' });
    Auth.updateSername(sername, barer)
        .then(() => {
            res.json({});
        })
        .catch(er => {
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: 'Не удалось обновить имя' });
        })
}


/**
 * Овнолеие имени пользователя
 * @param req 
 * @param res 
 * @param next 
 */
export const updateName = (req: any, res: any, next: any) => {
    const { name } = req.body;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    if (!name) res.status(400).json({ message: 'Не удалось обновить имя пользователя! не надйено имя' });
    Auth.updateName(name, barer)
        .then(() => {
            res.json({});
        })
        .catch(er => {
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: 'Не удалось обновить имя' });
        })
}

/**
 * Овнолеие email пользователя
 * @param req 
 * @param res 
 * @param next 
 */
export const updateEmail = (req: any, res: any, next: any) => {
    const { email } = req.body;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    if (!email) res.status(400).json({ message: 'Не удалось обновить имя пользователя! не надйен email' });
    Auth.updateEmail(email, barer)
        .then(() => {
            res.json({});
        })
        .catch(er => {
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: 'Не удалось обновить email' });
        })
}

/**
 * Овнолеие пароля пользователя
 * @param req 
 * @param res 
 * @param next 
 */
export const updatePassword = (req: any, res: any, next: any) => {
    const { password } = req.body;
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    if (!password) res.status(400).json({ message: 'Не удалось обновить имя пользователя! не надйен пароль' });
    Auth.updatePassword(password, barer)
        .then(() => {
            res.json({});
        })
        .catch(er => {
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: 'Не удалось обновить email' });
        })
}



export const user = (req: any, res: any, next: any) => {
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    Auth.getUser(barer)
        .then((user: any) => {
            res.status(200).send(user);
        })
        .catch(er => {
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: 'Не удалось получить данные пользователя' });
        })
}



export const refresh = (req: any, res: any, next: any) => {
    const barer = 'authorization' in req.headers ? req.headers.authorization : null;
    if (!barer) res.status(401).json({ message: 'Не указана токен авторизации' });
    console.log(barer);
    Auth.getToken(barer)
        .then((token: any) => {
            res.status(200).send(token);
        })
        .catch(er => {
            console.log(er);
            if (er.message === 'jwt expired')
                res.status(401).json({ message: 'Токен авторизации истек' });
            else
                res.status(400).json({ message: 'Не удалось обновить токен' });
        })
}


/**
 * Проверка пароля
 * @param req 
 * @param res 
 * @param next 
 */
export const cehckPassword = (req: any, res: any, next: any) => {
    const { password, email } = req.body;
    Auth.selectByEmail(email)
        .catch(er => {
            console.log(er);
            res.status(400).json({ message: 'Не удалось найти учетную запись по указанному адресу электронной почты.' });
        })
        .then((user) => {
            if (user != null) {
                const passwordIsValid = bcrypt.compareSync(password, user.password);
                if (!passwordIsValid) {
                    res.status(400).send({ message: 'Некорректный пароль!', auth: false, token: null });
                } else {
                    res.json({});
                }
            } else {
                res.status(404).json({ message: 'Не удалось найти учетную запись по указанному адресу электронной почты.' });
            }
        })
}



/**
 * Регистрация
 * @param req 
 * @param res 
 * @param next 
 */
export const register = (req: any, res: any, next: any) => {
    let body = req.body;
    body.password = bcrypt.hashSync(body.password, 8);
    // console.log(body);
    Auth.insert(body)
        .then(() => {
            Auth.selectByEmail(body.login)
                .catch(er => {
                    res.status(400).json({ message: 'Не удалось найти учетную запись по указанному логину.' });
                })
                .then(async (user: any) => {
                    const token = await Auth.createToken(user.id, user.role, user.projects);
                    res.status(200).send({ auth: true, token: token, user: user });
                })
        })
        .catch(er => {
            console.log(er);
            res.status(400).json({ message: 'Ошибка создания аккаунта! Возможно такой email или телефон уже зарегистрирован' })
        })
}

/**
 * Авторизацяи
 * @param req 
 * @param res 
 * @param next 
 */
export const login = (req: any, res: any, next: any) => {
    const { password, login } = req.body;
    Auth.selectByEmail(login)
        .catch(er => {
            console.log(er);
            res.status(400).json({ message: 'Не удалось найти учетную запись по указанному логину.' });
        })
        .then(async (user) => {
            if (user != null) {
                const passwordIsValid = bcrypt.compareSync(password, user.password);
                if (!passwordIsValid) {
                    res.status(400).send({ message: 'Некорректный пароль!', auth: false, token: null });
                } else {
                    const token = await Auth.createToken(user.id, user.role, user.projects);
                    res.status(200).send({ auth: true, token: token, user: user });
                }
            } else {
                res.status(404).json({ message: 'Не удалось найти учетную запись по указанному логину.' });
            }
        })
};
