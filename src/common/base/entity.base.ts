import {BaseEntity} from "typeorm";
import {instanceToPlain, plainToInstance} from "class-transformer";
import {Constructor, GetInstance} from "@/@types/common.type";

export class EntityBase extends  BaseEntity
{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    toJSON() {
        return instanceToPlain(this);
    }
    fromJSON(data: Record<string, any>) {
        Object.keys(data).forEach(key => {
            // @ts-ignore
            this[key] = data[key];
        });
    }

    // tôi muốn thêm hàm fromJSON vào class EntityBase khi các class khác kế thừa nó se có hàm này và trả về class đó
    static fromJSON<T extends Constructor<any>>(this: T, json: Record<string, any>): GetInstance<T> {
        return plainToInstance(this, json);
    }
}