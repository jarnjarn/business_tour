import {EntityBase} from "@/common/base/entity.base";
import {FindOptionsWhere, Repository} from "typeorm";
import {ArrayKeyOf, Constructor} from "@/@types/common.type";
import {getDataSource} from "@/providers/database.provider";
import {AppConfig} from "@/common/config/app.config";
import {PaginationDto} from "@/common/dto/pagination.dto";
import {Pagination} from "@/common/struct/pagination.struct";


export function RepoBase<T extends EntityBase>(entity: Constructor<T>)
{
    return class RepoBase extends Repository<T>
    {
        static instance: InstanceType<typeof this>;
        static gI<T extends RepoBase>(this: new () => T): T
        {
            if (!this.prototype.instance)
            {
                this.prototype.instance = new this();
            }
            return this.prototype.instance;
        }
        constructor(...args: any[])
        {
            super(entity,getDataSource()!.createEntityManager());
            AppConfig.gI().set("repo_"+entity.name,this);
        }

        async paginate(dto:PaginationDto,keys:ArrayKeyOf<T>,where:FindOptionsWhere<T> = {})
        {
            let {page ,limit, query} = dto;
            if (!page) page = 1;
            if (!limit) limit = 10;
            if (!query) query = "";
            const skip = (page - 1) * limit;
            const take = limit;
            // remove all undefined value in where
            const newWhere = {};
            Object.keys(where).forEach(key => {
                // @ts-ignore
                if (where[key] !== undefined) {
                    // @ts-ignore
                    newWhere[key] = where[key];
                }
            });
            where = newWhere;
            let queryBuilder = this.createQueryBuilder();

            queryBuilder = queryBuilder.skip(skip).take(take);
            if (Object.keys(where).length > 0) {
                queryBuilder = queryBuilder.where(where);
            }
            if (keys.length > 0 && query !== "") {
                // query like by keys
                keys.forEach(key => {
                    queryBuilder = queryBuilder.orWhere(`${key.toString()} like :${key.toString()}`, { [key]: `%${query}%` });
                });
            }
            const [data,total] = await queryBuilder.getManyAndCount();
            return new Pagination(data,page,limit,total,query);
        }
    }
}