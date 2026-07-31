import { Request, Response } from 'express';
import { PortfolioService } from '../services/portfolio.service';
import { IPortfolioFilter } from '../interfaces/portfolio.interface';

export class PortfolioController {
    private portfolioService: PortfolioService;

    constructor() {
        this.portfolioService = new PortfolioService();
    }

    // 1. GET /api/portfolios - Ambil daftar portofolio (Filter, Search, & Pagination)
    public getAllPortfolios = async (req: Request, res: Response) => {
        try {
            const filter: IPortfolioFilter = {
                category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
                user_id: req.query.user_id ? Number(req.query.user_id) : undefined,
                type: req.query.type as any,
                is_featured: req.query.is_featured !== undefined ? req.query.is_featured === 'true' : undefined,
                search: req.query.search ? String(req.query.search) : undefined,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
            };
            const result = await this.portfolioService.getAllPortfolios(filter);
            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil daftar portofolio.',
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Terjadi kesalahan pada server.',
            });
        }
    };

    // 2. GET /api/portfolios/:id - Ambil detail portofolio berdasarkan ID
    public getPortfolioById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const portfolio = await this.portfolioService.getPortfolioById(id);
            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil detail portofolio.',
                data: portfolio,
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    public getPortfolioBySlug = async (req: Request, res: Response) => {
        try {
            // Tangkap parameter 'slug' atau 'id' dari URL
            const identifier = (req.params.slug || req.params.id) as string;

            if (!identifier) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Parameter slug atau ID wajib diisi.',
                });
            }

            const portfolio = await this.portfolioService.getPortfolioBySlugOrId(identifier);

            return res.status(200).json({
                status: 'success',
                data: portfolio,
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    // 3. POST /api/portfolios - Tambah portofolio baru (Protected / Admin Only)
    public createPortfolio = async (req: Request, res: Response) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            let thumbnail_url = req.body.thumbnail_url;
            let video_url = req.body.video_url;
            let before_image_url = req.body.before_image_url;
            let after_image_url = req.body.after_image_url;

            if (files) {
                if (files['thumbnail']?.[0]) thumbnail_url = files['thumbnail'][0].path;
                if (files['video']?.[0]) video_url = files['video'][0].path;
                if (files['before_image']?.[0]) before_image_url = files['before_image'][0].path;
                if (files['after_image']?.[0]) after_image_url = files['after_image'][0].path;
            }

            const title = typeof req.body.title === 'string' ? JSON.parse(req.body.title) : req.body.title;
            const description = typeof req.body.description === 'string'
                ? JSON.parse(req.body.description)
                : req.body.description;

            const newPortfolio = await this.portfolioService.createPortfolio({
                user_id: req.body.user_id ? Number(req.body.user_id) : (req as any).user?.id,
                category_id: req.body.category_id ? Number(req.body.category_id) : undefined,
                type: req.body.type,
                title,
                description,
                thumbnail_url,
                video_url,
                before_image_url,
                after_image_url,
                client_name: req.body.client_name,
                is_featured: req.body.is_featured === 'true' || req.body.is_featured === true,
            });

            return res.status(201).json({
                status: 'success',
                message: 'Portofolio baru berhasil ditambahkan.',
                data: newPortfolio,
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    // 4. PUT /api/portfolios/:id - Update data portofolio (Protected / Admin Only)
    public updatePortfolio = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const updatedPortfolio = await this.portfolioService.updatePortfolio(id, req.body);
            return res.status(200).json({
                status: 'success',
                message: 'Data portofolio berhasil diperbarui.',
                data: updatedPortfolio,
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    };

    // 5. DELETE /api/portfolios/:id - Hapus portofolio (Protected / Admin Only)
    public deletePortfolio = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID portofolio tidak valid.',
                });
            }

            await this.portfolioService.deletePortfolio(Number(id));

            return res.status(200).json({
                status: 'success',
                message: 'Portofolio beserta seluruh file gambarnya berhasil dihapus.',
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message,
            });
        }
    };
}