// zove se polygon, ali je multipolygon
export interface GeomPolygon {
    type: string;
    coordinates: number[][][];
}
