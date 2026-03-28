import Logo from '../components/Logo';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';
import loginBg from '../assets/login_background.jpg';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { logUserIn } from '../services/apiAuth';

const StyledLogin = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(${(props) => props.bgImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  z-index: 90;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const Text = styled.div`
  position: absolute;
  z-index: 100;
  padding: 0.75rem;
  color: #fff;
  border: 1px solid lime;
  /* glassmorphism effect */
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const LoginButton = styled.button`
  background: rgba(31, 55, 69, 0.8);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  text-transform: uppercase;
  transition: all 0.3s ease-in-out;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(31, 55, 69, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
  }
`;

const StyledH2 = styled.h2`
  text-align: center;
`;

const StyledForm = styled.form`
  width: 300px;
`;

const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  &:focus {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
`;

function Login() {
  const { register, reset, handleSubmit } = useForm();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate: login, isPending: loading } = useMutation({
    mutationFn: logUserIn,
    onSuccess: (data) => {
      queryClient.setQueryData(['session'], data.user);
      navigate('/admin');
    },
    onError: (error) => {
      toast.error(error.message || 'Invalid email or password');
    },
  });

  function handleLogin(data) {
    login(data);
  }

  return (
    <StyledLogin bgImg={loginBg}>
      <Text>
        <div className="mb-3">
          <Logo />
        </div>
        <StyledH2 className="mb-4">Admin Login</StyledH2>
        <StyledForm onSubmit={handleSubmit(handleLogin)}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <StyledInput
              className="form-control text-light"
              {...register('email')}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <StyledInput
              type="password"
              name="password"
              className="form-control text-light"
              {...register('password')}
            />
          </div>

          <LoginButton type="submit">
            {loading && <LoadingSpinner />}
            Login
          </LoginButton>
        </StyledForm>
      </Text>
    </StyledLogin>
  );
}

export default Login;
