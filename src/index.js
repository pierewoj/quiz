import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { interna } from './bank/interna.js'

const question_bank = interna

class Answer extends React.Component {
    render() {
        let q = this.props.value;
        let cls = q.isSelected ? "selectedAnswer" : "notSelectedAnswer";
        let textClass = this.props.showResults ? (q.isCorrect ? "answerTextCorrect" : "answerTextIncorrect") : "answerTextUnknown";

        return (
            <li onClick={() => this.props.toogleSelectionHandler(q.answerText)} class={cls}>
                <div>
                    <div class={textClass}>{q.answerText}</div>
                </div>
            </li>
        );
    }
}

class Question extends React.Component {
    render() {
        const isCorrect = isCorrectlyAnswered(this.props.value)
        const questionTextPrefix = this.props.showResults ? (isCorrect ? "[OK] " : "[WRONG] ") : "";
        const answers = this.props.value.answers.map((a) =>
            <Answer value={a} showResults={this.props.showResults} toogleSelectionHandler={ans => {
                if (this.props.showResults) {
                    return;
                }
                this.props.toogleSelectionHandler(this.props.value.questionText, ans)
            }}/>);
        return (
            <div>
                <div>{questionTextPrefix + this.props.value.questionText}</div>
                <ul class="answerList">{answers}</ul>
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showResults: false,
            questions: this.pickQuestions()
        }
    }

    render() {
        const qs = this.state.questions.map((q) =>
            <Question value={q} showResults={this.state.showResults}
                toogleSelectionHandler={(q,a) => this.toogleQuestionSelection(q,a)}/>);
        const buttons = []
        if (!this.state.showResults) {
            buttons.push(<button onClick={() => this.showResults()}>
                Show results
            </button>)
        } else {
            buttons.push(<button onClick={() => this.onceAgainSameSet()}>
                Same questions again
            </button>)
            buttons.push(<button onClick={() => this.newSet()}>
                New questions
        </button>)
        }
        
        const resultsText = this.state.showResults ?
            `Your score: ${this.state.questions.filter(q => isCorrectlyAnswered(q)).length}/${this.state.questions.length}`
        : null;

        return (
            <div>
                <div>
                {qs}
                </div>
                <div>
                    {resultsText}
                </div>
                <div>
                    {buttons}
                </div>
            </div>
        );
    }

    showResults() {
        this.setState({
            showResults: true,
            questions: this.state.questions,
        })
    }

    onceAgainSameSet() {
        this.setState({
            showResults: false,
            questions: this.copy_qs_with_unselected(this.state.questions)
        })
    }

    newSet() {
        this.setState({
            showResults: false,
            questions: this.pickQuestions(),
        })
    }

    pickQuestions() {
        let q_num = Math.min(10, question_bank.length);
        let qs = question_bank.slice()
            .filter(q => q.tags.includes(this.props.tag))
            .filter(q => !q.isHidden);
        shuffleArray(qs);
        qs=qs.slice(0, q_num);
        qs.forEach(q => {
            shuffleArray(q.answers)
        });
        return this.copy_qs_with_unselected(qs);
    }

    toogleQuestionSelection(questionText, answerText) {
        let updatedQuestions = this.state.questions.slice()
            .map(q => { return {
                questionText: q.questionText,
                tags: q.tags,
                answers: q.answers.map(a => { return {
                    answerText: a.answerText,
                    isCorrect: a.isCorrect,
                    isSelected: (questionText === q.questionText && answerText=== a.answerText) ?
                        !a.isSelected : a.isSelected
                }})
            }})
        this.setState({
            showResults: this.state.showResults,
            questions: updatedQuestions,
        });
    }

    copy_qs_with_unselected(qs) {
        return qs.map(q => { return {
                questionText: q.questionText,
                tags: q.tags,
                answers: q.answers.map(a => { return {
                    answerText: a.answerText,
                    isCorrect: a.isCorrect,
                    isSelected: false
                }})
            }});
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: false
        }
    }

    render() {
        let possible_tags = [...new Set(question_bank.flatMap(q => q.tags))]
        let buttons = possible_tags.map(tag => <div><button onClick={() => this.select_tag(tag)}>Category: {tag}</button></div>)
        let board = <div>
             <h1>Category: {this.state.tag} </h1>
             <Board tag={this.state.tag}/>
             <button onClick={() => this.resetCategory()}>Change category</button>
        </div> 
        return (
            <div className="game">
                <div>
                    {this.state.isSelected ? null : buttons}
                </div>
                <div className="game-board">
                    {this.state.isSelected ? board : null}
                </div>
            </div>
        );
    }

    select_tag(tag) {
        this.setState({
            isSelected: true,
            tag: tag
        })
    }

    resetCategory() {
        this.setState({
            isSelected: false
        })
    }
}

function isCorrectlyAnswered(question) {
    return question.answers.every(a => ! (a.isCorrect ^ a.isSelected))
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);