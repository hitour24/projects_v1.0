export interface IEntity {
    add(): Promise<any>;
    remove(id: number): Promise<any>;
    get(): Promise<any>;
    getById(id: number): Promise<any>;
    update(data: any, id: number): Promise<any>;
    find(data: any): Promise<any>;
}