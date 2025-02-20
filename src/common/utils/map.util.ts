import globalMap from '@/assets/globalMap.json';
import slugmap from '@/assets/globalMap2.json';
import {MapLevel1s, MapLevel2s, MapLevel3s} from "@/@types/common.type";

export class MapUtil
{
    private static instance: MapUtil;
    static get gI()
    {
        if (!MapUtil.instance)
        {
            MapUtil.instance = new MapUtil();
        }
        return MapUtil.instance;
    }
    private readonly data: MapLevel1s[] = [];
    private readonly mapLv1: Map<string, MapLevel1s> = new Map();
    private readonly mapLv2: Map<string, MapLevel2s> = new Map();
    private readonly mapLv3: Map<string, MapLevel3s> = new Map();
    private readonly slugMap: Record<string, any> = {};
    constructor()
    {
        this.slugMap = slugmap;

        const defaultData = globalMap as MapLevel1s[];
        this.data = defaultData;
        for (const item of defaultData)
        {
            if (item.level2s)
            {
                this.mapLv1.set(item?.level1_id ||"", item);
                for (const item2 of item.level2s)
                {
                    this.mapLv2.set(item2.level2_id, {
                        ...item2,
                        level1_id: item.level1_id
                    });
                    if (item2.level3s)
                    {
                        for (const item3 of item2.level3s)
                        {
                            this.mapLv3.set(item3.level3_id, {
                                ...item3,
                                level2_id: item2.level2_id,
                                level1_id: item.level1_id
                            });
                        }
                    }
                }
            }
        }
    }

    public getListProvince()
    {
        return this.data.map(item => {
            return {
                level1_id: item.level1_id,
                value: item.level1_id,
                label: item.name,
            }
        });
    }

    public getListDistrict(provinceCode: string)
    {
        const province = this.getProvince(provinceCode);
        if (!province)
        {
            return [];
        }
        return province.level2s?.map(item => {
            return {
                level2_id: item.level2_id,
                value: item.level2_id,
                label: item.name,
            }
        }) || [];
    }


    public getListWard(districtCode: string)
    {
        const district = this.getDistrict(districtCode);
        if (!district)
        {
            return [];
        }
        return district.level3s?.map(item => {
            return {
                level3_id: item.level3_id,
                value: item.level3_id,
                label: item.name,
            }
        }) || [];
    }



    public getProvince(code: string)
    {
        return this.mapLv1.get(code);
    }

    public getDistrict(code: string)
    {
        return this.mapLv2.get(code);
    }

    public getWard(code: string)
    {
        return this.mapLv3.get(code);
    }

    public getByAnyCode(code: string)
    {
        return this.getProvince(code) || this.getDistrict(code) || this.getWard(code);
    }

    public getMapBySlug(slug: string)
    {
        return this.slugMap[slug];
    }

    public groupByLevel1(code:string)
    {

    }


    public getFullMap()
    {
        return this.data;
    }
}