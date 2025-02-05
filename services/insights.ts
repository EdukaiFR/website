import axios from "axios";
import 'dotenv/config';

export interface InsightsService {
    createInsight: (quizId: string, score: number) => Promise<any>;
    getQuizInsights: (quizId: string) => Promise<any>;
}

export function useInsightsService() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const createInsight = async (quizId: string, score: number) => {
        try {
            const response = await axios.post(`${apiUrl}/insights/${quizId}`,
                { score },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error('An error ocurred creating the insight', error);
        }
    }

    const getQuizInsights = async (quizId: string) => {
        try {
            const response = await axios.get(`${apiUrl}/insights/${quizId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.error(`An error ocurred fetching insights`, error);
        }
    }

    return { createInsight, getQuizInsights };
}




