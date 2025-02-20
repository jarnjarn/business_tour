export class NumberUtil
{
    static toIndex(_:any,__:any,index:number):number
    {
        return index+1;
    }

    static toMoney(data:number):string
    {
        return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}