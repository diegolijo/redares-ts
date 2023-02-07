import * as XLSX from 'xlsx';
import * as fs from 'fs';


const workbook: any = XLSX.readFile('radares.XLSX', { type: 'array' });
const radarObj: any = [];
const fijosGal: any = [];
const movilesGal: any = [];
const tramoGal: any = [];
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
            if (typeof v.w === 'string') {
                radarObj[count].pk = [];
                const kms = v.w.split('-');
                for (let km of kms) {
                    km = km.replace(',', '.');
                    radarObj[count].pk.push(Number.parseFloat(km));
                }
            }
        }
        if (field === 'E') {
            radarObj[count].sentido = v.v;
        }
        if (field === 'F' && (radarObj[count].provincia === 'Ourense'
            || radarObj[count].provincia === 'Pontevedra'
            || radarObj[count].provincia === 'Lugo'
            || radarObj[count].provincia === 'Coruña, A')) {
            if (radarObj[count].tipo === 'Radar Fijo') {
                fijosGal.push(radarObj[count]);
            }
            if (radarObj[count].tipo === 'Radar Móvil') {
                movilesGal.push(radarObj[count]);
            }
            if (radarObj[count].tipo === 'Radar Tramo') {
                tramoGal.push(radarObj[count]);
            }
        }
    }
}

fs.mkdir('out', (value) => {
    const data = JSON.stringify(fijosGal);
    fs.writeFileSync('out/fijosGal.json', data);
    const data2 = JSON.stringify(movilesGal);
    fs.writeFileSync('out/movilesGal.json', data2);
    const data3 = JSON.stringify(tramoGal);
    fs.writeFileSync('out/tramoGal.json', data3);
})
