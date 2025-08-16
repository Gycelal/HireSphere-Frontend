import {useSelector} from 'react-redux';


const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className='flex text-center'>
      {user ? (
       <>
        <h1>Welcome back, {user.first_name} {user.last_name}!</h1>
        <p>Your email: {user.email}</p>
        <p>Your role: {user.role}</p>
       </>
      ) : (
        <h1>Welcome to our platform!</h1>
      )}
    </div>
  );
}

export default Home;
