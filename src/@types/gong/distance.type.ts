type Distance = {
    text: string;
    value: number;
};

type Duration = {
    text: string;
    value: number;
};

type ElementSub = {
    distance: Distance;
    duration: Duration;
    status: string;
};

type Row = {
    elements: ElementSub[];
};

type DistanceMatrixResponse = {
    rows: Row[];
};


type AutocompletePrediction = {
    predictions: Array<{
        description: string
        matched_substrings: Array<any>
        place_id: string
        reference: string
        structured_formatting: {
            main_text: string
            main_text_matched_substrings: Array<any>
            secondary_text: string
            secondary_text_matched_substrings: Array<any>
        }
        has_children: boolean
        plus_code: {
            compound_code: string
            global_code: string
        }
        compound: {
            district: string
            commune: string
            province: string
        }
        terms: Array<{
            offset: number
            value: string
        }>
        types: Array<string>
        distance_meters: any
    }>
    execution_time: string
    status: string
}

type PlaceDetail = {
    result: {
        place_id: string
        formatted_address: string
        geometry: {
            location: {
                lat: number
                lng: number
            }
        }
        name: string
    }
    status: string
}
