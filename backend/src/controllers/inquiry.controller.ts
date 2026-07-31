import { Request, Response } from 'express';
import { InquiryService } from '../services/inquiry.service';

export class InquiryController {
    private inquiryService: InquiryService;

    constructor() {
        this.inquiryService = new InquiryService();
    }

    // 1. POST /api/inquiries (Public)
    public createInquiry = async (req: Request, res: Response) => {
        try {
            const newInquiry = await this.inquiryService.createInquiry(req.body);
            return res.status(201).json({
                status: 'success',
                message: 'Pesan / Pengajuan booking Anda berhasil dikirim.',
                data: newInquiry,
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    // 2. GET /api/inquiries (Admin)
    public getAllInquiries = async (req: Request, res: Response) => {
        try {
            const filters = {
                status: req.query.status as any,
                service_type: req.query.service_type as any,
                search: req.query.search as string,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
            };

            const result = await this.inquiryService.getAllInquiries(filters);

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil daftar inquiry.',
                ...result,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    // 3. PATCH /api/inquiries/:id/status (Admin)
    public updateInquiryStatus = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inquiry tidak valid.',
                });
            }

            if (!status) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Status baru wajib diisi.',
                });
            }

            const updatedInquiry = await this.inquiryService.updateInquiryStatus(Number(id), status);

            return res.status(200).json({
                status: 'success',
                message: `Status inquiry berhasil diperbarui menjadi '${status}'.`,
                data: updatedInquiry,
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    // 4. DELETE /api/inquiries/:id (Admin)
    public deleteInquiry = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inquiry tidak valid.',
                });
            }

            await this.inquiryService.deleteInquiry(Number(id));

            return res.status(200).json({
                status: 'success',
                message: 'Data inquiry berhasil dihapus.',
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    };
}