import { InquiryRepository } from '../repositories/inquiry.repository';
import { IInquiry, ICreateInquiryInput, IInquiryQueryFilters, InquiryStatus } from '../interfaces/inquiry.interface';

export class InquiryService {
    private inquiryRepository: InquiryRepository;

    constructor() {
        this.inquiryRepository = new InquiryRepository();
    }

    // Public: Buat Inquiry Baru
    public async createInquiry(input: ICreateInquiryInput): Promise<IInquiry> {
        if (!input.client_name || !input.email || !input.whatsapp_number || !input.service_type || !input.message) {
            throw new Error('Nama, email, nomor WhatsApp, tipe layanan, dan pesan wajib diisi.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
            throw new Error('Format email tidak valid.');
        }

        const validServices = ['photography', 'videography', 'editing', 'all_in'];
        if (!validServices.includes(input.service_type)) {
            throw new Error('Tipe layanan tidak valid. Pilihan: photography, videography, editing, all_in.');
        }

        return await this.inquiryRepository.create(input);
    }

    // Admin: Ambil semua daftar Inquiry
    public async getAllInquiries(filters: IInquiryQueryFilters) {
        const page = Number(filters.page) || 1;
        const limit = Number(filters.limit) || 10;

        const { data, total } = await this.inquiryRepository.findAll(filters);

        return {
            data,
            pagination: {
                total_items: total,
                total_pages: Math.ceil(total / limit),
                current_page: page,
                limit,
            },
        };
    }

    // Admin: Update Status
    public async updateInquiryStatus(id: number, status: InquiryStatus): Promise<IInquiry> {
        const existingInquiry = await this.inquiryRepository.findById(id);
        if (!existingInquiry) {
            throw new Error(`Inquiry dengan ID ${id} tidak ditemukan.`);
        }

        const validStatuses: InquiryStatus[] = ['new', 'contacted', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error('Status tidak valid. Pilihan: new, contacted, completed, cancelled.');
        }

        return await this.inquiryRepository.updateStatus(id, status);
    }

    // Admin: Hapus Inquiry
    public async deleteInquiry(id: number): Promise<void> {
        const existingInquiry = await this.inquiryRepository.findById(id);
        if (!existingInquiry) {
            throw new Error(`Inquiry dengan ID ${id} tidak ditemukan.`);
        }

        await this.inquiryRepository.delete(id);
    }
}