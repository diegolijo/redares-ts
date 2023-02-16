import * as XLSX from 'xlsx';
import * as fs from 'fs';


const workbook: any = XLSX.readFile('radares.XLSX', { type: 'array' });
const radarObj: any = [];
const fijosObj: any = [];
const movilesObj: any = [];
const tramoObj: any = [];
const todosObj: any = [];
//********************/
const puntosKm = require('./Puntos_kilometricos.json');

parseRoads();

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
        if (field === 'F' /* && (radarObj[count].provincia === 'Ourense'
            || radarObj[count].provincia === 'Pontevedra'
            || radarObj[count].provincia === 'Lugo'
            || radarObj[count].provincia === 'Coruña, A') */) {
            if (radarObj[count].tipo === 'Radar Fijo') {
                radarObj[count].tipo === 'Fijo'
                findLatLangsInPK(radarObj[count]);
                fijosObj.push(radarObj[count]);
            }
            if (radarObj[count].tipo === 'Radar Móvil') {
                radarObj[count].tipo === 'Movil'
                findLatLangsInPK(radarObj[count]);
                movilesObj.push(radarObj[count]);
            }
            if (radarObj[count].tipo === 'Radar Tramo') {
                radarObj[count].tipo = 'Tramo'
                findLatLangsInPK(radarObj[count])
                tramoObj.push(radarObj[count]);
            }
            if (radarObj[count].tipo !== 'Radar Móvil') {
                findLatLangsInPK(radarObj[count]);
                todosObj.push(radarObj[count]);
            }
        }
    }
}

fs.mkdir('out', (value) => {
    const data = JSON.stringify(fijosObj);
    fs.writeFileSync('out/fijosEsp.json', data);
    const data2 = JSON.stringify(movilesObj);
    fs.writeFileSync('out/movilesEsp.json', data2);
    const data3 = JSON.stringify(tramoObj);
    fs.writeFileSync('out/tramoEsp.json', data3);
    const data4 = JSON.stringify(todosObj);
    fs.writeFileSync('out/noMovilGaEsp.json', data4);
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

function parseRoads() {
    const roads = {};
    for (const point of puntosKm.features) {
        if (!roads[point.properties.Nombre]) {
            roads[point.properties.Nombre] = [];
        }
        roads[point.properties.Nombre].push({ km: point.properties.numero, lat: point.geometry.coordinates[1], long: point.geometry.coordinates[0], alt: point.geometry.coordinates[2] });
        roads[point.properties.Nombre] = roads[point.properties.Nombre].sort((a, b) => { return a.km - b.km; })
    }
    console.log(roads);
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