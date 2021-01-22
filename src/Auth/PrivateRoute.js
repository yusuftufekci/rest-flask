import {Redirect, Route} from 'react-router-dom';
import Layout from "../Components/Layout";


const PrivateRoute = ({user, setUser, children, ...rest}) => {

    return (
        <Route
            {...rest}
            render={({location}) =>
                user ? (
                    <Layout user={user} setUser={setUser}>{children}</Layout>
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute;
