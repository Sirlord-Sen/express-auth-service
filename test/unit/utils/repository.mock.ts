export class RepositoryMock<T> {

    public one: T;

    public findOneMock = jest.fn();
    public findOneOrFailMock = jest.fn();
    public createMock = jest.fn();
    public updateMock = jest.fn();
    public saveMock = jest.fn();
    public mergeMock = jest.fn();

    public findOne(...args: any[]): Promise<T> {
        this.findOneMock(args);
        return Promise.resolve(this.one);
    }

    public findOneOrFail(...args: any[]): Promise<T>{
        this.findOneMock(args);
        return Promise.resolve(this.one);
    }

    public save(...args: any[]): Promise<T>{
        this.saveMock(args)
        return Promise.resolve(this.one);
    }
    

    public create(value: T, ...args: any[]): Promise<T> {
        this.createMock(value, args);
        return Promise.resolve(value);
    }

    public createEntity(value: T, ...args: any[]): Promise<T> {
        this.createMock(value, args);
        return Promise.resolve(value);
    }

    public update(value: T,...args: any[]): Promise<T>{
        this.updateMock(value, args);
        return Promise.resolve(value);
    }

    public updateEntity(value: T,...args: any[]): Promise<T>{
        this.updateMock(value, args);
        return Promise.resolve(value);
    }

}