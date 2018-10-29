import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import User from './components/User';
import Hobby from './components/Hobby';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: [],
      userInput: '',
      displayNumber: '5',
      currentPage: '0',
      query: '',
      filteredrestaurants: [],
      cRestaurants: null,
      elementCount: null,
      modifMod: false,
      insertMod: false,
      colMod: false,
      showMessage: false,
      message: '',
      notActiveClass: 'col-lg-12',
      activeClass: 'col-lg-8',
      selectedForModification: null,
      modifRestaurant: {
        id: null,
        nom: null,
        cuisine: null
      },
      newRestaurant: {
        nom: null,
        cuisine: null
      }
    }
  }

  addHobby() {
    let oldHobbies = this.state.hobbies;
    this.setState({
      hobbies: oldHobbies.concat(this.input.value)
    });

    this.input.value = "";
  }

  removeHobby(hobby) {
		/*
		let oldHobbies = this.state.hobbies;
		let pos = this.state.hobbies.indexOf(hobby);
		oldHobbies.splice(pos, 1);
		*/
    const oldHobbies = this.state.hobbies.filter(
      (elem, index) => {
        return (elem !== hobby) ? elem : null;
      }
    );

    this.setState({
      hobbies: oldHobbies
    });
  }
  getDataFromServer(url) {
    console.log("--- GETTING DATA ---");
    fetch(url)
      .then(response => {
        response.json().then(res => {
          console.log(res);
          this.setState({ restaurants: res.data })
          this.setState({ filteredrestaurants: this.state.restaurants })
          // this.state.restaurants = res.data;
          //this.state.filteredrestaurants = this.state.restaurants;

          console.log(this.state.restaurants)

        })
      })
      .catch(err => {
        console.log("erreur dans le get : " + err)
      });
  }

  removeRestaurant(id, index) {
    let url = "http://localhost:8080/api/restaurants/" + id;
    console.log(id);
    console.log(url);

    fetch(url, {
      method: "DELETE",
    })
      .then((responseJSON) => {
        console.log("element supprimé")
        this.state.restaurants.splice(index, 1)
        this.state.filteredrestaurants.splice(index, 1)
        this.state.message = 'Ce restaurant a été supprimé'
        this.state.showMessage = true
        console.log("restaurant retiré")
        this.getDataFromServer('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.displayNumber)

        setTimeout(() => {
          this.state.showMessage = false
        }, 3000)
      })
      .catch(function (err) {
        console.log(err);
      });

  }

  countRestaurants(gurl) {
    let url = gurl;
    fetch(url)
      .then(response => {
        response.json().then(res => {
          this.state.elementCount = res.data;
          this.state.cRestaurants = Math.ceil(this.state.elementCount / this.state.displayNumber);
        })
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  componentWillMount() {
    console.log("Component will mount");
    // on va chercher des donnees sur le Web avec fetch, comme
    // on a fait avec VueJS
    this.countRestaurants('http://localhost:8080/api/restaurants/count')
    this.getDataFromServer('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.displayNumber);
  }

  

  showInsertForm() {
    this.state.colMod = true;
    this.state.modifMod = false;
    console.log(this.state.colMod)
    console.log(this.state.modifMod)
    setTimeout(() => {
      this.state.insertMod = true;
    }, 300)
    this.getDataFromServer('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.displayNumber)


  }

  navigate(element) {
    let cnumber = parseInt(element.target.innerHTML) - 1;
    this.state.currentPage = cnumber;
    let url = 'http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.displayNumber
    if (this.state.query.length > 0) {
      url = 'http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.displayNumber + '&name=' + this.state.query
    }
    this.getDataFromServer(url)
    if (element.target.id == 'thirdButton' || element.target.id == 'firstButton') {
      if (this.state.currentPage == 0 || this.state.currentPage == Math.ceil(this.state.elementCount / this.state.displayNumber)) {
        console.log('exit')
        return;
      }
      console.log(this.state.currentPage)
      console.log('changing')
      document.querySelector('#firstButton').innerHTML = cnumber;
      document.querySelector('#secondButton').innerHTML = cnumber + 1;
      document.querySelector('#thirdButton').innerHTML = cnumber + 2;
    }
  }

  confirmUpdateRestaurant(e) {
    e.preventDefault();
    console.log("e == ", e)
    if (!this.state.modifRestaurant.nom || !this.state.modifRestaurant.cuisine) {
      return;
    }
    this.state.colMod = false;
    this.state.modifMod = false;
    let rest = this.state.selectedForModification
    this.state.selectedForModification = null
    let url = "http://localhost:8080/api/restaurants/" + this.state.modifRestaurant.id;
    let form = new FormData(document.getElementById('formulaireModificationform'));
    fetch(url, {
      method: "PUT",
      body: form
    })
      .then((responseJSON) => {
        rest.name = this.state.modifRestaurant.nom
        rest.cuisine = this.state.modifRestaurant.cuisine
        this.state.message = 'Ce restaurant a été modifié'
        this.state.showMessage = true
        this.getDataFromServer('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.displayNumber)
        setTimeout(() => {
          this.state.showMessage = false
        }, 3000)
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  showRestaurant(rest, index) {
    console.log(rest)
    this.state.selectedForModification = rest;
    console.log(this.state.selectedForModification)
    this.state.modifRestaurant.id = rest._id;
    console.log(this.state.modifRestaurant.id)
    this.state.modifRestaurant.nom = rest.name;
    this.state.modifRestaurant.cuisine = rest.cuisine;
    console.log(this.state.modifRestaurant.cuisine)
    this.state.colMod = true;
    this.state.insertMod = false;
    this.getDataFromServer('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.displayNumber)
    setTimeout(() => {
      this.state.modifMod = true;
    }, 300)
  }

  addRestaurant(e) {
    e.preventDefault()
    if (!this.state.newRestaurant.nom || !this.state.newRestaurant.cuisine) {
        return;
    }
    this.state.colMod = false;
    this.state.insertMod = false;
    let url = "http://localhost:8080/api/restaurants"
    let form = new FormData(document.getElementById('formulaireInsertionform'));
    fetch(url, {
        method: "POST",
        body: form
    })
        .then((responseJSON) => {
            responseJSON.json()
                .then((res) => {
                    this.state.filteredrestaurants.unshift({ _id: res.result, name: this.state.newRestaurant.nom, cuisine: this.state.newRestaurant.cuisine })
                    this.state.message = 'Ce restaurant a été ajouté'
                    this.setState({showMessage: true}, () => this.getDataFromServer('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.displayNumber)                    )
                    setTimeout(() => {
                        this.state.showMessage = false
                    }, 3000)
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

  handleChange(event) {
    this.setState({ displayNumber: event.target.value }, () => {    this.getDataFromServer('http://localhost:8080/api/restaurants?page=' + this.state.currentPage + '&pagesize=' + this.state.displayNumber)
  });
  }

  handleNameChange(event){
    this.state.modifRestaurant.nom = event.target.value
    console.log(this.state.modifRestaurant.nom)
  }

  handleCuisineChange(event){
    this.state.modifRestaurant.cuisine = event.target.value
  }

  handleIdChange(event){
    this.state.modifRestaurant.id = event.target.value
  }

  render() {
    console.log("render");
    return (
      <body>
        <div id="app">
          <div className="container" style={{ position: "relative" }}>
            <br></br>
            <h2>Table des restaurants</h2>
            <button type="button" className="btn btn-dark mb-3" id="createButton" onClick={() => this.showInsertForm()}>Insertion<i className="fa fa-plus"></i></button>
            <div style={{ position: "absolute", top: "15px", right: "15px", left: "15px", transition: "0.2s" }} id="succesAlert"
              className={this.state.showMessage ? "alert alert-success" : "d-none"} role="alert">
              <h6 className="alert-heading">Opération réussie</h6>
              <p>{this.state.message}</p>
            </div>
            <div className="row">
              <div id="tableArea" className={this.state.colMod.bind ? this.state.activeClass : this.state.notActiveClass} style={{ transition: "0.2s" }}>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="elementPageDropDown">Elements par page</label>
                  </div>
                  <select onChange={this.handleChange.bind(this)} className="custom-select" id="elementPageDropDown">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                </div>
                <div className="input-group mb-3">
                  <input id="searchInput" className="form-control" placeholder="Chercher par nom" model={this.state.query}></input>
                </div>
                <table className="table table bordered" id="myTable">
                  <thead className="thead-dark">
                    <tr>
                      <th>Nom</th>
                      <th>Cuisine</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.restaurants.map(
                      (el, index) => {
                        return (
                          <tr htmlFor={(el, index) in this.state.filteredrestaurants}>
                            <td>{el.name}</td>
                            <td>{el.cuisine}</td>
                            <td>
                              <button className="btn btn-dark" onClick={(e) => this.showRestaurant(el, index)}>Edit<i className="fa fa-edit"></i></button>
                              <button className="btn btn-dark" onClick={(e) => this.removeRestaurant(el._id, index)}>Delete</button>
                            </td>
                          </tr>
                        )
                      }
                    )
                    }
                  </tbody>
                </table>
                <br></br>
                <div className="navigation">
                  <button type="button" className="btn btn-dark" id="firstButton" onClick={this.navigate.bind(this)}>1</button>
                  <button type="button" className="btn btn-dark" id="secondButton" onClick={this.navigate.bind(this)}>2</button>
                  <button type="button" className="btn btn-dark" id="thirdButton" onClick={this.navigate.bind(this)}>3</button>
                  ...................
                    <button type="button" className="btn btn-dark" id="lastPageButton" onClick={this.navigate.bind(this)}>{this.state.cRestaurants}</button>
                </div>
              </div>
              <div className={this.state.modifMod ? "col-lg-4" : "d-none"} style={{ transition: "1s" }} id="formulaireModification">
                <div className="card">
                  <div className="card-body">
                    <form id="formulaireModificationForm" onSubmit={this.putRequest}>
                      <div className="form-group">
                        <label htmlFor="idInput">Id :</label>
                        <input className="form-control" id="idInput" type="text" name="_id" value="56b9f89be0adc7f00f348cf6"
                          required placeholder="Id du restaurant à modifier" onChange={this.handleIdChange.bind(this)}></input>
                      </div>
                      <div className="form-group">
                        <label htmlFor="restaurantInput">Nom</label>
                        <input className="form-control" id="restaurantInput" type="text" name="nom" required
                          placeholder="Michel's restaurant" onChange={this.handleNameChange.bind(this)}></input>
                      </div>
                      <div className="form-group">
                        <label htmlFor="cuisineInput">Cuisine</label>
                        <input className="form-control" id="cuisineInput" type="text" name="cuisine" required
                          placeholder="Michel's cuisine" onChange={this.handleCuisineChange.bind(this)}></input>
                      </div>
                      <button className="btn btn-dark" onClick={this.confirmUpdateRestaurant.bind(this)}>Modifier ce
                                    restaurant</button>
                    </form>
                  </div>
                </div>
              </div>
              <div className={this.state.insertMod ? "col-lg-4" : "d-none"} style={{ transition: "1s" }} id="formulaireInsertion">
                <div className="card">
                  <div className="card-body">
                    <form id="formulaireInsertionform">
                      <div className="form-group">
                        <label htmlFor="restaurantInput">Nom</label>
                        <input className="form-control" id="restaurantInputId" type="text" name="nom" required
                          placeholder="Michel's restaurant" model="newRestaurant.nom"></input>
                      </div>
                      <div className="form-group">
                        <label for="cuisineInput">Cuisine</label>
                        <input className="form-control" id="cuisineInputI" type="text" name="cuisine" required
                          placeholder="Michel's cuisine" model="newRestaurant.cuisine"></input>
                      </div>
                      <button className="btn btn-dark" onClick={this.addRestaurant.bind(this)}>Créer restaurant</button>
                            </form>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
      </body >

        );
  }
}

export default App;
