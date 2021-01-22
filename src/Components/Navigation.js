import React from 'react';
import {NavLink} from 'react-router-dom';
import {Nav, Navbar} from 'react-bootstrap';

const links = [
    {text: "Home", link: "/", roles: ["student", "instructor", "admin"]},
    {text: "Lecture Schedule", link: "/Lecture", roles: ["student", "instructor"]},
    {text: "Study Group", link: "/StudyGroup", roles: ["student"]},
    {text: "Upload Excel", link: "/uploadExcel", roles: ["admin"]}
];


const Navigation = (props) => {
    return (
        <Navbar bg="dark" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {props.user ? links.map((value, index) => {
                        return value.roles.includes(props.user.role) ?
                            <NavLink key={index} className="d-inline p-2 bg-dark text-white"
                                     to={value.link}>{value.text}</NavLink> : null
                    }) : null}
                </Nav>
                <button className="btn btn-danger my-lg-0" onClick={() => props.setUser(false)}>Logout</button>


            </Navbar.Collapse>
        </Navbar>
    )
};

export default Navigation;


 