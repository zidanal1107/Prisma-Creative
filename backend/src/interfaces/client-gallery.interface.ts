export interface IClientGallery {
    id?: number;
    client_name: string;
    project_name: string;
    access_code: string;
    expired_at?: string | Date | null;
    created_at?: Date;
    media?: IClientGalleryMedia[];
}

export interface IClientGalleryMedia {
    id?: number;
    client_gallery_id: number;
    media_url: string;
    media_type: 'image' | 'video';
    is_selected: boolean;
    notes?: string | null;
}

export interface ICreateGalleryInput {
    client_name: string;
    project_name: string;
    expired_at?: string;
}