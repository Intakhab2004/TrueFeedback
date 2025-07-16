import { Message } from "@/model/User";

export interface apiResponse{
    success: boolean,
    status: number,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Array<Message>,
    data?: {
        label: string,
        score: number
    }
}