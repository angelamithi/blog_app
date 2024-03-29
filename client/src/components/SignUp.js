import React from 'react'
import {useFormik} from 'formik'
import * as yup from "yup"
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const SignUp = ({setShowSignIn}) => {
    const navigate=useNavigate()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const formSchema = yup.object().shape({
      username: yup.string().required("Must Enter a username"),
      email: yup.string().email("invalid email"),
      password: yup.string().required("Must Enter a Password").min(8),
    });
  
    const formik = useFormik({
      initialValues: {
        username: "",
        firstname:"",
        lastname:"",
        email: "",
        password: "",
        confirmPassword:""
      },
  
      validationSchema: formSchema,
      onSubmit: (values, { resetForm }) => {
        setLoading(true);
        setError(null);
  
        fetch(`https://blog-mxao.onrender.com/check-email`,{method:"POST", headers:{"Content-Type":"application/json"}
      ,body:{email:formik.values.email}})
          .then((resp) => resp.json())
          .then((data) => {
            if (data.exists) {
              setLoading(false);
              setError("Email address already exists. Please choose a different one.");
            } else {
              fetch('https://blog-mxao.onrender.com/register', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
              })
                .then((res) => {
                  setLoading(false);
                  if (res.status === 200) {
                    setShowSignIn(true)
                    
                    navigate('/signIn')

                  } else {
                    resetForm()
                    setError("Error creating user. Please try again.");
                    
                  }
                })
                .catch((error) => {
                  setLoading(false);
                  setError("Error creating user. Please try again.");
                  console.error("Error while signing up:", error);
                });
            }
          })
          .catch((error) => {
            setLoading(false);
            setError("Error checking email. Please try again.");
            console.error("Error checking email:", error);
          });
      },
    });
  
    return (
      <div className='ui centered card'>
        <h1>User Sign Up Form</h1>
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor='username'>Username</label>
          <br />
          <input id='username' name='username' onChange={formik.handleChange} value={formik.values.username} />
          <p style={{ color: "red" }}>{formik.errors.username}</p>


          <label htmlFor='firstname'>First Name</label>
          <br />
          <input id='firstname' name='firstname' onChange={formik.handleChange} value={formik.values.firstname} />
          <p style={{ color: "red" }}>{formik.errors.firstname}</p>

          <label htmlFor='lastname'>Last Name</label>
          <br />
          <input id='lastname' name='lastname' onChange={formik.handleChange} value={formik.values.lastname} />
          <p style={{ color: "red" }}>{formik.errors.lastname}</p>



          
  
          <label htmlFor='email'>Email</label>
          <br />
          <input id='email' name='email' onChange={formik.handleChange} value={formik.values.email} />
          <p style={{ color: "red" }}>{formik.errors.email}</p>
  
          <label htmlFor='password'>Password</label>
          <br />
          <input id='password' name='password' type='password' onChange={formik.handleChange} value={formik.values.password} />
          <p style={{ color: "red" }}>{formik.errors.password}</p>

          <label htmlFor='confirmPassword'>Confirm Password</label>
          <br />
          <input id='confirmPassword' name='confirmPassword' type='password' onChange={formik.handleChange} value={formik.values.confirmPassword} />
          <p style={{ color: "red" }}>{formik.errors.confirmPassword}</p>
  
          <button type="submit" disabled={loading} className="mini ui teal button" style={{marginBottom:"30px" }}>
            {loading ? "Loading..." : "Submit"}
          </button>
  
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>

        <Link className='Back' to='/'>Back to HomePage</Link>
      </div>
    );
  };
  
  export default SignUp;