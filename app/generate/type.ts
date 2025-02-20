interface Question {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export type QuizResponse = {
  success: boolean;
  message: Question[];
};
