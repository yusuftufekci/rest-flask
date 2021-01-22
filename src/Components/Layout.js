import React from 'react';
import Navigation from "./Navigation";

const Layout = (props) => {
    return <>
        <h3 className="m-3 d-flex justify-content-center">
            Smart Campus
        </h3>
        
        <Navigation user={props.user} setUser={props.setUser}/>
        {props.children}
    </>
};

export default Layout;