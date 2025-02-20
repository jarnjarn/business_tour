import {IHandler, IParams} from "@/@types/common.type";
import {NextRequest, NextResponse} from "next/server";
import {DatabaseProvider, InitializeDatabase} from "@/providers/database.provider";
import {ConstantConfig} from "@/common/config/constant.config";
import {pathToRegexp} from "path-to-regexp";
import {ValidationError} from "class-validator";
import {ApiException} from "@/common/error/api.exception";
import {User} from "@/entities/user.entity";
import {StringUtil} from "@/common/utils/string.util";

export function ControllerBase() {
    return class ControllerBase {
        protected readonly request:NextRequest & Record<string, any>;
        protected readonly user:User;
        static gI<T extends ControllerBase>(this: new () => T) {
            const initialize = async (method:string,req:NextRequest) => {
                await InitializeDatabase();
                const controllerPrefix = Reflect.getMetadata(ConstantConfig.REQUEST_CONTROLLER, this) || "";
                const listMethod = Reflect.getMetadata(ConstantConfig.REQUEST_METHOD, this.prototype) || [];
                const listParams = Reflect.getMetadata(ConstantConfig.REQUEST_PARAMS, this.prototype) || [];
                const listMiddleware = Reflect.getMetadata(ConstantConfig.REQUEST_MIDDLEWARE, this) || [];
                const middlewareHandler = Reflect.getMetadata(ConstantConfig.REQUEST_MIDDLEWARE_HANDLER, this.prototype) || [];
                const handler = listMethod.find((item: IHandler) => {
                    return pathToRegexp(controllerPrefix.toString()+(item.path==="/"? "":item.path) ).test(req.nextUrl.pathname) && item.method === method;
                });
                return {listMethod,listMiddleware,middlewareHandler, listParams, handler:{...handler,path:controllerPrefix+handler?.path ||""}};
            }
            const notFound = (req: NextRequest) => {
                return NextResponse.json({
                    error: "Not Found",
                    method: req.method,
                    status: 404,
                    path: req.nextUrl.pathname
                });
            }
            const paramsType = (listParams:Array<IParams>,handler:IHandler,type:string) => {
                return (Array.from(listParams).filter((item: any) => item.key === handler.key && item.type ==type) || []) as Array<IParams> ;
            }
            const catchException = ( e: Error|ValidationError|ValidationError[]) => {
                try {
                    if (e instanceof ValidationError || (Array.isArray(e) && e[0] instanceof ValidationError)) {
                        if (Array.isArray(e)) {
                            return NextResponse.json({
                                errors: e.map((item) => {
                                    return {
                                        field: item.property,
                                        constraints: Object.keys((item?.constraints as any) ||[]).map((key) => {
                                            return (item.constraints as any)[key]
                                        }),
                                        children: item.children?.map((child) => {
                                            return {
                                                field: child.property,
                                                constraints: Object.keys((child?.constraints as any) ||[]).map((key) => {
                                                    return (child.constraints as any)[key]
                                                })
                                            }
                                        })
                                    }
                                }),
                            })
                        }
                    }
                    if (e instanceof ApiException) {
                        return NextResponse.json({
                            message: e.message,
                            status: e.status,
                            code: e.code
                        },{
                            status:e.status
                        });
                    }
                    return NextResponse.json({
                        error: "Internal Server Error",
                        status: 500,
                        message: e
                    });
                }
                catch (e) {
                    return NextResponse.json({
                        error: "Internal Server Error",
                        status: 500,
                        message: e
                    });
                }
            }

            const paramFilter = (paramsFilter:Array<IParams>,handler:IHandler,req:NextRequest,arrayParams:Array<any>) =>{
                if (paramsFilter.length > 0) {
                    const params:Record<string, any> = {};
                    const regexp = pathToRegexp(handler.path)
                    const result = regexp.exec(req.nextUrl.pathname);
                    if (result) {
                        const keys = regexp.keys;
                        keys.forEach((key, index) => {
                            // @ts-ignore
                            params[key.name] = result[index + 1];
                        });
                    }
                    paramsFilter.forEach((item) => {
                        if (item.type === 'path') {
                            if (item.name) {
                                arrayParams[item.index] = item.transform(params[item.name]);
                            }
                            else {
                                // @ts-ignore
                                arrayParams[item.index] = item.transform(params);
                            }
                        }
                    });
                }
                return arrayParams;
            }
            const queryFilter = (queryArrFilter:Array<IParams>,handle:IHandler,req:NextRequest,arrayParams:Array<any>)=>{
                if (queryArrFilter.length > 0) {
                    const queryRecord:Record<string, any> = {}
                    req.nextUrl.searchParams.forEach((value, key) => {
                        queryRecord[key] = value;
                    });
                    queryArrFilter.forEach((item) => {
                        if (item.name) {
                            arrayParams[item.index] = item.transform(queryRecord[item.name]);
                        }
                        else {
                            arrayParams[item.index] = item.transform(queryRecord);
                        }
                    });
                }
                return arrayParams;
            }

            const headersFilter = (headerFilter:Array<IParams>,req:NextRequest,arrayParams:Array<any>)=>{
                if (headerFilter.length > 0) {
                    const headerRecord:Record<string, any> = {}
                    req.headers.forEach((value, key) => {
                        headerRecord[key] = value;
                    });
                    headerFilter.forEach((item) => {
                        if (item.name) {
                            arrayParams[item.index] = item.transform(headerRecord[item.name]);
                        }
                        else {
                            arrayParams[item.index] = item.transform(headerRecord);
                        }
                    });
                }
                return arrayParams;
            }
            const cookieFilters = (cookieFilter:Array<IParams>,req:NextRequest,arrayParams:Array<any>)=>{
                if (cookieFilter.length > 0) {
                    const cookieRecord:Record<string, any> = {}
                    const cookies = req.cookies.getAll();
                    cookies.forEach((value, key) => {
                        cookieRecord[value.name] = value.value;
                    });
                    cookieFilter.forEach((item) => {
                        if (item.name) {
                            arrayParams[item.index] = item.transform(cookieRecord[item.name]);
                        }
                        else {
                            arrayParams[item.index] = item.transform(cookieRecord);
                        }
                    });
                }
                return arrayParams;
            }
            const bodyFilters = async (bodyFilter:Array<IParams>,req:NextRequest,arrayParams:Array<any>)=>{
                let bodyRecord = {};
                if (bodyFilter.length > 0) {
                    // check content-type
                    const contentType = req.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        bodyRecord = await req.json();
                        bodyFilter.forEach((item) => {
                            if (item.name) {
                                // @ts-ignore
                                arrayParams[item.index] = item.transform(bodyRecord[item.name]);
                            }
                            else {
                                arrayParams[item.index] = item.transform(bodyRecord);
                            }
                        });
                    }
                    else {
                        const formData = await req.formData()
                        // @ts-ignore
                        for (const [key, value] of formData.entries()) {
                            // @ts-ignore
                            bodyRecord[key] = value;
                        }
                        bodyFilter.forEach((item) => {
                            if (item.name) {
                                // @ts-ignore
                                arrayParams[item.index] = item.transform(bodyRecord.get(item.name));
                            }
                            else {
                                arrayParams[item.index] = item.transform(bodyRecord);
                            }
                        });
                    }

                }
                return arrayParams;
            }

            const validateToken = async (req:NextRequest & Record<string, any>,handler:IHandler) => {
                const isPublic = Reflect.getMetadata(ConstantConfig.REQUEST_PUBLIC, this) || Reflect.getMetadata(ConstantConfig.REQUEST_PUBLIC, this.prototype,handler.key) || false;
                if (isPublic) {
                    return;
                }
                const token = StringUtil.extractToken(req);
                if (!token)
                {
                    throw ApiException.TOKEN_INVALID;
                }
                try {
                    const payload = StringUtil.verifyToken(token);
                    req["user"] = payload;
                }
                catch (e)
                {
                    throw ApiException.TOKEN_INVALID;
                }
            }

            const validateUser = async (req:NextRequest & Record<string, any>,handler:IHandler) => {
                const isPublic = Reflect.getMetadata(ConstantConfig.REQUEST_PUBLIC, this) || Reflect.getMetadata(ConstantConfig.REQUEST_PUBLIC, this.prototype,handler.key) || false;
                if (isPublic) {
                    return;
                }
                if (!req.user)
                {
                    throw ApiException.TOKEN_INVALID;
                }
                const user = await User.findOneBy({id:req.user.id});
                if (!user)
                {
                    throw ApiException.TOKEN_INVALID;
                }
                req["user"] = user;
            }

            const validateRoles = async (req:NextRequest & Record<string, any>,handler:IHandler) => {
                const isPublic = Reflect.getMetadata(ConstantConfig.REQUEST_PUBLIC, this) || Reflect.getMetadata(ConstantConfig.REQUEST_PUBLIC, this.prototype,handler.key) || false;
                if (isPublic) {
                    return;
                }
                const roles = Reflect.getMetadata(ConstantConfig.REQUEST_ROLES, this) || Reflect.getMetadata(ConstantConfig.REQUEST_ROLES, this.prototype,handler.key) || [];
                if (roles.length > 0)
                {
                    if (!req.user)
                    {
                        throw ApiException.TOKEN_INVALID;
                    }
                    const user = req?.user as User;
                    if (!user)
                    {
                        throw ApiException.TOKEN_INVALID;
                    }
                    if (!roles.includes(user?.role))
                    {
                        throw ApiException.FORBIDDEN;
                    }
                }
            }


            const handler = async (req: NextRequest & Record<string, any>, method: string) => {
                try {
                    return DatabaseProvider(async () => {
                        let {listParams,handler,listMiddleware,middlewareHandler} = await initialize(method,req);
                        if (handler && handler.handler) {
                            for (let i = 0; i < listMiddleware.length; i++) {
                                await listMiddleware[i](req);
                            }
                            for (let i = 0; i < middlewareHandler.length; i++) {
                                if (middlewareHandler[i].key === handler.key) {
                                    for (let j = 0; j < middlewareHandler[i].handler.length; j++) {
                                        await middlewareHandler[i].handler[j](req);
                                    }
                                }
                            }
                            await validateToken(req,handler);
                            await validateUser(req,handler);
                            await validateRoles(req,handler);
                            const paramsLength = handler.handler.length;
                            let arrayParams = Array.from({length: paramsLength}, (v, k) => null);
                            const paramsFilter = paramsType(listParams,handler,'path');
                            arrayParams = paramFilter(paramsFilter,handler,req,arrayParams);
                            const queryArrayFilter = paramsType(listParams,handler,'query');
                            arrayParams = queryFilter(queryArrayFilter,handler,req,arrayParams);
                            const headerFilter = paramsType(listParams,handler,'header');
                            arrayParams = headersFilter(headerFilter,req,arrayParams);
                            const cookieFilter = paramsType(listParams,handler,'cookie');
                            arrayParams = cookieFilters(cookieFilter,req,arrayParams);
                            const bodyFilter = paramsType(listParams,handler,'body');
                            arrayParams = await bodyFilters(bodyFilter,req,arrayParams);
                            const customFilter = paramsType(listParams,handler,'custom');
                            customFilter.forEach((item) => {
                                if (item?.cb) {
                                    arrayParams[item.index] = item.cb(req);
                                }
                            });
                            if (!this.prototype.instance) {
                                this.prototype.instance = new this();
                            }
                            try {

                                return await handler.handler.apply({
                                    request: req,
                                    user: req?.user || null,
                                    ...this.prototype.instance
                                }, arrayParams);
                            }
                            catch (e) {
                                throw e;
                            }
                        }
                    },catchException);

                    return notFound(req);
                }
                catch (e) {

                    return catchException(e as unknown as Error);
                }
            }
            return {
                GET: async (req: NextRequest) => {
                    return handler(req, "GET");
                },
                POST: (req: NextRequest) => {
                    return handler(req, "POST");
                },
                PUT: (req: NextRequest) => {
                    return handler(req, "PUT");
                },
                DELETE: (req: NextRequest) => {
                    return handler(req, "DELETE");
                },
                META: () =>
                {
                    const controllerPrefix = Reflect.getMetadata(ConstantConfig.REQUEST_CONTROLLER, this) || "";
                    const listMethod = Reflect.getMetadata(ConstantConfig.REQUEST_METHOD, this.prototype) || [];
                    const listParams = Reflect.getMetadata(ConstantConfig.REQUEST_PARAMS, this.prototype) || [];
                    return {
                        tag:{
                            name:controllerPrefix,
                            description:controllerPrefix
                        },
                        paths: listMethod.map((item:IHandler) => {
                            const params = listParams.filter((param:IParams) => param.key === item.key);
                            return {
                                parameters:params
                                    .filter((param:IParams) => param.type !== 'body')
                                    .map((param:IParams) => {
                                    return {
                                        name:param.name,
                                        in:param.type,
                                        required:param.required,
                                        schema:param.paramSchema,
                                    }
                                }),
                                requestBody:{
                                    content:{
                                        "application/json":{
                                            schema:params.find((param:IParams) => param.type === 'body')?.paramSchema
                                        }
                                    }
                                },
                                path:`${controllerPrefix}${item.path}`,
                                method:item.method,
                                tags:[controllerPrefix],
                                summary:item.key,
                                isAuth:Reflect.getMetadata(ConstantConfig.REQUEST_PUBLIC, this) || Reflect.getMetadata(ConstantConfig.REQUEST_PUBLIC, this.prototype,item.key) || false
                            }
                        })
                    }
                }
            }
        }

        public meta()
        {

        }
    };


}