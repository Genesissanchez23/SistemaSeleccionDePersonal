export interface CategoryData {
    name: string;
    series: DataItems[];
}

export interface DataItems {
    name: string;
    value: number;
}

export interface DataItemsUno {
    label: string;
    value: number;
}
