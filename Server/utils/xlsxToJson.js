import xlsx from 'xlsx';
import logger from './logger.js';

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