import {AxiosInstance} from "axios";
import {PaginationDto} from "@/common/dto/pagination.dto";
import type {Pagination} from "@/common/struct/pagination.struct";

export function RestBase<T>(axios:AxiosInstance,path:string)
{
    return class RestBase
    {
        protected axios:AxiosInstance;
        static instance: InstanceType<typeof this>;
        static gI<T extends RestBase>(this: new () => T): T
        {
            if (!this.prototype.instance)
            {
                this.prototype.instance = new this();
            }
            return this.prototype.instance;
        }
        constructor()
        {
            this.axios = axios;
        }
        public async get(id:string):Promise<T>
        {
            return await this.axios.get(`/api${path.startsWith("/") ? path:`/${path}`}/${id}`);
        }
        public async list():Promise<T[]>
        {
            return await this.axios.get(`/api${path.startsWith("/") ? path:`/${path}`}/list`);
        }
        public async create(data:Record<string, any>):Promise<T>
        {
            return await this.axios.post(`/api${path.startsWith("/") ? path:`/${path}`}`,data);
        }
        public async update(id:string,data:Record<string, any>):Promise<T>
        {
            return await this.axios.put(`/api${path.startsWith("/") ? path:`/${path}`}/${id}`,data);
        }
        public async delete(id:string):Promise<T>
        {
            return await this.axios.delete(`/api${path.startsWith("/") ? path:`/${path}`}/${id}`);
        }
        public async paginate(query:Partial<PaginationDto> & Record<string, any>):Promise<Pagination<T>>
        {
            return await this.axios.get(`/api${path.startsWith("/") ? path:`/${path}`}/`,{
                params:query
            });
        }
    }
}