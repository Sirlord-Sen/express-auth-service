export class RepositoryMock<T> {

    public one: T;

    public findMock = jest.fn();
    public findOneMock = jest.fn();
    public createMock = jest.fn();
    public deleteMock = jest.fn();

    public findOne(...args: any[]): Promise<T> {
        this.findOneMock(args);
        return Promise.resolve(this.one);
    }

    public create(value: T, ...args: any[]): Promise<T> {
        this.createMock(value, args);
        return Promise.resolve(value);
    }

    public delete(value: T, ...args: any[]): Promise<T> {
        this.deleteMock(value, args);
        return Promise.resolve(value);
    }

}