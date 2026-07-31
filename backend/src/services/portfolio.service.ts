import slugify from 'slugify';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { CategoryRepository } from '../repositories/category.repository';
import {
    IPortfolio,
    ICreatePortfolioDTO,
    IUpdatePortfolioDTO,
    IPortfolioFilter
} from '../interfaces/portfolio.interface';
import { deleteFile } from "../utils/file.util";

export class PortfolioService {
    private portfolioRepo: PortfolioRepository;
    private categoryRepo: CategoryRepository;

    constructor() {
        this.portfolioRepo = new PortfolioRepository();
        this.categoryRepo = new CategoryRepository();
    }

    private async generateUniqueSlug(titleText: string, currentId?: number): Promise<string> {
        let slug = slugify(titleText, { lower: true, strict: true, trim: true });
        let existingPortfolio = await this.portfolioRepo.findBySlug(slug);

        if (existingPortfolio && existingPortfolio.id !== currentId) {
            slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }

        return slug;
    }

    async getAllPortfolios(filter: IPortfolioFilter): Promise<{
        data: IPortfolio[];
        pagination: {
            total_items: number;
            total_pages: number;
            current_page: number;
            limit: number;
        };
    }> {
        const limit = filter.limit ? Number(filter.limit) : 10;
        const page = filter.page ? Number(filter.page) : 1;

        const { data, total } = await this.portfolioRepo.findAll({
            ...filter,
            limit,
            page,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                total_items: total,
                total_pages: totalPages,
                current_page: page,
                limit,
            },
        };
    }

    async getPortfolioById(id: number): Promise<IPortfolio> {
        const portfolio = await this.portfolioRepo.findById(id);
        if (!portfolio) {
            throw new Error('Portofolio tidak ditemukan!');
        }
        return portfolio;
    }

    public async getPortfolioBySlugOrId(param: string): Promise<IPortfolio> {
        let portfolio: IPortfolio | null = null;

        // 1. Cek apakah parameter berupa Angka ID murni (contoh: "1", "12")
        const isId = !isNaN(Number(param));

        if (isId) {
            portfolio = await this.portfolioRepo.findById(Number(param));
        } else {
            // 2. Jika berupa Slug String (contoh: "bali-prewedding-photo")
            portfolio = await this.portfolioRepo.findBySlug(param);
        }

        if (!portfolio) {
            throw new Error(`Portofolio dengan identifier '${param}' tidak ditemukan.`);
        }

        return portfolio;
    }

    async createPortfolio(dto: ICreatePortfolioDTO): Promise<IPortfolio> {
        if (!dto.title || (!dto.title.en && !dto.title.id)) {
            throw new Error('Judul portofolio wajib diisi!');
        }

        if (!dto.type) {
            throw new Error('Tipe portofolio (photography/videography/editing) wajib diisi!');
        }

        if (!dto.thumbnail_url) {
            throw new Error('Thumbnail URL wajib diisi!');
        }

        if (dto.category_id) {
            const categoryExists = await this.categoryRepo.findById(dto.category_id);
            if (!categoryExists) {
                throw new Error('Kategori yang dipilih tidak ditemukan!');
            }
        }

        const baseTitle = dto.title.en || dto.title.id;
        const slug = await this.generateUniqueSlug(baseTitle);

        return await this.portfolioRepo.create({
            ...dto,
            slug,
        });
    }

    async updatePortfolio(id: number, dto: IUpdatePortfolioDTO): Promise<IPortfolio> {
        await this.getPortfolioById(id);

        if (dto.category_id) {
            const categoryExists = await this.categoryRepo.findById(dto.category_id);
            if (!categoryExists) {
                throw new Error('Kategori yang dipilih tidak ditemukan!');
            }
        }

        let newSlug: string | undefined = undefined;

        if (dto.title && (dto.title.en || dto.title.id)) {
            const baseTitle = dto.title.en || dto.title.id;
            newSlug = await this.generateUniqueSlug(baseTitle, id);
        }

        const updatedPortfolio = await this.portfolioRepo.update(id, {
            ...dto,
            ...(newSlug && { slug: newSlug }),
        });

        if (!updatedPortfolio) {
            throw new Error('Gagal memperbarui data portofolio!');
        }

        return updatedPortfolio;
    }

    public async deletePortfolio(id: number): Promise<void> {
        // 1. Cari data portofolio terlebih dahulu di DB untuk mendapatkan URL file/fotonya
        const portfolio = await this.portfolioRepo.findById(id);

        if (!portfolio) {
            throw new Error(`Portofolio dengan ID ${id} tidak ditemukan.`);
        }

        // 2. Hapus file-file fisik di server
        if (portfolio.thumbnail_url) deleteFile(portfolio.thumbnail_url);
        if (portfolio.before_image_url) deleteFile(portfolio.before_image_url);
        if (portfolio.after_image_url) deleteFile(portfolio.after_image_url);
        if (portfolio.video_url) deleteFile(portfolio.video_url);

        // 3. Hapus baris data dari database MySQL
        await this.portfolioRepo.delete(id);
    }
}