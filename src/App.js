import React, { useState } from "react";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import './App.css';
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
  ButtonGroup
 } from 'reactstrap';

const apiURL = "https://77b7b1ba.ngrok.io/api/lottery";

const methods = {
  create: "create",
  cancel: "cancel",
  participants: "participants"
}

let winnersCount = 12;

function App() {
  return (
    <Router>
      <Header />
      <Route exact path="/" component={Main} />
      <Route exact path="/waiting" component={Waiting} />
      <Route exact path="/winners" component={Winners} />
    </Router> 
  );
}

function Header() {
  return (
    <div className="App">
      <Jumbotron>
        <h1>Καλώς ήρθες στο <strong>Chair Massage Lottery</strong>!</h1>
        <br />
        <img src="/efood_logo.png" id="efood-logo" />
        <h1 className="emojis">💆‍♂️💆‍♀️</h1>
      </Jumbotron>    
    </div>
  )
}

function Main() {
  const [lotteryType, setLotteryType] = useState("1");
  const [timeWindow, setTimeWindow] = useState("10");
  const [maxWinners, setMaxWinners] = useState("12");
  const [question, setQuestion] = useState("Who..?");
  const history = useHistory();

  return (
    <Container>
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <Settings
            setLotteryType={setLotteryType}
            setTimeWindow={setTimeWindow}
            setMaxWinners={setMaxWinners}
            setQuestion={setQuestion}
          />

          <br />

          <QuestionBox
            lotteryType={lotteryType}
            timeWindow={timeWindow}
            maxWinners={maxWinners}
            question={question}
            setQuestion={setQuestion}
            history={history}
          />
        </Col>
      </Row>
    </Container>
  )
}

function Settings({ setLotteryType, setTimeWindow, setMaxWinners }) {
  return (
    <React.Fragment>
      <Row>
        <Col sm="7">
          <span className="custom-label">Τύπος:&nbsp;</span>
          <ButtonGroup>
            <Button outline active={true}>Ερώτηση</Button>
            <Button outline>Tag</Button>
            <Button outline>Multiple Choise</Button>
          </ButtonGroup>
        </Col>

        <Col sm="5">
          <InputGroup >
            <InputGroupAddon addonType="prepend">Χρόνος:</InputGroupAddon>
            <Input defaultValue={10} min={5} max={30} type="number" step="5" onChange={e => setTimeWindow(e.target.value)} />
            <InputGroupAddon addonType="append">λεπτά</InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>

      <br />

      <Row>
        <Col sm="4">
          <InputGroup >
            <InputGroupAddon addonType="prepend">Πόσοι τυχεροί;</InputGroupAddon>
            <Input defaultValue={winnersCount} min={1} max={30} type="number" step="1" onChange={e => setMaxWinners(e.target.value)} />
          </InputGroup>
        </Col>
      </Row>
    </React.Fragment>
  )
}

function QuestionBox({ lotteryType, timeWindow, maxWinners, question, setQuestion, history }) {
  return (
    <InputGroup>
      <Input placeholder="Ποιός είναι ο παλιότερος efooder?" onChange={e => setQuestion(e.target.value)} />
      <InputGroupAddon addonType="append">
        <Button color="success" onClick={() => startLottery(lotteryType, timeWindow, maxWinners, question, history)}>Go!</Button>
      </InputGroupAddon>
    </InputGroup>
  )
}

function startLottery(lotteryType, timeWindow, maxWinners, question, history) {
  let url = methods.create;
  let method = "POST";
  let postObj = {
    "max_winners" : maxWinners,
    question,
    "time_window": timeWindow
  }
  
  history.push("/Waiting");

  apiCall(url, method, postObj, history);
}

function apiCall(url, method = "GET", postObj, history) {
  fetch(`${apiURL}/${url}`, {
    method,
    body: JSON.stringify(postObj)
  })
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    winnersCount = postObj.max_winners;
    history.push("/Waiting");
  })
}

function Waiting() {
  const [participants, setParticipants] = useState([
    {
      name: "vag"
    },
    {
      name: "lab"
    }
  ]);

  return (
    <Container>
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          { participants.length > 0 && (
            <React.Fragment>
              <ul className="participants-list">
                { participants.length > 0 && (
                  participants.map((person => {
                    return <li>{person.name}</li>
                  }))
                )}
              </ul>
              
              <h2><strong>{participants.length} efooders. Only {winnersCount} lucky!</strong></h2>
            </React.Fragment>
          )}
        </Col>
      </Row>
    </Container>
  )
}

function Winners() {
  return (
    <Container>
      <Row>
        <Col sm={{ size: 8, offset: 2 }}>
          <h1 className="emojis">👏🎉🎊🥳💆‍♂️💆‍♀️</h1>
        </Col>
      </Row>
    </Container>
  )
}

export default App;
