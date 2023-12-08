'use client' 
import { useState,useEffect } from 'react'
import { quiz } from '../app/questions'
import './quiz.css'
import Image from 'next/image'
import granite from '../../public/wall-4-light.png'
import man from '../../public/manvs-yllw.png'
import replay from '../../public/icons/replay-icon.svg'
import localFont from 'next/font/local'

const myFont = localFont({ src: '../../public/fonts/ZTRavigsfen-Regular.otf' })
const { bgColors,choices } = quiz;

const scrollToBottom = () => {
  setTimeout(() => {
    const element = document.getElementById('bottom');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 600);
};
interface QuizProps {
  onSelect: (value: boolean) => void;
}
interface QuizQuestion {
  id: number;
  question__es: string;
  question__en: string;
  choices__es: string;
  choices__en: string;
  img: string;
  votes: number[]; // Assuming votes is an array of numbers
}
interface QuizQuestionString {
  id: number;
  question__es: string;
  question__en: string;
  choices__es: string;
  choices__en: string;
  img: string;
  votes: string; // Assuming votes is an array of numbers
}
interface QuizQuestionArray {
  todos: QuizQuestion[];
}
interface QuizQuestionStringArray {
  todos: QuizQuestionString[];
}



const Quiz: React.FC<QuizProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState(0); 
  const [currentVotes, setCurrentVotes] = useState(0);
  const [results, setResults] = useState<number[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [question, setQuestion] = useState("Would you win against a lion in a fight?");
  const [src, setSrc] = useState('/questions/lion.jpg');
  const [votes, setVotes] = useState<number[]>([])
  const [voted, setVoted] = useState<number[]>(() => {
    const storedData = localStorage.getItem('voted');
    return storedData ? JSON.parse(storedData) : [];
  });


  useEffect(() => {
    fetch("http://localhost:3000/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data: QuizQuestionString[]) => {
        // Deserialize the 'votes' array in each object
        const deserializedData = data.map((item: QuizQuestionString) => {
          return {
            ...item,
            votes: JSON.parse(item.votes),
          };
        });
        setQuestions(deserializedData);
        setQuestion(deserializedData[0].question__es);
        setVotes(deserializedData[currentAnswer].votes);
        
      let totalVotes = 0;
      console.log(deserializedData);
      deserializedData[selectedAnswerIndex].votes.forEach((vote: number)=>{
        totalVotes += vote
      })
      setCurrentVotes(totalVotes);
        setResults(deserializedData[selectedAnswerIndex].votes.map((result: number) => (Math.round((result / totalVotes) * 10000)/100)));
      });
    });
    localStorage.setItem('voted', JSON.stringify(voted));
  }, []);

  const postData = async (voted: number[]) => {
    const response = await fetch("http://localhost:3000/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ votes: voted }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  };
  
  const generateRandomQuestionId = async (voted: number[]) => {
    const availableQuestions = questions.map(question => question.id);
    const remainingQuestions = availableQuestions.filter(questionId => !voted.includes(questionId));
    let allVisited = false;
    let questionsGet: QuizQuestion[] = [];
    if (remainingQuestions.length === 0) {  
      try {
        const data = await postData(voted);
        const { todos } = data as QuizQuestionStringArray;
        allVisited = data.allVisited;
        console.log(data.todos);
        const deserializedData = todos.map((item:QuizQuestionString) => {
          console.log(item);
          return {
            ...item,
            votes: JSON.parse(item.votes),
          };
        });
        console.log(deserializedData);
        setQuestions(deserializedData);
        if(allVisited){
          localStorage.setItem('voted', '');
          setVoted([]);
        }
        setQuestion(deserializedData[0].question__es);
        setSrc(deserializedData[0].img); 
        setVotes(deserializedData[0].votes);
        questionsGet = deserializedData;
      } catch (error) {
        console.error("Error fetching data:", error);
      }

    } else {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      const randomQuestionId = remainingQuestions[randomIndex];
      const indexOfSelectedQuestion = questions.findIndex(question => question.id === randomQuestionId);
      return {randomNumber: indexOfSelectedQuestion,result: questions}
    }
    return {randomNumber: 0,result: questionsGet};
  };
  
  const nextQuestion = async () => {
    let {randomNumber,result} = await generateRandomQuestionId(voted);
    if(result != questions){
      setQuestion(result[randomNumber].question__es);
      setSrc(result[randomNumber].img); 
      setVotes(result[randomNumber].votes);
      console.log(result);
    }else{
      setQuestion(questions[randomNumber].question__es);
      setSrc(questions[randomNumber].img); 
      console.log(questions[randomNumber].votes);
      setVotes(questions[randomNumber].votes);
    }
    setSelected(false);
    onSelect(false);
    setCurrentAnswer(randomNumber);
  };

  const onAnswerSelected = (index: number) => {
    if(!selected){
      setSelected(!selected);
      onSelect(!selected);
      setSelectedAnswerIndex(index);
      if(!voted.includes(questions[currentAnswer].id)){
        const newVoted = [...voted, questions[currentAnswer].id];
        setVoted(newVoted);
        localStorage.setItem('voted', JSON.stringify(newVoted));
      }
      let totalVotes = 0;
      questions[currentAnswer].votes.forEach((vote:number)=>{
        totalVotes += vote
      })
      setCurrentVotes(totalVotes);
      if(totalVotes === 0){
        let totalVotes = [0, 0, 0, 0, 0];
        setResults(totalVotes);
      }else{
        setResults(questions[currentAnswer].votes.map((result:number) => (Math.round((result / totalVotes) * 10000)/100)));
      }
      /*fetch('http://localhost:3000/api', {
          method: 'POST',
          headers: {
              'Content-type': 'application/json',
          },
          body: JSON.stringify({ id: questions[currentAnswer].id,voted: index  }),
      })
          .then((response) => response.json())
          .then((data) => {
              console.log(data);
          })
          .catch((error) => {
              console.error(error);
      });*/
      scrollToBottom();
    }
  }

  return (
    <div className="quiz" style={{marginTop: !selected ? '' : '-1%',marginBottom: '1%', gap: !selected ? '12px' : '' } }>
      <h2 className={`question font-poppins ${!selected ? 'question-size' : ''}`} style={{paddingBottom: !selected ? '12px' : '8px', paddingTop: !selected ? '12px' : '8px',paddingLeft:!selected ? '16px' : '12px', paddingRight:!selected ? '16px' : '12px' }}><span className='question-mark'>¿</span>{question}<span className='question-mark'>?</span></h2>
      <div className='quiz-container ' style={{paddingBottom: !selected ? '' : '12px', paddingTop: !selected ? '16px' : '16px', paddingLeft:!selected ? '16px' : '12px', paddingRight:!selected ? '16px' : '12px' }}>
        <div className='quiz-box' style={{gap: !selected ? '16px' : '12px'}}>
          <div className='images-box'>
            <div className='images-box-center'>
            <div style={{backgroundImage: `url(${granite.src})`,}} className='bg-image__left'></div>
              <Image
                src={man}
                alt="Picture of the author"
                className='imgLeft'
              />
            </div>
            <div className='separator'>
              <p className={`${myFont.className}`}>VS</p>
            </div>
            <div className='images-box-center'>
              <div style={{backgroundImage: `url(${granite.src})`,}} className='bg-granite bg-granite-reverse'></div>
              <div style={{backgroundImage: `url(${src})`,}} className='bg-oponent'></div>
            </div>
          </div>
          <ul className='choices-box'>
            {choices.map((answer, index) => (
              <li
                onClick={() => onAnswerSelected(index)}
                key={index}
                className={`${
                    selectedAnswerIndex === index && selected ? 'selected-answer' : ''
                  }  ${selected && selectedAnswerIndex !== index ? 'not-selected-answer' : ''}  choice-option `}
                  
                  style={{backgroundColor: bgColors[index], gridArea: selectedAnswerIndex === index && selected ? '1 / 1 / 2 / 4' : '' }}
                  >
                  <div style={{backgroundImage: `url(${granite.src})`,}} className={`${index % 2 === 0 ? '' : 'bg-granite-reverse'} bg-granite`}></div>
                <button className={`${selected ? 'cursor-default' : ''} btnQuiz font-poppins`}>{answer}</button>
              </li>
            ))} 
            <li  className={`${selected ? 'grid_question-mark-full' : 'grid_question-mark'} again`} onClick={nextQuestion}>
            <Image
                src={replay}
                width={70}
                height={70}
                style={{marginTop: '10px' ,marginBottom: '-8px', paddingLeft: '16px', paddingRight: '16px'}}
                alt="replay-button"
                className={`${selected ? 'rotate' : ''}`}
              />
              <p className='again__text'>OTRA PREGUNTA</p>
            </li>
          </ul>
          <div className='result-content' style={{height: !selected ? 'auto' : '', gap: !selected ? '0px' : '16px'}}>
              <ul className='results-box' style={{backgroundImage: `url(${granite.src})`, height: !selected ? '0px' : '100px', padding: !selected ? '0px' : '', border: !selected ? 'none' : ''}}>
                {results.map((answer, index) => (
                  <li
                    key={index}
                    className='result-option relative'
                      >          
                      <div style={{height: `${answer}px`,backgroundColor: bgColors[index]}} className='bg-result'>
                        <div className='bg-bar' style={{ opacity: '70%', filter: 'brightness(100%)',height: !selected ? '0px' : '24px'}}></div>
                      </div>
                  </li>
                ))}
              </ul>
              <ul className='result__names' style={{height: !selected ? '0px' : '', padding: !selected ? '0px' : '', border: !selected ? 'none' : '', marginBottom: !selected ? '0px' : '' }}>
                {results.map((answer, index) => (
                  <li
                    key={index}
                    className='resultQuiz__tittle'
                    style={{display: !selected ? 'none' : '',backgroundColor: bgColors[index]}}
                      >          
                    {choices[index]}
                  </li>
                ))}
              </ul>
              <ul className='votes-box' style={{backgroundImage: `url(${granite.src})`, height: !selected ? '0px' : '', padding: !selected ? '0px' : '', border: !selected ? 'none' : '', marginBottom: !selected ? '0px' : '' }}>
                {results.map((answer, index) => (
                  <div className='totalQuiz' key={index}>
                    <div className='resultQuiz__percentage'>{`${!isNaN(answer) ? Math.ceil(answer) : 0}`}<span className='resultQuiz__decimal'>{`.${(answer.toString().split('.')[1] || '').slice(0, 2)}%`}</span></div>
                    <div className='resultQuiz__votes'>{`Votes: ${votes[index]}/${currentVotes}`}</div>
                  </div>
                ))}
              </ul>
            </div>
        </div>
                </div>
                <div id='bottom'></div>
    </div>
  )
}

export default Quiz