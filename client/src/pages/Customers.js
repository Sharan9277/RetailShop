import DefaultLayout from '../components/DefaultLayout'
import axios from 'axios'
import React , {useEffect, useState, useRef}from 'react'
import { useDispatch } from 'react-redux';
import {DeleteOutlined , EyeOutlined  } from '@ant-design/icons'
import { Button,Form,Input,Select,Table,message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import {ReactToPrint, useReactToPrint }from 'react-to-print';

 
function Customers() 
{
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  
  const dispatch = useDispatch();
  const getAllBills = () => {
    dispatch({type:'showLoading'})
    axios
    .get('/api/bills/get-all-bills')
    .then((response) => {
      dispatch({type:'hideLoading'});
      const data = response.data;
      data.reverse()
      setBillsData(data);
    })
    .catch((error) => {
      dispatch({type:'hideLoading'}); 
      console.log(error)
    });
  };
    
  const columns = [
    {
       title : 'Customer',
       dataIndex: 'customerName',
       
    },
    {
        title :'Phone Number',
        dataIndex :'customerPhoneNumber',
    },
    {
      title :'Created On',
      dataIndex :'createdAt',
      render :(value)=><span>{value.toString().substring(0,10)}</span>
    },
     
  ];
   
  useEffect(() => {
     getAllBills();
  }, []);
  
  return (
     <DefaultLayout>
         <div className="d-flex justify-content-between">
          <h3>Customers</h3>
           
         </div>
         <Table columns={columns} dataSource={billsData} bordered />

       
 

     </DefaultLayout>
  );

}  

export default Customers;
