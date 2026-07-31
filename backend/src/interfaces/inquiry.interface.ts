export type ServiceType = 'photography' | 'videography' | 'editing' | 'all_in';
export type InquiryStatus = 'new' | 'contacted' | 'completed' | 'cancelled';

export interface IInquiry {
    id?: number;
    client_name: string;
    email: string;
    whatsapp_number: string;
    service_type: ServiceType;
    project_date?: string | Date | null;
    budget_range?: string | null;
    message: string;
    status?: InquiryStatus;
    created_at?: Date;
}

export interface ICreateInquiryInput {
    client_name: string;
    email: string;
    whatsapp_number: string;
    service_type: ServiceType;
    project_date?: string;
    budget_range?: string;
    message: string;
}

export interface IInquiryQueryFilters {
    status?: InquiryStatus;
    service_type?: ServiceType;
    search?: string;
    page?: number;
    limit?: number;
}