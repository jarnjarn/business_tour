import jsonwebtoken from 'jsonwebtoken';
import {NextRequest} from "next/server";

export class StringUtil
{
    static genToken(payload:any):string
    {
        return jsonwebtoken.sign(payload, process.env.JWT_SECRET ||"", {expiresIn: '1y'});
    }

    static verifyToken(token:string):any {
        return jsonwebtoken.verify(token, process.env.JWT_SECRET || "");
    }

    static extractToken(req:NextRequest):string {
        const token = req.headers.get("Authorization") ;
        return  token ? token.replace("Bearer ","") : "";
    }

    static getLinkFile(file:{
        response: {
            link: string;
            success: boolean;
        },
        name: string;
    }):string
    {
        return file?.response?.link || (file?.name) || "";
    }

    static cutString = (dto: string) => {
        return dto.replace(/Thành phố|Tỉnh/g, '').trim();
    };
}