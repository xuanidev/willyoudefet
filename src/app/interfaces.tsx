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