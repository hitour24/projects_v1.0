
import { idText } from "typescript";
import DB from "./db";
import User from "./User";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

export default class Auth {


    /**
     * Подготовка паролья дя записи в БД
     * @param password 
     * @returns 
     */
    static async preparePassword(password: string): Promise<string> {
        return bcrypt.hashSync(password, 8);
    }

    /**
     * Создание токена авторищации
     * @param id 
     */
    static async createToken(id: number, role: string = 'user', projects: any): Promise<any> {
        console.log(role);
        return await jwt.sign({ id: id, role: role, projects: projects }, 'applicationsecret', {
            expiresIn: role === 'admin' ? 31536000 : 1800
        });
    }


    /**
     * Првоерка токена авторищации
     * @param barer 
     */
    static async checkToken(barer: string): Promise<any> {
        let token: any = barer.split('Bearer ')[1];
        return await jwt.verify(token, 'applicationsecret');
    }

    /**
     * Плучение данных юзера
     * @param token 
     */
    static async getUser(barer: string): Promise<any> {
        const token = await this.checkToken(barer);
        const user = await this.selectById(token.id);
        return user;
    }

    /**
     * Плучени нового токена
     * @param token 
     */
    static async getToken(barer: string): Promise<any> {
        const token = await this.checkToken(barer);
        const user = await this.selectById(token.id);
        const newToken = await this.createToken(user.id, user.role, user.projects);
        return { token: newToken };
    }

    /**
 * Обвноление пароля в БД
 * @param password
 */
    static async updatePassword(password: string, barer: string): Promise<any> {
        const token = await this.checkToken(barer);
        const newPassword = bcrypt.hashSync(password, 8);;
        await new User().update({ password: newPassword }, token.id);
        return true;
    }


    /**
     * Обвноление имени в БД
     * @param name
     */
    static async updateName(name: string, barer: string): Promise<any> {
        const token = await this.checkToken(barer);
        await new User().update({ name: name }, token.id);
        return true;
    }




    /**
     * Обвноление контактов в БД
     * @param name
     */
    static async updateContacts(contacts: string, barer: string): Promise<any> {
        const token = await this.checkToken(barer);
        await new User().update({ contacts: contacts }, token.id);
        return true;
    }

    /**
      * Обвноление фамилии в БД
      * @param name
      */
    static async updateSername(sername: string, barer: string): Promise<any> {
        const token = await this.checkToken(barer);
        await new User().update({ sername: sername }, token.id);
        return true;
    }


    /**
     * Обвноление отчества в БД
     * @param name
     */
    static async updateSecondName(secondname: string, barer: string): Promise<any> {
        const token = await this.checkToken(barer);
        console.log(secondname);
        await new User().update({ secondname: secondname }, token.id);
        return true;
    }




    /**
    * Обвноление email в БД
    * @param email 
    */
    static async updateEmail(email: string, barer: string): Promise<any> {
        const token = await this.checkToken(barer);
        await new User().update({ login: email }, token.id);
        return true;
    }



    /**
  * Обвноление id_contact в БД
  * @param contactId 
  */
    static async updateIdContact(contactId: number, id: number): Promise<any> {
        //const token = await this.checkToken(barer);
        await DB.executeQuery('UPDATE public.userauth SET id_contact = $1 WHERE id = $2', [Number(contactId), Number(id)]);
        return true;
    }

    /**
     * Запись хера в БД
     * @param user 
     */
    static async insert(user: { name: string, sername: string, secondname: string, login: string, password: string, id_role: number, contacts: string }): Promise<any> {
        const newId = new User(user).add();
        return newId;
    }

    /**
    * ПОлчение бзера по id_contact
    * @param idContact 
    */
    static async selectByIdContact(idContact: number): Promise<any> {
        const isValid = typeof idContact === "number";
        if (!isValid) return null;
        let user = await DB.executeQuery(`SELECT * FROM public.full_usersauth WHERE id_contact = $1`, [Number(idContact)]);
        user = ('rows' in user) ? (user.rows.length > 0 ? user.rows[0] : null) : null;
        if (user)
            user.name = encodeURIComponent(user.name);
        return user;
    }


    /**
     * ПРоверка существования юзера в БД
     * @param loginVariations 
     */
    static async checkExistUser(loginVariations: string[]): Promise<any> {
        for (let i = 0; i < loginVariations.length; i++) {
            const current = loginVariations[i];
            console.log(current);
            let user = await DB.executeQuery(`SELECT * FROM public.full_usersauth WHERE login = $1`, [String(current)]);
            user = ('rows' in user) ? (user.rows.length > 0 ? user.rows[0] : null) : null;
            if (user) return user;
        }
        return false;
    }


    /**
     * ПОлчение бзера по emali
     * @param login 
     */
    static async selectByEmail(login: any): Promise<any> {
        const isValid = typeof login === "string";
        if (!isValid) return null;
        let user = await new User().getByLogin(login);
        if (user)
            user.name = encodeURIComponent(user.name);
        return user;
    }


    /**
    * ПОлчение бзера по id
    * @param id 
    */
    static async selectById(id: number): Promise<any> {
        const isValid = typeof id === "number";
        if (!isValid) return null;
        let user = await new User().getById(id);
        // console.log(user);
        // user = ('rows' in user) ? (user.rows.length > 0 ? user.rows[0] : null) : null;
        if (user)
            user.name = encodeURIComponent(user.name);
        return user;
    }


    /**
    * ПОлчение бзера по client_id
    * @param id 
    */
    static async selectByContactId(contactId: number): Promise<any> {
        const isValid = typeof contactId === "number";
        if (!isValid) return null;
        let user = await DB.executeQuery(`SELECT * FROM public.full_usersauth WHERE id_contact = $1`, [Number(contactId)]);
        user = ('rows' in user) ? (user.rows.length > 0 ? user.rows[0] : null) : null;
        return user;
    }
}