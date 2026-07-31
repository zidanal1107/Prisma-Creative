import { IMultilingualText } from './category.interface';

export type PortfolioType = 'photography' | 'videography' | 'editing';

export interface IPortfolio {
    id: number;
    user_id?: number | null;
    category_id?: number | null;
    slug: string;
    type: PortfolioType;
    title: IMultilingualText;
    description?: IMultilingualText | null;
    thumbnail_url: string;
    video_url?: string | null;
    before_image_url?: string | null;
    after_image_url?: string | null;
    client_name?: string | null;
    is_featured: boolean;
    created_at?: Date;

    // Joined fields dari category
    category_name?: IMultilingualText;
}

export interface ICreatePortfolioDTO {
    user_id?: number;
    category_id?: number;
    type: PortfolioType;
    title: IMultilingualText;
    description?: IMultilingualText;
    thumbnail_url: string;
    video_url?: string;
    before_image_url?: string;
    after_image_url?: string;
    client_name?: string;
    is_featured?: boolean;
}

export interface IUpdatePortfolioDTO {
    user_id?: number;
    category_id?: number;
    type?: PortfolioType;
    title?: IMultilingualText;
    description?: IMultilingualText;
    thumbnail_url?: string;
    video_url?: string;
    before_image_url?: string;
    after_image_url?: string;
    client_name?: string;
    is_featured?: boolean;
}

export interface IPortfolioFilter {
    category_id?: number;
    user_id?: number;
    type?: PortfolioType;
    is_featured?: boolean;
    search?: string;
    limit?: number;
    page?: number;
}