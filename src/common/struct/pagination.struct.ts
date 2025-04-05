import {PaginationDto} from "@/common/dto/pagination.dto";

export class Pagination<T>
{
    data:T[];
    page:number;
    limit:number;
    total:number;
    query:string;
    dto:PaginationDto;

    constructor(data:T[], page:number, limit:number, total:number, query:string)
    {
        this.data = data;
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.query = query;
    }

    static from<T>(data:T[], page:number, limit:number, total:number, query:string)
    {
        return new Pagination(data, page, limit, total, query);
    }

}