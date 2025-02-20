import * as bcrypt from 'bcrypt';

export class PasswordUtil
{
    private static readonly _saltRounds = 10;
    static hash(password:string):string
    {
        return bcrypt.hashSync(password, this._saltRounds);
    }
    static compare(password?:string, hash?:string):boolean
    {
        return bcrypt.compareSync(password ||"", hash ||"" );
    }
}