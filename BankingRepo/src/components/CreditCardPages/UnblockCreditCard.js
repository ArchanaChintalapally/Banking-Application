import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import image from '../../img/debitbg.jpg';
import useUpdateCookies from '../../services/UpdateCookies';

function UnBlockCreditCard() {
  const loginStatus= Cookies.get("loginStatus");
  const activeAccount = Cookies.get("ActiveAccount");
  const navigate = useNavigate();
  // const[cardNoErr,setCardNoErr]=useState({});
  const[pinNoErr,setPinNoErr]=useState({});
  const[cvvErr,setCvvErr]=useState({});

  const token = Cookies.get('token');

  const {updateCreditCookies} = useUpdateCookies();


  const [unBlockcardInfo, setUnBlockcardInfo] = useState();

  useEffect(()=>{
    if(!loginStatus)
      navigate("/login");

},[])

useEffect(() => {
  const timeout = setTimeout(() => {
    setUnBlockcardInfo((prevState) => ({
      ...prevState,
      cardNo: JSON.parse(window.localStorage.getItem("Credit")).filter((credit) => credit?.accountNo == activeAccount)[0]?.cardNo,
      status: 'Active',
    }));
  }, []);

  return () => clearTimeout(timeout);
}, [unBlockcardInfo]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnBlockcardInfo((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formValidation()) {
  axios.post('http://localhost:8080/api/user/unblockcreditcard', unBlockcardInfo,{
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then((response) => {
      // Handle success
      updateCreditCookies(activeAccount);
      window.alert("Card unblocked");
      console.log(unBlockcardInfo);
      navigate('/');
    })
    .catch((error) => {
      // Handle error
      window.alert(error.response.data.message);
    });
  }
  };

  const formValidation = () => {
    // const cardNoErr = {};
    const pinNoErr = {};
    const cvvErr = {};

    let isValid = true;

    // if(unBlockcardInfo?.cardNo.trim().length===0){
    //  cardNoErr.cardNoEmpty = "Card Number is required";
    //  isValid = false;
    // } else if((unBlockcardInfo?.cardNo.toString().length!==16)){
    //   cardNoErr.cardNolength = "Card Number should be 16 digits";
    //   isValid = false;
    // }
     if(unBlockcardInfo?.pinNo.trim().length===0){
      pinNoErr.pinNoEmpty = "Pin Number is required";
      isValid = false;
    } else if((unBlockcardInfo?.pinNo.toString().length!==4)){
      pinNoErr.pinNolength = "Pin Number should be 4 digits";
      isValid = false;
    }
    if(unBlockcardInfo?.cvv.trim().length===0){
      cvvErr.cvvEmpty = "Cvv is required";
      isValid = false;
     } else if((unBlockcardInfo?.cvv.toString().length!==3)){
       cvvErr.cvvLength = "Cvv should be 3 digits";
       isValid = false;
     }
    // setCardNoErr(cardNoErr);
    setPinNoErr(pinNoErr);
    setCvvErr(cvvErr);
    return isValid;

  }
  return (
    <div>
    <div style={{ backgroundImage:`url(${image})`,backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position:"fixed",
    top:"30px",
    left:0,
    right:0,
    bottom:0,
    overflow: 'hidden',padding:"30px"}}>
    <div className='row' >
    <div className='card col-md-6 offset-md-3 offset-md-3' style={{'margin-top': '130px', marginBottom: '180px'}}>
      <div className='card-body'>

       <form onSubmit={handleSubmit}>
           <center><h3>UnBlock Credit Card</h3></center><br/>

                <div className="mb-3">
                  <h5><label>Card no</label></h5>
                  <input type="number" className="form-control" name="cardNo" value={unBlockcardInfo?.cardNo} onChange={handleChange} placeholder="cardNo" />
                </div>

                {/* {Object.keys(cardNoErr).map((key)=>{
                 return <div style={{color : "red"}}>{cardNoErr[key]}</div>
                 })} */}

                  <div className="mb-3">
                     <h5><label>Enter cvv</label></h5>
                     <input type="number" className="form-control" name="cvv" value={unBlockcardInfo?.cvv} onChange={handleChange} placeholder="cvv" />
                  </div>

                  {Object.keys(cvvErr).map((key)=>{
                   return <div style={{color : "red"}}>{cvvErr[key]}</div>
                  })}

                  <div className="mb-3">
                     <h5><label>Enter Pin</label></h5>
                     <input type="number" className="form-control" name="pinNo" value={unBlockcardInfo?.pinNo} onChange={handleChange} placeholder="pinNo"  />
                  </div>

                  {Object.keys(pinNoErr).map((key)=>{
                   return <div style={{color : "red"}}>{pinNoErr[key]}</div>
                  })}

               <center><Button type="submit" >UnBlock Card</Button></center>
             </form>
         </div>
     </div>
  </div>
    </div>
    </div>
  )
}

export default UnBlockCreditCard