import supabase from '../../../utils/supabase';

export const defaultQuestion = [{id: 4, 
  img: "/questions/kangaroo.jpg", 
  choices__en: "Eyes closed,Yes,Not Sure,No,In my life", 
  choices__es: "Sin duda,Sí,No estoy seguro,No,En mi vida",
  question__en: "Would you win against a kangaroo with boxing gloves in a fight",
  question__es: "Le ganarias a un kanguro con guantes de boxeo en un combate"
}];

export const getQuestions = async (voted: number[], range: number) => {
    try {
      const votedString = `(${voted.join(',')})`;
      const { data: questionsResult } = await supabase.from('questions').select().not('id', 'in', votedString).range(range, range + 9);
      if (questionsResult && questionsResult.length > 0) {
        return {questionsResult, allVisited: false};
      }else{
        const { data: questionsResultAll } = await supabase.from('questions').select().range(0,9);
        if(questionsResultAll){
          console.log("emtra2");
          return {questionsResultAll, allVisited: true};
        }else{
          console.log("emtra4");
          return {questionsResult: undefined, allVisited:true}
        }
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    return {questionsResult: undefined, allVisited: false};
  };
  
export const getVotes = async ( id:number ) => {
    try {
      const { data: votesResult } = await supabase.from('votes').select().eq('id', id );
      if (votesResult) {
        console.log(votesResult);
        console.log(id);
        return votesResult;
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    return undefined;
  };

export const postVote = async ( id:number, index: number, votes:number[], currentVotes: number ) => {
    try {
      const fieldName = `${index + 1}`;
      const updateObject = { [fieldName]: votes[index] + 1, totalVotes: currentVotes +1};
      const { data: votesResult } = await supabase
      .from('votes')
      .update(updateObject)
      .eq('id', id);
  
      if (votesResult) {
        console.log("Vote posted!!");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

