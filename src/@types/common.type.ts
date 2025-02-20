import {NextRequest} from "next/server";

export type Constructor<T> = new (...args: any[]) => T;
export type GetInstance<T extends Constructor<any>> = T extends Constructor<infer R> ? R : never;
export type PageProps<T> = { params: T , searchParams?:  Record<string, any>,}

export type IParams = {
    name: string;
    index: number;
    key: string;
    in: string;
    type: string;
    required:boolean;
    paramSchema: any;
    transform: (value: any) => any;
    cb?:(req:NextRequest)=>any;
}
export type IHandler =  {
    method: string;
    path: string;
    key: string;
    handler: Function;
}
export type IPathMeta = {
    path: string;
    method: string;
    tags: string[];
    summary: string;
    isAuth?: boolean;
    parameters: IParameter[];
    requestBody: any;
}
export type IControllerDetail = {
    tag: {
        name: string;
        description: string;
    },
    paths:Array<IPathMeta>;
}

export type IControllerMeta = {
    META:()=>IControllerDetail
}


export type IMiddleware = {
    (req: NextRequest & Record<string, any>): void;
}

export type ArrayKeyOf<T> = Array<keyof T>;

export type MapLevel3s = {
    level3_id: string;
    level2_id: string;
    level1_id: string;
    lati:string;
    long:string;
    name: string;
    type: string;
};
export type MapLevel2s = {
    level2_id: string;
    level1_id: string;
    name: string;
    type: string;
    level3s: MapLevel3s[];
};
export type MapLevel1s = {
    level1_id: string;
    name: string;
    type: string;
    short_name: string;
    level2s: MapLevel2s[];
};

export type ResultType<T extends (...args: any) => any > = ReturnType<T> extends Promise<infer R> ? Promise<R> : Promise<ReturnType<T>>;
export type LocationType = {
    lat: number;
    lng: number;
}

export type IOptionProperty = {
    description?: string;
    required?: boolean;
    type?: any;
    isArray?: boolean;
    enum?: any[];
    default?: any;
    example?: any;
}

export type IOption = {
    [key: string]: IOptionProperty;
}

export type IParameter = {
    name: string;
    required: boolean;
    in: "query" | "path" | "header" | "cookie" | "body";
    schema: Partial<{
        type: string;
        items: {
            type: string;
        },
        isArray: boolean;
        $ref: string;
    }>
}