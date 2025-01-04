import { useState, useEffect, useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import "./SignupFormPage.css"

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isIssuer, setIsIssuer] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [shouldDisable, setShouldDisable]=useState(false)
  const [formTouched, setFormTouched]=useState(false)


  const validateForm = useCallback(() => {
    const newErrors = {};
    // all validations
    if (password !== confirmPassword) {
      newErrors.confirmPassword="Confirm Password field must be the same as the Password field"
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        newErrors.email= "Please enter a valid email address"
    }
    if (password.length < 8){
      newErrors.password= "Password has at least 8 characters."
    }
    if (firstName=="") newErrors.firstName="First name cannot be empty";
    if (lastName=="") newErrors.lastName="Last name cannot be empty";
    return newErrors
  },[email, firstName,lastName,password,confirmPassword])

  useEffect(()=>{
    if (formTouched) {
      const newErrors = validateForm();
      setErrors(newErrors);
      setShouldDisable(Object.keys(newErrors).length > 0);
    }
  },[formTouched, validateForm,email, firstName,lastName,password,confirmPassword])


  if (sessionUser) return <Navigate to="/" replace={true} />;

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch("/api/users/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.exists) {
        return "This email is already registered.Please proceed to log in.";
      }
      return null;
    } catch (error) {
      console.error("Error checking email:", error);
      return "Unable to verify email uniqueness at the moment.";
    }
  };

  const handleFormChanged=()=>{
    if (!formTouched) setFormTouched(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formTouched){
      const emailError = await checkEmailExists(email);
      if (emailError) {
        setErrors({...errors, emailExistError: emailError });
        setShouldDisable(true);
        return;
      }

      try{
        await dispatch(
          thunkSignup({
            firstName,
            lastName,
            email,
            password,
            isIssuer
          })
        );
        navigate('/')
      }catch (error) {
          console.error('Error signing up user:', error);
          setErrors({...errors, "FetchError":error})
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="video-background">
          <video autoPlay loop muted className="fullscreen-video">
              <source src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/cover.mp4" type="video/mp4" />
              Your browser does not support the video tag.
          </video>
      </div>
      <div className="content-overlay"></div>
      <h2 className='signup-title'>Register A New Account</h2>
      {errors.server && <p className='error'>{errors.server}</p>}
      <form className="signup-form" onSubmit={handleSubmit} onChange={handleFormChanged}>
      <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className='error'>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className='error'>{errors.lastName}</p>}
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
        {errors.emailExistError && <p className='error'>{errors.emailExistError}</p>}
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
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className='error'>{errors.confirmPassword}</p>}
        <label id="issuer-checkbox-container">
          <input
            type="checkbox"
            checked={isIssuer}
            onChange={(e) => setIsIssuer(e.target.checked)}
          />
          Register as Issuer
        </label>
        {errors.FetchError && <p className='error'>{errors.FetchError}</p>}
        <button type="submit" className="signup-button" disabled={shouldDisable}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
