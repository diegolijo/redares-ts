import * as XLSX from 'xlsx';
import * as fs from 'fs';


const workbook: any = XLSX.readFile('radares.XLSX', { type: 'array' });
const radarObj: any = [];
const fijosGal: any = [];
const movilesGal: any = [];
const tramoGal: any = [];
const todosGal: any = [];
//********************/
const puntosKm = require('./Puntos_kilometricos.json');

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
                radarObj[count].tipo === 'Fijo'
                findLatLangsInPK(radarObj[count]);
                fijosGal.push(radarObj[count]);
            }
            if (radarObj[count].tipo === 'Radar Móvil') {
                radarObj[count].tipo === 'Movil'
                findLatLangsInPK(radarObj[count]);
                movilesGal.push(radarObj[count]);
            }
            if (radarObj[count].tipo === 'Radar Tramo') {
                radarObj[count].tipo = 'Tramo'
                findLatLangsInPK(radarObj[count])
                tramoGal.push(radarObj[count]);
            }

            findLatLangsInPK(radarObj[count]);
            todosGal.push(radarObj[count]);

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
    const data4 = JSON.stringify(todosGal);
    fs.writeFileSync('out/todosGal.json', data4);
})


function findLatLangsInPK(radar: any) {
    radar.coords = [];
    for (const pk of radar.pk) {
        const points = puntosKm.features.filter(el =>
            (el.properties.numero === Math.ceil(pk) || el.properties.numero === Math.round(pk))
            && el.properties.Nombre === radar.carretera);

        for (const iterator of points) {
            const geo = {
                lat: iterator.geometry.coordinates[1],
                long: iterator.geometry.coordinates[0],
                alt: iterator.geometry.coordinates[2],
            }
            radar.coords.push(geo);
        }
    }
    if (radar.carretera === 'AC-543') {
    
    }
    return radar;
}

export interface IProperties {
    alta_db: string;
    extension: string;
    fecha_alta: string;
    FID: number;
    fuente: number;
    fuenteD: string;
    id_porpk: number;
    id_tramo: number;
    id_vial: number;
    Nombre: string;
    numero: number;
    sentidopk: number;
    sentidopkD: string;
    tipo_porpk: number;
    tipoporpkD: string;
    version: number;

    /*     
        alta_db:'20200803130057'
        extension:'-998'
        fecha_alta:'2020-08-03T00:00:00Z'
        FID:1
        fuente:26
        fuenteD:'Dirección General de Tráfico'
        id_porpk:90590226796
        id_tramo:99070127380
        id_vial:607000002702
        Nombre:'SC-BU-26'
        numero:0
        sentidopk:3
        sentidopkD:'Ambos sentidos'
        tipo_porpk:2
        tipoporpkD:'PK'
        version:2 
    */
}