import { BaseModel } from '../../_base/crud';
export class PosDetails {
    message:string;
    date:string;
    changeDate:boolean;
    chatStatus: number;
    profileImageUrl:string;
    type: string;
    entity_id: number;
    sender_id: number;
    receiver_id: number;
    sender_name:string;
    receiver_name: string;
    sender_unique_id: string;
    receiver_unique_id: string;

    clear(): void {
        this.message = '';
    }
}