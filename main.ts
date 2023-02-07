import * as XLSX from 'xlsx';
/* import * as fs from 'fs';
import { Readable } from 'stream';


XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable); */

const workbook: any = XLSX.readFile('radares.XLSX', { type: 'array' });
const radarObj: any = [];
const fijosGal = [];
const movilesGal = [];
for (const [index, value] of Object.entries(workbook.Sheets.Hoja1)) {
    if (index !== '!margins' && index !== '!ref') {
        const v: any = value;
        const field = index.substring(0, 1);
        const row = index.substring(1, index.length);
        const count = Number.parseInt(row)
        if (field === 'A') {
            radarObj[count] = { provincia: v.v };
        }
        if (field === 'B') {
            radarObj[count].carretera = v.v;
        }
        if (field === 'C') {
            radarObj[count].tipo = v.v;
        }
        if (field === 'D') {
            radarObj[count].pk = v.v;
        }
        if (field === 'E') {
            radarObj[count].sentido = v.v;
        }
        if (field === 'F' && radarObj[count].tipo === 'Radar Fijo'
            && (radarObj[count].provincia === 'Ourense'
                || radarObj[count].provincia === 'Pontevedra'
                || radarObj[count].provincia === 'Lugo'
                || radarObj[count].provincia === 'Coruña, A')) {

            fijosGal.push(radarObj[count]);
        }
        if (field === 'F' && radarObj[count].tipo === 'Radar Móvil'
            && (radarObj[count].provincia === 'Ourense'
                || radarObj[count].provincia === 'Pontevedra'
                || radarObj[count].provincia === 'Lugo'
                || radarObj[count].provincia === 'Coruña, A')) {
            movilesGal.push(radarObj[count]);
        }
    }
}
radarObj;