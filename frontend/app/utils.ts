export function checkForDiscrepency(actualVal: number, twinVal: number) {
    const sum = Math.abs(actualVal) - Math.abs(twinVal);
    const actualPerc = (Math.abs(sum) / Math.abs(actualVal))
    const twinPerc = (Math.abs(sum) / Math.abs(twinVal))
    if (actualPerc > 0.1 || twinPerc > 0.1) {
        return "ERROR"
    } else {
        return null;
    }
}

function extractSchemaNames(columns: [{ "name": string, "type": string, "timePrecision"?: string }]): string[] {
    const arrayOfNames: string[] = [];
 //   console.log("columns: ", columns)
    if (columns.length  > 0) {
        columns.forEach(col => {
            arrayOfNames.push(col['name'])
        })
    }

    return arrayOfNames;
}



export function griddbRowsToObj(
    actual: boolean,
    columns: [{ "name": string, "type": string, "timePrecision"?: string }],
    rows: any[]): any[] {

    type Dataset = {
        [key: string]: string | Date,
        value: any
    }

    const arrayOfNames = extractSchemaNames(columns);
    const arrDataset: any[] = []

    rows.forEach(row => {
        if (row.length === arrayOfNames.length) {
            const dataset: Dataset = {
                value: ""
            }
            for (let i = 0; i < row.length; i++) {
                let keyName: string = "";
                if (actual) {
                    keyName = arrayOfNames[i];
                } else {
                    keyName = "twin_" + arrayOfNames[i];
                }

                const value: any = row[i];
                if (keyName === "ts" || keyName === "twin_ts") {
                    const date = new Date(value);
                    dataset['ts'] = date;
                } else {
                    dataset[keyName] = value;
                }

            }
            arrDataset.push(dataset);
        }

    })
  //  console.log(arrDataset)
    return arrDataset;
}