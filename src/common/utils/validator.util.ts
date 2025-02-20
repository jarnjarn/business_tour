import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {FormInstance} from "antd";

export class ValidatorUtil {
    static async validatorByClass<T>(target: InstanceType<any>, value: T,form:FormInstance): Promise<T> {
        const error = await validate(plainToInstance(target, value))
        const result:Array<{
            name:string;
            errors:string[];
        }> = [];
        for (const item of error) {
            // @ts-ignore
            result.push({
                name: item.property,
                // @ts-ignore
                errors: Object.values(item.constraints).values()[Symbol.iterator](),
            })
        }
        form.setFields(result)
        if (error.length == 0) {
            return Promise.resolve(value)
        }
        return Promise.reject(value)
    }
}