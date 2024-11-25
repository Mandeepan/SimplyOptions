import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleDemoLogin1 = () => {
    const user = {
      email:'nonissuerdemo@simplyoptions.com',
      password:'password123'
    };
    return dispatch(thunkLogin(user));
  }

  const handleDemoLogin2 = () => {
    const user = {
      email:'issuerdemo@simplyoptions.com',
      password:'password456'
    };
    return dispatch(thunkLogin(user));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className='login-page'>
      <div className="video-background">
          <video autoPlay loop muted className="fullscreen-video">
              <source src="cover.mp4" type="video/mp4" />
              Your browser does not support the video tag.
          </video>
      </div>
      <div className="content-overlay">
        <h2 className='login-title'>Log in to SimplyOptions</h2>
          {errors.length > 0 &&
            errors.map((message) => <p key={message}>{message}</p>)}
            <form className = 'login-form' onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {errors.email && <p className='error'>{errors.email}</p>}
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.password && <p className='error'>{errors.password}</p>}
            <button className= 'login-button' type="submit">Log In</button>
            <button 
              onClick ={handleDemoLogin1} 
              className='login-button'
              type="button">
              Log In As Demo User(Non Issuer)
            </button>
            <button 
              onClick ={handleDemoLogin2} 
              className='login-button'
              type="button">
              Log In As Demo User(As Issuer)
            </button>

          </form>
          <div className='SignUpLink'>
            <a href='/signup'>Don&apos;t have an account yet? Sign up one here.</a>
          </div>
        </div>
    </div>

  );
}

export default LoginFormPage;
