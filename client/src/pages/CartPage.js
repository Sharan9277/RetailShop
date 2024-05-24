import { Button, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import { Form,Input,Select,message } from 'antd';
import {DeleteOutlined , MinusCircleOutlined ,PlusCircleOutlined} from '@ant-design/icons'
import Modal from 'antd/lib/modal/Modal'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CartPage() {
    const {cartItems} = useSelector(state=>state.rootReducer);
    const [billChargeModal , setBillChargeModal] = useState(false)
    const [subtotal,setSubTotal] = useState(0)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const increaseQuantity=(record)=>{
      
        dispatch({type :'updateCart', payload:{...record , quantity : record.quantity+1 },
      });

    };

    const decreaseQuantity=(record)=>{
      
        if(record.quantity !==1){
            dispatch({type :'updateCart', payload:{...record , quantity : record.quantity +- 1 },
           }); 
        }

    };

    const columns = [
        {
           title : 'Name',
           dataIndex :'name'

        },
        {
           title : 'Image',
           dataIndex: 'image',
           render : (image,record)=> <img src={image} alt="" height='60' width='60'/>
        },
        {
            title :'Price/kg',
            dataIndex :'price'
        },
        {
            title : 'Quantity',
            dataIndex:'_id',
            render:(id,record)=> <div>
                 <PlusCircleOutlined className='mx-3' onClick={()=>increaseQuantity(record)}/>
                 <b>{record.quantity}</b>
                 <MinusCircleOutlined className='mx-3' onClick={()=>decreaseQuantity(record)}/>
            </div>
        },
        {
            title : 'Actions',
            dataIndex: '_id',
            render:(id,record)=> <DeleteOutlined onClick={()=>dispatch({type:'deleteFromCart',payload:record})} />
        }
    ];
     useEffect(() =>{

        let temp = 0;
        cartItems.forEach((item)=>{
        temp=temp + (item.price * item.quantity) 

     })
       
     setSubTotal(temp)

     },[cartItems]);

     const onFinish=(values)=>{
       const reqObject={
           ...values, 
           subtotal,
           cartItems,
           tax: Number(((subtotal / 100) * 10).toFixed(2)),
           totalAmount : Number(subtotal + Number(((subtotal / 100) * 10 ).toFixed(2))),
           userId : JSON.parse(localStorage.getItem('pos-user'))._id
       }

        axios
        .post('/api/bills/charge-bill', reqObject)
        .then(()=>{
          message.success('Bills Charged Successfully');
          navigate('/bills')
        })
        .catch(()=>{
          message.success('Something went wrong') 
        })
  
     };

  return <DefaultLayout>
       <h3>Cart</h3>
       <Table columns={columns} dataSource={cartItems} bordered pagination={false}/>
       <hr />
       <div className='d-flex justify-content-end flex-column align-items-end'>
            <div className='subtotal'>
                <h3>SUB TOTAL : <b>{subtotal} $/-</b></h3>
            </div>
       
       
       <Button type='primary' onClick={()=>setBillChargeModal(true)}>CHARGE BILL</Button>
       </div>
       
       <Modal title='Charge Bill' visible={billChargeModal} footer={false} onCancel={()=>setBillChargeModal(false)}>
       <Form 
         
         layout="vertical" onFinish={onFinish}>

            <Form.Item  name='customerName' label= 'Customer Name'>
              <Input  />
            </Form.Item>
            <Form.Item name='customerPhoneNumber' label='Phone Number'>
              <Input  />
            </Form.Item>
            
            
            <Form.Item name='paymentMode' label='Payment Mode'>
              <Select>
     
                  <Select.Option value='cash'>Cash</Select.Option>
                  <Select.Option value='card'>Card</Select.Option>
                   
              </Select>
            </Form.Item>

            <div className='charge-bill-amount'>
                 <h5>SubTotal : <b>{subtotal}</b></h5> 
                 <h5>Tax : <b>{((subtotal / 100) * 10).toFixed(2)}</b></h5>
                 <hr  />
                 <h2>Grand Total : <b>{subtotal + ((subtotal / 100) * 10)}</b> </h2>
                 
            </div>

            <div className='d-flex justify-content-end'>
                <Button type="primary" htmlType="submit" >GENERATE BILL</Button>
            </div>


          </Form>
       </Modal>
 
     </DefaultLayout>
  
}

export default CartPage