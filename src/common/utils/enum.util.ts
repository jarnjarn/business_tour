export class EnumUtil
{
    static toArr<T>(e:T):T[]
    {
        return Object.entries(e as any).map(([k,v])=>v).filter(v=>typeof v === "number") as T[];
    }
}