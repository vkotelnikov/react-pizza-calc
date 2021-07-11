import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import pizzaImg from './index.jpeg';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import 'bootstrap/dist/css/bootstrap.min.css';

function Legend() {
  return (
    <div>
        <Row/>
        <Row>
            Цена
        </Row>
        <Row>
            Размер
        </Row>
        <Row>
            Радиус
        </Row>
        <Row>
            Цена/кв.см.
        </Row>
        <Row>
            Площадь
        </Row>
      </div>
  )
}

class PizzaCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      price: 500,
      radius: 25,
      maxRadius: 40,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
  }


  calcPizza = () => {
    // console.log(this.pizza.nativeElement);
    this.pizzaScale = this.sliderValue / this.sliderMaxValue;
    this.refreshSquareValueOnSliderMove();
    this.refreshPricePerCm();
  };

  handleChange(e) {
    // if(e.type === "input") {
      // this.calcPizza();
      this.setState({price: e.target.value});
    // }
  }

  handleRadiusChange(e) {
    this.setState({radius: e.target.value});
  }

  render() {
    let square = Math.round(Math.PI * Math.pow(this.state.radius / 2, 2));
    let pricePerSquareCm = (this.state.price / square).toPrecision(2);

    const pizzaScale = this.state.radius / this.state.maxRadius;
    let pizzaStyle = {
      transform: "scale(" + pizzaScale + ")"
    }
    return(
      <div>
        <Row className="justify-content-center">
            <img src={pizzaImg} style={pizzaStyle} id="pizzaImage" alt="pizzaImage"/>
        </Row>
        <Row className="justify-content-center">
            <input type="number" id="price" value={this.state.price} onChange={this.handleChange}/>
        </Row>
        <Row className="justify-content-center">
            <input id="slider" style={{width:"100%"}} type="range" value={this.state.radius} onChange={this.handleRadiusChange} min="15" max={this.state.maxRadius} />
        </Row>
        <Row className="justify-content-center">
            {this.state.radius} см
        </Row>
        <Row className="justify-content-center">
            {pricePerSquareCm}
        </Row>
        <Row className="justify-content-center">
            {square}
        </Row>
      </div>
    );
  }
}


ReactDOM.render(
  <Container fluid="md">
    <React.StrictMode>
      <Row md="auto" className="flex-nowrap justify-content-center align-items-end">
        <Col md="2">
          <Legend />
        </Col>
        <Col md="auto">
          <PizzaCard />
        </Col>
        <Col md="auto">
          <PizzaCard />
        </Col>
      </Row>
    </React.StrictMode>
  </Container>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
