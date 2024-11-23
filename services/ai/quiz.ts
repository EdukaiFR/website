import axios from "axios";
import 'dotenv/config';

export interface QuizService {
    generateQuiz: (recognizedText: string[]) => Promise<any>;
}

export function useQuizService(): QuizService {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const generateQuiz = async (recognizedText: string[]) => {
        try {
            const textString = recognizedText.join('\n');

            const response = await axios.post(`${apiUrl}/ai/generate-qcm`,
                {textString});

            return response.data;
        } catch (error) {
            console.error('An error ocurred generating the Quiz', error);
        }
    }

    return { generateQuiz };
}