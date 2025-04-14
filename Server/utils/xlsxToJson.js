import xlsx from 'xlsx';
import logger from './logger.js';
import ExcelJS from 'exceljs';
import { OrientationEnum, visualStyleEnum } from '../enums/ENUMS.js';


export const xlsxtojson = async (buffer) => {
    try {
        if (!Buffer.isBuffer(buffer)) {
            throw new Error('Invalid file buffer');
        }
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonObj = xlsx.utils.sheet_to_json(worksheet);
        console.log("jsonObj--->", jsonObj);
        if (jsonObj.length == 0) {
            return {
                status: 400,
                success: false,
                message: "Empty csv/xlsx file",
                data: []
            }
        }
        return {
            status: 200,
            success: true,
            message: "data fetched successfully",
            data: jsonObj,
        };
    } catch (err) {
        logger.error("ERROR IN xlsxtojson--->", err)
        console.log(err);
        return { status: 500, success: false, message: err.message };
    }
};

// for excel file extension check
export const checkXlsxFile = (file) => {
    const fileExtension = file.originalname.split('.').pop();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        return false;
    }
    return true;
}

// export const createAudioExcel = async (audioData = []) => {
//     try {
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Audio Data');

//         worksheet.columns = [
//             { header: 'name', key: 'name', width: 50 },
//             { header: 'theme', key: 'theme', width: 25 },
//             { header: 'character', key: 'character', width: 25 },
//             { header: 'style', key: 'style', width: 25 },
//             { header: 'orientation', key: 'orientation', width: 25 }
//         ];

//         const headerRow = worksheet.getRow(1);
//         headerRow.font = { bold: true, color: { argb: 'FF000000' } };
//         headerRow.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'FFD3D3D3' }
//         };
//         headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
//         headerRow.height = 20;
//         headerRow.commit();

//         audioData.forEach(audio => {
//             worksheet.addRow({
//                 name: audio?.audioDetails?.originalFileName || 'N/A',
//                 theme: '',
//                 character: '',
//                 style: '',
//                 orientation: ''
//             });
//         });

//         const styleValues = Object.values(visualStyleEnum).join(','); 
//         worksheet.getColumn('style').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
//             if (rowNumber > 1) {
//                 cell.dataValidation = {
//                     type: 'list',
//                     allowBlank: true,
//                     formulae: [`"${styleValues}"`]
//                 };
//             }
//         });

//         const orientationValues = Object.values(OrientationEnum).join(',');
//         worksheet.getColumn('orientation').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
//             if (rowNumber > 1) {
//                 cell.dataValidation = {
//                     type: 'list',
//                     allowBlank: true,
//                     formulae: [`"${orientationValues}"`]
//                 };
//             }
//         });

//         worksheet.eachRow((row) => {
//             row.eachCell((cell) => {
//                 cell.protection = { locked: true };
//             });
//         });

//         worksheet.eachRow((row, rowNumber) => {
//             if (rowNumber > 1) { // Skip header row
//                 for (let colNumber = 2; colNumber <= 5; colNumber++) {
//                     const cell = row.getCell(colNumber);
//                     cell.protection = { locked: false };
//                 }
//             }
//         });

//         worksheet.getColumn('name').eachCell((cell, rowNumber) => {
//             if (rowNumber > 1) {
//                 cell.fill = {
//                     type: 'pattern',
//                     pattern: 'solid',
//                     fgColor: { argb: 'FFF0F0F0' } 
//                 };
//             }
//         });

//         worksheet.eachRow((row) => {
//             row.eachCell((cell) => {
//                 cell.border = {
//                     top: { style: 'thin' },
//                     left: { style: 'thin' },
//                     bottom: { style: 'thin' },
//                     right: { style: 'thin' }
//                 };
//             });
//         });

//         worksheet.protect('koyal@123', { 
//             selectLockedCells: true,
//             selectUnlockedCells: true,
//             formatCells: false,
//             formatColumns: false,
//             formatRows: false,
//             insertColumns: false,
//             insertRows: false,
//             insertHyperlinks: false,
//             deleteColumns: false,
//             deleteRows: false,
//             sort: false,
//             autoFilter: false,
//             pivotTables: false
//         });

//         const buffer = await workbook.xlsx.writeBuffer();
//         return {
//             success: true,
//             data: buffer
//         };
//     } catch (err) {
//         console.error("ERROR in createAudioExcel:", err);
//         return {
//             success: false,
//             message: err.message || "Something went wrong"
//         };
//     }
// };

export const createAudioExcel = async (audioData = []) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Audio Data');

        worksheet.columns = [
            { header: 'name', key: 'name', width: 50 },
            { header: 'theme', key: 'theme', width: 25 },
            { header: 'character', key: 'character', width: 25 },
            { header: 'style', key: 'style', width: 25 },
            { header: 'orientation', key: 'orientation', width: 25 },
            { header: 'lipsync', key: 'lipsync', width: 15 }
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FF000000' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 20;
        headerRow.commit();

        const audioFileNames = audioData.map(audio =>
            audio?.fileName || 'N/A'
        );
        const uniqueAudioNames = [...new Set(audioFileNames)].filter(name => name !== 'N/A');
        const audioNamesString = uniqueAudioNames.join(',');

        const initialRowCount = 20;
        for (let i = 0; i < initialRowCount; i++) {
            worksheet.addRow({
                name: '',
                theme: '',
                character: '',
                style: '',
                orientation: '',
                lipsync: '',
            });
        }

        const lastRow = worksheet.rowCount;

        worksheet.getColumn('name').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber > 1) {
                cell.dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: [`"${audioNamesString}"`]
                };
            }
        });


        const styleValues = Object.values(visualStyleEnum).join(',');
        worksheet.getColumn('style').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber > 1) {
                cell.dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: [`"${styleValues}"`]
                };
            }
        });

        const orientationValues = Object.values(OrientationEnum).join(',');
        worksheet.getColumn('orientation').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber > 1) {
                cell.dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: [`"${orientationValues}"`]
                };
            }
        });

        worksheet.getColumn('lipsync').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber > 1) {
                cell.dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: ['"true,false"']
                };
            }
        });

        const instructionRow = worksheet.getRow(lastRow + 2);
        const instructionCell = instructionRow.getCell(1);
        instructionCell.value = "Note: You can add as many rows as needed. Right-click and select 'Insert' to add new rows.";
        instructionCell.font = { italic: true, color: { argb: 'FF808080' } };

        for (let rowNumber = 2; rowNumber <= lastRow; rowNumber++) {
            for (let colNumber = 1; colNumber <= 6; colNumber++) {
                const cell = worksheet.getRow(rowNumber).getCell(colNumber);
                cell.protection = { locked: false };

                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF0F0F0' }
                };

                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
        }

        worksheet.protect('koyal@123', {
            selectLockedCells: true,
            selectUnlockedCells: true,
            formatCells: false,
            formatColumns: false,
            formatRows: false,
            insertColumns: false,
            insertRows: true,
            insertHyperlinks: false,
            deleteColumns: false,
            deleteRows: false,
            sort: false,
            autoFilter: false,
            pivotTables: false
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return {
            success: true,
            data: buffer
        };
    } catch (err) {
        console.error("ERROR in createAudioExcel:", err);
        return {
            success: false,
            message: err.message || "Something went wrong"
        };
    }
};


