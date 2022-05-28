import Navbar from './components/Navbar';
import Card from './components/Card';
import React, { Component} from 'react';
//import {Helmet} from "react-helmet";
import './App.css';
import jsPDF from 'jspdf'

var counter = 0;
const proxyUrl = "https://cors.mtgproxy.it/";

class App extends Component{
  constructor(props){
    super(props);
    this.bottom = React.createRef();
  }  
  
  state = {
    cards: []
  }

  input = {text : null}


  encodeURL = (url) => {
    return proxyUrl + url;
  }
  
  fetchCard = async (url, q) => {
    var quantity = q;
    if(q == null)
      quantity = 1;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    if(data['object'] === 'error'){
      console.log("OPS");
      return;
    }
    const setResponse = await fetch(data['prints_search_uri']);
    const setData = await setResponse.json();

    var cards = [...this.state.cards];

    var set_list = [];
    var set_list2 = [];


    if("card_faces" in data){
      setData['data'].map(object => set_list.push({set_name: object['set_name'], image: this.encodeURL(object['card_faces'][0]['image_uris']['border_crop'])}));
      setData['data'].map(object => set_list2.push({set_name: object['set_name'], image: this.encodeURL(object['card_faces'][1]['image_uris']['border_crop'])}));
      cards.push({id: ++counter, name: data['name'] + " [0]", image: set_list[0]['image'], quantity: quantity, sets: set_list, selected: 0});
      cards.push({id: ++counter, name: data['name'] + " [1]", image: set_list2[0]['image'], quantity: quantity, sets: set_list2, selected: 0});
    }
    else{
      setData['data'].map(object => set_list.push({set_name: object['set_name'], image: this.encodeURL(object['image_uris']['border_crop'])}));
      cards.push({id: ++counter, name: data['name'], image: set_list[0]['image'], quantity: quantity, sets: set_list, selected: 0});
    }
    this.setState({cards});
    
    this.bottom.current.scrollIntoView({ behavior: "smooth" });
  }

  handleAddCard = async () => {
    console.log(this.input.text);
    if(this.input.text == null || this.input.text === " ")
      return;
    const url = encodeURI('https://api.scryfall.com/cards/named?fuzzy=' + this.input.text);
    this.fetchCard(url);
    
  }

  handleRandom = async () => {
    const url = encodeURI('https://api.scryfall.com/cards/random');
    this.fetchCard(url);
  }

  handleIncrement = card => {
    const cards = [...this.state.cards];
    const index = cards.indexOf(card);
    cards[index] = {...card};
    cards[index].quantity++;
    this.setState({cards});
  }

  handleDecrement = card => {
    var cards = [...this.state.cards];
    const index = cards.indexOf(card);
    cards[index] = {...card};
    cards[index].quantity--;

    if(cards[index].quantity < 1)
      cards = this.state.cards.filter(_card => _card.id !== card.id);

    this.setState({cards});
  }

  handleChange = e => {
    this.input.text = e.target.value;
  }

  handleSelect = (e, card) => {
    var cards = [...this.state.cards];
    const index = cards.indexOf(card);
    cards[index] = {...card};
    cards[index].image = cards[index].sets[e.target.selectedIndex]['image'];
    cards[index].selected = e.target.selectedIndex;
    this.setState({cards});
  }

  handleLoad = async (textArea) => {
    //console.log(textArea.current);
    const text = textArea.current.value;
    //console.log(text);
    var lines = text.split('\n');
    for(var i=0; i < lines.length; i++){
      var currentLine = lines[i];
      var firstTwoChars = currentLine.substring(0, 2);
      if(firstTwoChars === "//")
        continue;
      //console.log(currentLine);
      const spaceIndex = currentLine.indexOf(" ");
      const quantity = parseInt(currentLine.slice(0, spaceIndex));
      const cardName = currentLine.slice(spaceIndex+1); 
      const url = encodeURI('https://api.scryfall.com/cards/named?fuzzy=' + cardName);
      this.fetchCard(url, quantity);
    }

};

  handleSave = async() => {
      var pdf = new jsPDF();
      var width = 480/8;
      var height = 680/8;
      var cardIndex = 0;
      var cardsList = [];

      this.state.cards.forEach(card => {
        for(var i = 0; i < card['quantity']; i++)
          cardsList.push(card['image']);
        });

      //console.log(cardsList);
      const n = cardsList.length;
      const padding = 15;

      var img = new Image(480, 680);
      for(var i = 0; i < 3 && cardIndex < n; i++)
        for(var j = 0; j < 3 && cardIndex < n; j++){
          img.src = cardsList[cardIndex];
          //console.log(cardIndex + " | i: " + i +" | j: "+j)
          pdf.addImage(img, 'png', padding + width*j, padding + height*i, width, height, '', '');
          cardIndex++;
          if(i === 2 && j === 2 && cardIndex < n){
            i = 0;
            j = -1;
            pdf.addPage();
          }
      } 
      
      pdf.save("download.pdf");
  }

  render(){
    return (
      <>

      <Navbar onChange={this.handleChange} onLoad={this.handleLoad} onAdd={this.handleAddCard} onRandom={this.handleRandom} onSave={this.handleSave}/>
      <div className="container">
        <div className="row">
          {this.state.cards.map(card => (
            <Card
              key = {card.id}
              card = {card}
              onIncrement={this.handleIncrement}
              onDecrement={this.handleDecrement}
              onSelect={this.handleSelect}
              selected={card.selected}
              />
            ))}
        </div>
      </div>
      <div ref={this.bottom} />
      </>
    );
  }
}

export default App;
