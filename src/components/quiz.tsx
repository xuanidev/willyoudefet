'use client' 
import { useState,useEffect } from 'react'
import {defaultQuestion, getQuestions, getVotes, postVote} from '../app/api/api'
import { quiz } from '../app/questions'
import { QuizProps, QuizQuestion, QuizVotes, QuizQuestionString, QuizQuestionStringArray, serializeQuestions, serializeVotes } from '../app/interfaces';
import './quiz.css'
import Image from 'next/image'
import granite from '../../public/wall-4-light.png'
import man from '../../public/manvs-yllw.png'
import replay from '../../public/icons/replay-icon.svg'
import localFont from 'next/font/local'

const myFont = localFont({ src: '../../public/fonts/ZTRavigsfen-Regular.woff' })
const { bgColors,choices } = quiz;

const scrollToBottom = () => {
  setTimeout(() => {
    const element = document.getElementById('bottom');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 600);
};

const Quiz: React.FC<QuizProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState(1); 
  const [currentVotes, setCurrentVotes] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [question, setQuestion] = useState("Le ganarias a un leon en un combate");
  const [src, setSrc] = useState('/questions/lion.jpg');
  const [votes, setVotes] = useState<number[]>([]);
  const [percentage, setPercentage] = useState<number[]>([])
  const [voted, setVoted] = useState<number[]>([]);
  const [range, setRange] = useState(0);
  //const [isAllVisited, setIsAllVisited] = useState(false);

  const createVotes = (votesResult: QuizVotes[]) =>{
    const totalVotes: QuizVotes[] = serializeVotes(votesResult);
    setCurrentVotes(totalVotes[0].totalVotes);
    const delayedVotesUpdate = () => {
      let votes = [totalVotes[0][1], totalVotes[0][2], totalVotes[0][3], totalVotes[0][4], totalVotes[0][5]];
      setVotes(votes);
    };
    setTimeout(delayedVotesUpdate, 600);
  }

  const generateRandomQuestionId = async (voted: number[]) => {
    const availableQuestions = questions.map(question => question.id);
    const remainingQuestions = availableQuestions.filter(questionId => !voted.includes(questionId));
    let questionsGet: QuizQuestion[] = [];
    let votesGet: QuizVotes[] = [];
    if (remainingQuestions.length === 0) {  
      try {
        let {questionsResult, allVisited} = await getQuestions(voted, range);
        console.log(questionsResult);
        console.log(allVisited);
        if(allVisited){
          localStorage.setItem('voted', '');
          setRange(0);
          setVoted([]);
        }
        if(!questionsResult){
          questionsResult = defaultQuestion;
        }
        //setIsAllVisited(allVisited);
        setRange( range + 9);
        questionsGet = serializeQuestions(questionsResult);
        const votesResult = await getVotes(currentAnswer);
        if (questionsResult && votesResult) {
          createVotes(votesResult);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      const randomQuestionId = remainingQuestions[randomIndex];
      const indexOfSelectedQuestion = questions.findIndex(question => question.id === randomQuestionId);
      const votesResult = await getVotes(randomQuestionId);
      votesGet = serializeVotes(votesResult);
      createVotes(votesGet);

      return {randomNumber: indexOfSelectedQuestion,result: questions}
    }
    return {randomNumber: 0,result: questionsGet};
  };

  useEffect(() => {
    let storedData = localStorage.getItem('voted');
    let storedDataAux = storedData ? JSON.parse(storedData) : [];
    setVoted(storedData ? JSON.parse(storedData) : []);
    const fetchData = async () =>{
      let {randomNumber,result} = await generateRandomQuestionId(storedDataAux);
      console.log(result);
      setQuestions(result);
      if(result != questions){
        setQuestion(result[randomNumber].question__es);
        setSrc(result[randomNumber].img); 
      }else{
        setQuestion(questions[randomNumber].question__es);
        setSrc(questions[randomNumber].img); 
      }
      setSelected(false);
      onSelect(false);
      setCurrentAnswer(randomNumber);
    }
    fetchData().catch(console.error);
    //localStorage.setItem('voted', JSON.stringify(voted));
  }, []);

  
  const nextQuestion = async () => {
    setPercentage([0,0,0,0,0]);
    setVotes([0,0,0,0,0]);
    let {randomNumber,result} = await generateRandomQuestionId(voted);
    if(result != questions){
      setQuestion(result[randomNumber].question__es);
      setSrc(result[randomNumber].img); 
    }else{
      setQuestion(questions[randomNumber].question__es);
      setSrc(questions[randomNumber].img); 
    }
    setSelected(false);
    onSelect(false);
    setCurrentAnswer(randomNumber);
  };

  const onAnswerSelected = async (index: number) => {
    if(!selected){
      setSelected(!selected);
      onSelect(!selected);
      setSelectedAnswerIndex(index);
      if(!voted.includes(questions[currentAnswer].id)){
        const newVoted = [...voted, questions[currentAnswer].id];
        setVoted(newVoted);
        localStorage.setItem('voted', JSON.stringify(newVoted));
      }
      await postVote(questions[currentAnswer].id,index, votes, currentVotes);
      if(currentVotes === 0){
        let totalVotes = [0, 0, 0, 0, 0];
        totalVotes[index] = 1;
        setVotes(totalVotes);
      }else{
        let votesAux = votes;
        votesAux[index] = votesAux[index] + 1;
        setPercentage(votesAux);
        setVotes(votesAux.map((result:number) => (Math.round((result / currentVotes) * 10000)/100)));
      }
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
          <div className='result-content' style={{height: !selected ? '0px' : '200px', gap: !selected ? '0px' : '16px'}}>
                  <div className='result-content__top' style={{backgroundImage: `url(${granite.src})`, padding: !selected ? '0px' : '', border: !selected ? 'none' : '', height: !selected ? '0px' : 'auto', opacity: !selected ? '0px' : 'auto' }}>
                    <ul className='result__names' style={{height: !selected ? '0px' : '', padding: !selected ? '0px' : '', border: !selected ? 'none' : '', marginBottom: !selected ? '0px' : '' }}>
                      {votes.map((answer, index) => (
                        <li
                          key={index}
                          className='resultQuiz__tittle'
                          style={{display: !selected ? 'none' : '',backgroundColor: bgColors[index]}}
                            >          
                          {choices[index]}
                        </li>
                      ))}
                    </ul>
                    <ul className='results-box' >
                      {votes.map((answer, index) => (
                        <li
                          key={index}
                          className='result-option relative'
                            >          
                            <div style={{height: `${answer}px`,backgroundColor: bgColors[index], border: `${isNaN(answer) || answer == 0 ? 'none' : ''}` }} className='bg-result'>
                              <div className='bg-bar' style={{ opacity: '70%', filter: 'brightness(100%)',height: !selected ? '0px' : '24px'}}></div>
                            </div>
                        </li>
                      ))}
                    </ul>
                  </div>

              <ul className='votes-box' style={{backgroundImage: `url(${granite.src})`, height: !selected ? '0px' : '', padding: !selected ? '0px' : '', border: !selected ? 'none' : '', marginBottom: !selected ? '0px' : '' }}>
                {votes.map((vote, index) => (
                  <div className='totalQuiz' key={index}>
                    <div className='resultQuiz__percentage'>{`${!isNaN(vote) ? Math.ceil(vote) : 0}`}<span className='resultQuiz__decimal'>{`.${(vote.toString().split('.')[1] || '').slice(0, 2)}%`}</span></div>
                    <div className='resultQuiz__votes'>{`Votes: ${percentage[index]}/${currentVotes + 1}`}</div>
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