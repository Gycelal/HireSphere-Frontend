import { GoogleLogin } from "@react-oauth/google";
import { publicApi } from "../../services/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const GoogleButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await publicApi.post("/accounts/google/", {
        id_token: credentialResponse.credential,
        role
      });

      dispatch(
        loginSuccess({
          user: res.data.user,
          access: res.data.access,
        })
        
      );
      navigate("")
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
   <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default GoogleButton;







