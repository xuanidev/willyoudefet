import supabase from '../../../utils/supabase';

export const getQuestions = async (voted: number[], range: number) => {
    try {
      const votedString = `(${voted.join(',')})`;
      console.log(typeof votedString);
      const { data: questionsResult } = await supabase.from('questions').select().not('id', 'in', votedString).range(range, range + 9);
      console.log(questionsResult);
      if (questionsResult) {
        return questionsResult;
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    return undefined;
  };
  
export const getVotes = async ( id:number ) => {
    console.log("get Votes id: " + id);
    try {
      const { data: votesResult } = await supabase.from('votes').select().eq('id', id );
      if (votesResult) {
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
      console.log(updateObject);
      console.log(id);
      console.log(currentVotes);
  
      const { data: votesResult } = await supabase
      .from('votes')
      .update(updateObject)
      .eq('id', id);
  
      if (votesResult) {
        console.log(votesResult);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

