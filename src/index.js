import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import pizzaImg from './index.jpeg';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form'

import 'bootstrap/dist/css/bootstrap.min.css';

function Legend() {
  const labels = [null, 'Цена', 'Радиус', 'Размер', 'Площадь', 'Цена/кв.см',];
  return labels.map(function(label, index) {
      return (
        <Row key={index}>
          <Col>
            {label}
          </Col>
        </Row>
      )
  });
}

class PizzaCard extends React.Component {

  constructor(props) {
    super(props);

    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
  }

  handlePriceChange(e) {
    this.props.onPriceChange(e.target.value, this.props.id);
  }

  handleRadiusChange(e) {
    this.props.onRadiusChange(e.target.value, this.props.id);
  }

  render() {
    const pizzaScale = this.props.radius / this.props.maxRadius;
    let pizzaStyle = {
      transform: "scale(" + pizzaScale + ")"
    }

    let items = [
      <Image fluid src={pizzaImg} style={pizzaStyle} id="pizzaImage" alt="pizzaImage"/>,
      <Form.Control type="number" id="price" value={this.props.price} onChange={this.handlePriceChange}/>,
      this.props.radius + ' см',
      <Form.Control id="slider" type="range" value={this.props.radius} onChange={this.handleRadiusChange} min="15" max={this.props.maxRadius}/>,
      this.props.square,
      this.props.pricePerSquareCm
    ]

  return items.map(function(item, index) {
    return (
      <Row key={index} noGutters>
        <Col align="center">
            {item}
        </Col>
      </Row>
    )
  });

  }
}

class PizzaCardRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pizzaCards: [
        {
          price: 500,
          radius: 25,
          maxRadius: 40,
        },
        {
          price: 500,
          radius: 25,
          maxRadius: 40,
        },
      ]
    };

    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
  }

  handlePriceChange(newPrice, index) {
    let newPizzaCards = this.state.pizzaCards.slice();
    newPizzaCards[index].price = newPrice;
    this.setState({pizzaCards: newPizzaCards});
  }

  handleRadiusChange(newRadius, index) {
    let newPizzaCards = this.state.pizzaCards.slice();
    newPizzaCards[index].radius = newRadius;
    this.setState({pizzaCards: newPizzaCards});
  }

  getPricePerCmAndSquare(pizza) {
    let square = Math.round(Math.PI * Math.pow(pizza.radius / 2, 2));
    let pricePerSquareCm = (pizza.price / square).toPrecision(2);
    return {
      pricePerSquareCm: pricePerSquareCm,
      square: square,
    }
  };

  prepareStyles(styles, params, cheaperPizzaIndex, costlyPizzaIndex) {
    let ratio = Math.pow(0.6, 2) * (100 - (params[cheaperPizzaIndex].pricePerSquareCm * 100 / params[costlyPizzaIndex].pricePerSquareCm)) / 100;
    
    styles[costlyPizzaIndex].style = {
      backgroundImage: 'linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0), rgba(255,0,0,' + (ratio) + '))',
    };
    styles[cheaperPizzaIndex].style = {
      backgroundImage: 'linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0), rgba(0,255,0,' + (ratio) + '))',
    };
  }

  render() {
    let params = [this.getPricePerCmAndSquare(this.state.pizzaCards[0]), this.getPricePerCmAndSquare(this.state.pizzaCards[1]), ];

    let styles=[{},{}];
    
    if (params[0].pricePerSquareCm > params[1].pricePerSquareCm) {
      this.prepareStyles(styles, params, 1, 0);
    } else {
      this.prepareStyles(styles, params, 0, 1);
    }

    let pizzas = this.state.pizzaCards.map((pizza, index) => {
      return (
        <Col className="pl-1 pr-1" key={index} style={styles[index].style}>
            <PizzaCard id={index} price={this.state.pizzaCards[index].price} radius={this.state.pizzaCards[index].radius} square={params[index].square} pricePerSquareCm={params[index].pricePerSquareCm} maxRadius={pizza.maxRadius} onPriceChange={this.handlePriceChange} onRadiusChange={this.handleRadiusChange}/>
        </Col>
      );
    });

    return pizzas;
  }
}

ReactDOM.render(
  <Container fluid>
    <React.StrictMode>
      <Row>
        <Col align="center">
          <h1>Узнай какая пицца выгоднее</h1>
        </Col>
      </Row>
      <Row className="flex-nowrap justify-content-center align-items-end">
        <Col xs="4" >
          <Legend />
        </Col>
        <PizzaCardRow />
      </Row>
    </React.StrictMode>
  </Container>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
