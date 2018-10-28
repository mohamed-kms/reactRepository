import React, { Component } from 'react';

 function Restaurant(props) {
   
     return (
         <tr >
         <td>{props.name}</td>
         <td>{props.cuisine}</td>
         <td>
            <button className="btn btn-dark">Edit</button>
            <button className="btn btn-dark">Delete</button>
         </td>
         </tr>
     );
   }


 
   export default Restaurant;