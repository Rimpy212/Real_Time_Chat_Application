import { useContext } from 'react'
import { createContext,useState,useEffect } from 'react'
import { account } from '../appwriteConfig';
import { useNavigate } from 'react-router-dom';
import { ID } from 'appwrite';

const AuthContext = createContext();


export const AuthProvider=({children})=>{
    const navigate = useNavigate();
    const [loading,setLoading]=useState(true);
    const [user,setUser]=useState(null);

    useEffect(()=>{ 
            //setLoading(false); we are no longer needed setting up loading here because we are doing in getUserOnLoad function
            getUserOnLoad()
    },[])


    //creating sessions here -- if we don't create session then whenever browser reloads it will redirect user to login page.
    const getUserOnLoad=async()=>{
        try{
            const accountDetails =await account.get();
            console.log("AccountDetails: ",accountDetails);
            setUser(accountDetails);
        }catch(error){
            console.error(error);
        }
        setLoading(false);
    }

    //Creating Email session by checking email and password entered by user (For Login)
    const handleUserLogin= async (e, credentials)=>{
            e.preventDefault();

            try{
                const response = await account.createEmailSession(credentials.email, credentials.password);
                console.log("LoggedIn: ",response);
                const accountDetails = account.get();
                setUser(accountDetails);
                navigate('/');
            }catch(error){
                console.error(error);
            }
    }


    const handleUserLogout=async()=>{
        account.deleteSession('current');
        setUser(null);
    }

    const handleUserRegister=async(e,credentials)=>{
        e.preventDefault();
        if(credentials.password1!== credentials.password2)
        {
            alert("Password do not match!")
            return;
        }
        try{
                let response=await account.create(ID.unique(),credentials.email,credentials.password1,credentials.name)
                console.log("Registered: ",response);
                //Created session for the registered user
                await account.createEmailSession(credentials.email,credentials.password1)
                const accountDetails =await account.get();
                console.log("AccountDetails: ",accountDetails);
                setUser(accountDetails);
                navigate('/');
        }
        catch(error){
            console.error(error);
        }
        
    }    

    const contextData={
        user, handleUserLogin,handleUserLogout,handleUserRegister
    }

    return <AuthContext.Provider value={contextData}>
        {loading ? <p>Loading....</p> : children}
    </AuthContext.Provider>
}

//creating custom hooks 
export const useAuth = () =>{
    return useContext(AuthContext)
}
export default AuthContext;
