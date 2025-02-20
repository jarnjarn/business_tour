export class PostAddOnInfo {
    phone: string;
    birthYear: string;
    address: string;
    height: string;
    weight: string;
    origin: string;
    measurements: string;
    province: string;
    district: string;
    ward: string;
    roomFee:string;
    pass:string
    stagenName:string
    keywords:string[]
}

export class PostAddServiceInfo {
    service: string;
    timeWorking: string;
    time: string;
    reject: string;
    promise: string;
}

type Ward = {
    ward_name: string;
    ward: string;
    count: number;
    slug: string;
};

type District = {
    district_name: string;
    district: string;
    count: number;
    wards: Ward[];
    slug: string;
};

type Province = {
    province_name: string;
    province: string;
    count: number;
    districts: District[];
};

export type AgencyProvince = {
    hn: Province;
    hcm:Province;
    other: Province[];
    other2: Province[];
};
