export function obj2bin(obj, binSize, JSON) {
    const binData = new ArrayBuffer(binSize);
    const binDataView = new DataView(binData);
    let n = 0;

    for (let i = 0; i < JSON.length; i++) {
        switch (JSON[i].type) {
            case "char":
                for (let j = 0; j < obj[JSON[i].name].length; j++) {
                    binDataView.setUint8(n, (new TextEncoder).encode(obj[JSON[i].name][j])[0]);
                    n++;
                }
                binDataView.setUint8(n, 0);
                n += JSON[i].length - obj[JSON[i].name].length;
                break;
            case "color":
                //parse color code
                binDataView.setUint8(n, parseInt(obj[JSON[i].name].slice(1,3), 16));
                binDataView.setUint8(n + 1, parseInt(obj[JSON[i].name].slice(3,5), 16));
                binDataView.setUint8(n + 2, parseInt(obj[JSON[i].name].slice(5,7), 16));   
                
                n += 3;
                break;
            case "bool":
                if (obj[JSON[i].name] === true) {binDataView.setUint8(n, 1);} else {binDataView.setUint8(n, 0);}
                n++;
                break;
            case "uint8_t":
                binDataView.setUint8(n, Number(obj[JSON[i].name]));
                n++;
                break;
            case "int8_t":
                binDataView.setInt8(n, Number(obj[JSON[i].name]));
                n++;
                break;
            case "uint16_t":
                n = Math.ceil(n / 2) * 2; //padding
                binDataView.setUint16(n, Number(obj[JSON[i].name]), true);
                n += 2;
                break;
            case "int16_t":
                n = Math.ceil(n / 2) * 2; //padding
                binDataView.setInt16(n, Number(obj[JSON[i].name]), true);
                n += 2;
                break;
            case "uint32_t":
                n = Math.ceil(n / 4) * 4; //padding
                binDataView.setUint32(n, Number(obj[JSON[i].name]), true);
                n += 4;
                break;
            case "int32_t":
                n = Math.ceil(n / 4) * 4; //padding
                binDataView.setInt32(n, Number(obj[JSON[i].name]), true);
                n += 4;
                break;
            case "float":
                n = Math.ceil(n / 4) * 4; //padding
                binDataView.setFloat32(n, Number(obj[JSON[i].name]), true);
                n += 4;
                break;
        }
    }

    return binData;

}

export function bin2obj(rawData, JSON) {
    const utf8decoder = new TextDecoder();

    const parsedData = {};
    const rawDataView = new DataView(rawData);
    
    let n = 0;
    for (let i = 0; i < JSON.length; i++) {        
        switch (JSON[i].type) {
            case "char":
                parsedData[JSON[i].name] = utf8decoder.decode(rawData.slice(n, n + JSON[i].length)).split("\0").shift();
                n = n + JSON[i].length;
                break;
            case "color":
                //create color code
                parsedData[JSON[i].name] = "#" + ("0" + (rawDataView.getUint8(n)).toString(16)).slice(-2) + ("0" + (rawDataView.getUint8(n + 1)).toString(16)).slice(-2) + ("0" + (rawDataView.getUint8(n + 2)).toString(16)).slice(-2);
                n = n + 3;
                break;
            case "bool":
                parsedData[JSON[i].name] = !!rawDataView.getUint8(n);
                n++;
                break;
            case "uint8_t":
                parsedData[JSON[i].name] = (rawDataView.getUint8(n)).toString();
                n++;
                break;
            case "int8_t":
                parsedData[JSON[i].name] = (rawDataView.getInt8(n)).toString();
                n++;
                break;
            case "uint16_t":
                n = Math.ceil(n / 2) * 2; //padding
                parsedData[JSON[i].name] = (rawDataView.getUint16(n, true)).toString();
                n += 2;
                break;
            case "int16_t":
                n = Math.ceil(n / 2) * 2; //padding
                parsedData[JSON[i].name] = (rawDataView.getInt16(n, true)).toString();
                n += 2;
                break;
            case "uint32_t":
                n = Math.ceil(n / 4) * 4; //padding
                parsedData[JSON[i].name] = (rawDataView.getUint32(n, true)).toString();
                n += 4;
                break;
            case "int32_t":
                n = Math.ceil(n / 4) * 4; //padding
                parsedData[JSON[i].name] = (rawDataView.getInt32(n, true)).toString();
                n += 4;
                break;
            case "float":
                n = Math.ceil(n / 4) * 4; //padding
                parsedData[JSON[i].name] = (rawDataView.getFloat32(n, true)).toString();
                n += 4;
                break;
        }
    }
    
    return (parsedData);

}

export function binsize(name, JSON) {

    let sizeArray;
    let n = 0;
    for (let i = 0; i < JSON.length; i++) {
        switch (JSON[i].type) {
            case "char":
                sizeArray = [n, JSON[i].length];                
                n = n + JSON[i].length;
                break;
            case "color":
                sizeArray = [n, 3];                
                n += 3;
                break;
            case "bool":
                sizeArray = [n, 1];                
                n++;
                break;
            case "uint8_t":
                sizeArray = [n, 1];                
                n++;
                break;
            case "int8_t":
                sizeArray = [n, 1];                
                n++;
                break;
            case "uint16_t":
                n = Math.ceil(n / 2) * 2; //padding
                sizeArray = [n, 2];                
                n += 2;
                break;
            case "int16_t":
                n = Math.ceil(n / 2) * 2; //padding
                sizeArray = [n, 2];                
                n += 2;
                break;
            case "uint32_t":
                n = Math.ceil(n / 4) * 4; //padding
                sizeArray = [n, 4];                
                n += 4;
                break;
            case "int32_t":
                n = Math.ceil(n / 4) * 4; //padding
                sizeArray = [n, 4];                
                n += 4;
                break;
            case "float":
                n = Math.ceil(n / 4) * 4; //padding
                sizeArray = [n, 4];                
                n += 4;
                break;
        }
        
        if (JSON[i].name == name) {
            return sizeArray;
        }
    }

    return (sizeArray);

}