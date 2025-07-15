import {useSelector} from 'react-redux';

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className='flex text-center'>
      {user ? (
        <h1>Welcome back, {user.name}!</h1>
      ) : (
        <h1>Welcome to our platform!</h1>
      )}
    </div>
  );
}

export default Home;
