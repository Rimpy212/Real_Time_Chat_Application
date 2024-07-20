import React,{useEffect, useState} from 'react'
import { useAuth } from '../utils/AuthContext'
import { useNavigate, useSearchParams, Link } from 'react-router-dom';


const LoginPage = () => {
    const {user,handleUserLogin}= useAuth();
    const navigate = useNavigate();

    const [credentials,setCredentials]=useState({
      email:'',
      password:''
    })
    //Applying the condition if user is allowed then it will redirect it to login page
    useEffect(()=>{
        if(user){
                navigate('/');
        }
    },[])


    const handleInputChange =(e)=>{
        let name=e.target.name;
        let value=e.target.value;
        //Dynamically taking input as [name] it will take input dynamically otherwise if we exclude [] brackets then it will take it as string
        setCredentials({...credentials,[name]:value} )
        console.log(credentials);
    }

  return (
    <div className='auth--container'>
      <div className="form--wrapper">
        <form onSubmit={(e)=>{handleUserLogin(e,credentials)}}>
          <div className='field--wrapper'>
            <label>
              Email:
            </label>
            <input type='email' required name='email' placeholder='Enter your email....' value={credentials.email} onChange={handleInputChange}/>
          </div>

          <div className='field--wrapper'>
            <label>
              Password:
            </label>
            <input type='password' required name='password' placeholder='Enter your password' value={credentials.password} onChange={handleInputChange}/>
          </div>
          <div className='field--wrapper'>
             <input className='btn btn--lg btn--main' type='submit' value="Login"/>
          </div>
        </form>
    <p>Don't have account? Register <Link to='/register'>here</Link> </p>
      </div>
    </div>
  )
}

export default LoginPage
