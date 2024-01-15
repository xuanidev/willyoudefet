export type QuizProps = {
    onSelect: (value: boolean) => void;
  };
  
  export type QuizQuestion = {
    id: number;
    question__es: string;
    question__en: string;
    choices__es: string;
    choices__en: string;
    img: string;
    votes: number[]; 
  };
  export type QuizVotes = {
    id: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    totalVotes: number; 
  };
  
  export type QuizQuestionString = {
    id: number;
    question__es: string;
    question__en: string;
    choices__es: string;
    choices__en: string;
    img: string;
    votes: string;
  };
  
  export type QuizQuestionStringArray = {
    todos: QuizQuestionString[];
  };

  export const serializeQuestions = (questionsResult: any): QuizQuestion[] => {
    if (questionsResult) {
      const formattedQuestions: QuizQuestion[] = questionsResult.map((question: any) => {
        return {
          id: question.id,
          question__es: question.question__es,
          question__en: question.question__en,
          choices__es: question.choices__es,
          choices__en: question.choices__en,
          img: question.img
        };
      });
  
      return formattedQuestions;
    }
  
    return [];
  };
  
  export const serializeVotes = (votesResult: any): QuizVotes[] => {
    if (votesResult) {
      const formattedVotes: QuizVotes[] = votesResult.map((votes: any) => {
        return {
          id: votes.id,
          1: votes['1'],
          2: votes['2'],
          3: votes['3'],
          4: votes['4'],
          5: votes['5'],
          totalVotes: votes.totalVotes,
        };
      });
  
      return formattedVotes;
    }
  
    return [];
  };