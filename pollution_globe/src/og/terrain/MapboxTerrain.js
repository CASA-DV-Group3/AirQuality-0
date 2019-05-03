import { GlobusTerrain } from './GlobusTerrain.js';
import { lerp } from '../math.js';

const KEY = "pk.eyJ1IjoiZm94bXVsZGVyODMiLCJhIjoiY2pqYmR3dG5oM2Z1bzNrczJqYm5pODhuNSJ9.Y4DRmEPhb-XSlCR9CAXACQ";

class MapboxTerrain extends GlobusTerrain {
    constructor(name, options) {

        super(name, options);

        options = options || {};
        
        this.blur = false;
        this.equalizeVertices = true;
        this.equalizeNormals = false;
        this.minZoom = 2;
        this.maxZoom = 15;
        this.url = "//api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=" + (options.key || KEY);
        this.fileGridSize = 128;
        this._dataType = "imageBitmap";

        this.tileCache = [];
        for (var i = this.minZoom; i <= this.maxZoom; i++) {
            this.tileCache[i] = {};
        }
    }

    getElevations(data, segment) {

        if (data) {

            const SIZE = data.width;
            const SIZE_ONE = SIZE - 1;

            let canvas = document.createElement("canvas");
            canvas.width = SIZE;
            canvas.height = SIZE;
            let ctx = canvas.getContext("2d");

            ctx.drawImage(data, 0, 0);
            let idata = ctx.getImageData(0, 0, SIZE, SIZE).data;

            if (!this.tileCache[segment.tileZoom][segment.tileX]) {
                this.tileCache[segment.tileZoom][segment.tileX] = {};
            }

            //const nN = this.tileCache[segment.tileZoom][segment.tileX][segment.tileYN];
            //const nE = this.tileCache[segment.tileZoom][segment.tileXE] &&
            //    this.tileCache[segment.tileZoom][segment.tileXE][segment.tileY];
            //const nS = this.tileCache[segment.tileZoom][segment.tileX][segment.tileYS];
            //const nW = this.tileCache[segment.tileZoom][segment.tileXW] &&
            //    this.tileCache[segment.tileZoom][segment.tileXW][segment.tileY];

            const fgs = this.fileGridSize;
            const fgsOne = fgs + 1;

            const size = fgsOne * fgsOne;

            let res = new Float32Array(size);

            for (let k = 0; k < size; k++) {

                let j = k % fgsOne,
                    i = ~~(k / fgsOne);

                let src_i = Math.round(lerp(i / fgsOne, SIZE_ONE, 0)),
                    src_j = Math.round(lerp(j / fgsOne, SIZE_ONE, 0));

                let src = (src_i * SIZE + src_j) * 4;

                let height = -10000 + (idata[src] * 256 * 256 + idata[src + 1] * 256 + idata[src + 2]) * 0.1;

                //if (nN && i === 0) {
                //    height = 0.5 * (height + nN[fgs * fgsOne + j]);
                //}

                //if (nE && j === fgs) {
                //    height = 0.5 * (height + nE[i * fgsOne]);
                //}

                //if (nS && i === fgs) {
                //    height = 0.5 * (height + nS[j]);
                //}

                //if (nW && j === 0) {
                //    height = 0.5 * (height + nW[i * fgsOne + fgs]);
                //}

                res[k] = height;
            }

            this.tileCache[segment.tileZoom][segment.tileX][segment.tileY] = res;

            return res;

        } else {
            return new Float32Array();
        }
    }
};


export { MapboxTerrain };