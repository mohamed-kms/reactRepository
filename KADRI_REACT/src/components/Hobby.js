
 import React, { Component } from 'react';

function Hobby(props) {
  
    return (
      <li onClick={() => props.removeHobby(props.name)}>{props.name}</li>
    );
  }

  export default Hobby;