import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import apiRequest from "../../lib/apiRequest";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";


export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = getAuth(app);

    const handleGoogleAuth = async () => {
        const provide = new GoogleAuthProvider();
        provide.setCustomParameters({ prompt: 'select_account' });
        try{
            const googleAuthRes = await signInWithPopup(auth, provide);
            const res = await apiRequest.post('/auth/google-login', {
                name: googleAuthRes.user.displayName,
                email: googleAuthRes.user.email,
                photo: googleAuthRes.user.photoURL
            })
            dispatch(loginSuccess(res.data));
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <Button type='button' gradientDuoTone="redToYellow" outline onClick={handleGoogleAuth}>
        <AiFillGoogleCircle className="mr-3 self-center w-5 h-5" />
        Continue with Google
    </Button>
  )
}
