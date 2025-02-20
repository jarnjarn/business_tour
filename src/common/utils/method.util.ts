import {ValidateErrorEntity} from "rc-field-form/lib/interface";
import {message} from "antd";

export class MethodUtil{
    static delay(ms:number)
    {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    static alert(errorEntity:ValidateErrorEntity)
    {
        for (const key of errorEntity.errorFields) {
            if (key.errors.length > 0) {
                message.error(key.errors[0]);
                break;
            }
        }
    }
}