import React, { useState, useEffect } from "react";
import axios from 'axios';
import awsconfig from '../aws-exports';
import { Link } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';
import "../styles/Customers.css";
import { access_token, URL } from "../aws-token" 
import EditIcon from '@material-ui/icons/Edit';

function Customers() {

  const URL = "https://hwwscimuxe.execute-api.ca-central-1.amazonaws.com/dev"
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");

  
  useEffect(sortCustomers, [search])

  function getCustomers() {
    axios.get(URL + '/customers/' , {
      headers: {
        'x-api-key': access_token
      }
    })
    .then(function (response) {
      const dbCustomers = orderCustomers(response.data.Items)
      setCustomers(dbCustomers)
      setFilteredCustomers(dbCustomers)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function orderCustomers(list) {
    let ids = [];
    let sorted = [];
    for (let c in list) {
      ids.push(list[c].customer_id)
    }
    ids.sort((a, b)=>{return b - a})
    sorted = [...ids]
    for (let i in list) {
      sorted[ids.indexOf(list[i].customer_id)] = list[i];
    }
    return sorted
  }

  function sortCustomers() {
    let newFilteredCustomers = []
    if (search !== ""){
      customers.forEach(element => {
          if (element.customer_id.toString().includes(search)
          || element.cus_org_name.toUpperCase().includes(search) 
          || element.c_creation_date.toString().includes(search)
          || element.cus_status.toUpperCase().includes(search) 
          || element.cus_contact.c_name.toUpperCase().includes(search)) {
            newFilteredCustomers.push(element);
          }
      });
      if (newFilteredCustomers.length === 0){
        newFilteredCustomers.push({customer_id:"No match found", cus_contact: ""})
      }
    } else {
      newFilteredCustomers = customers;
    }
    setFilteredCustomers(newFilteredCustomers);
  }

  function handleChange(e){
    setSearch(e.target.value.toString().toUpperCase())
  }
  

  useEffect(getCustomers, [])
  


  return (
      <div className="container">
      <br></br>
      
      <div className="row justify-content-center">
        <div className="col-9">
          <div className="input-group input-group-md mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-sm">Search</span>
              {/* <input type="button" className="input-group-text" value="Search" /> */}
            </div>
            <input onChange={handleChange} type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></input>
          </div>
        </div>
        <div>
          <LinkContainer to="/new_customer">
            <a className="btn btn-primary btn-theme">Create Customer</a>
          </LinkContainer>
        </div>
      </div>

      <br></br>

      <div className="row justify-content-center">
        <div className="col-12">
          <table className="table table-sm table-hover table-striped">
              <tr className="thead-green">
                <th className="text-center left_radius">ID</th>
                <th className="text-center">Name</th>
                <th className="text-center">Organization</th>
                <th className="text-center">Status</th>
                <th className="text-center">Creation Date</th>
                {/* <th className="text-center">More Info</th> */}
                <th></th>
                {/* <th></th> */}
                <th className="text-center right_radius"></th>
              </tr>
            <tbody>
              {filteredCustomers.map((customer, index) => 
                <tr key={index}>
                  <td className="text-center" id="customer_id">{String(customer.customer_id)}</td>
                  <td className="text-center table-data">{customer.cus_contact.c_name}</td>
                  <td className="text-center" id="name">{customer.cus_org_name}</td>
                  <td className="text-center" id="email">{customer.cus_status}</td>
                  <td className="text-center">{String(customer.c_creation_date).slice(0, 10)}</td>
                  <td className="text-center" style={{width:"100px"}}>
                    <Link to={{
                    pathname: `/profile/${customer.customer_id}`,
                    query: { customer_id: `${customer.customer_id}` }}} 
                    className="btn btn-sm btn-theme btn-middle">More Info</Link>
                  </td>
                  {/* <td style={{width:"170px"}}><Link to={{
                    pathname: `/create_order/${customer.customer_id}`,
                    query: { customer_id: `${customer.customer_id}` }
                    }} className="btn btn-sm btn-theme btn-middle">Submit an Order</Link>
                  </td> */}
                  <td className="text-center"><Link to={{
                    pathname: `/customer/edit/${customer.customer_id}`}}><EditIcon style={{color:"grey"}}/></Link></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>    
  );
}


export default Customers;