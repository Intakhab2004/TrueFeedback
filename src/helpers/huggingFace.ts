import { apiResponse } from "@/types/apiResponse";
import axios from "axios"

export const analyzeSentimentHuggingFace = async(text: string): Promise<apiResponse> => {
    try{
        const response = await axios.post("https://router.huggingface.co/hf-inference/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
            { inputs: text },
            {headers: {Authorization: `Bearer ${process.env.HF_AI_API}`}}
        )

        const data = {
            label: response.data[0][0].label,
            score: response.data[0][0].score
        }

        return {
            success: true,
            status: 200,
            message: "Analyzed sentiment successfully",
            data: data
        }
    }
    catch(error){
        console.log("Something went wrong while Hugging Face API call: ", error);
        return {
            success: false,
            status: 500,
            message: "Internal server error",
            data: {label: "Neutral", score: 0}
        }
    }
}