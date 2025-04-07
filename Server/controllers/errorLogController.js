import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import APIError, { HttpStatusCode } from '../exception/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getErrorLogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        
        const logFilePath = path.join(__dirname, '..', 'logs', 'error.log');
        
        if (!fs.existsSync(logFilePath)) {
            throw new APIError(
                'NOT_FOUND',
                HttpStatusCode.NOT_FOUND,
                true,
                'Error log file not found'
            );
        }

        const fileContent = fs.readFileSync(logFilePath, 'utf8');
        const logs = fileContent
            .trim()
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return { raw: line };
                }
            })
            .sort((a, b) => {
                const timeA = new Date(a.timestamp || 0);
                const timeB = new Date(b.timestamp || 0);
                return timeB - timeA; // Descending order
            });

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedLogs = logs.slice(startIndex, endIndex);

        const totalLogs = logs.length;
        const totalPages = Math.ceil(totalLogs / limit);

        res.json({
            success: true,
            data: {
                logs: paginatedLogs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalLogs,
                    logsPerPage: limit
                }
            }
        });
    } catch (error) {
        next(error);
    }
};