import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthForm from "../components/AuthForm";

const Login = () => {
  return <AuthForm type="login" icon={LockOutlinedIcon} />;
};

export default Login;
